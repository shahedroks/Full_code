import { MessageSquare, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { AppService } from '@/services/AppService';

interface Chat {
  id: string;
  bookingId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  categoryName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  bookingStatus: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}

interface MessagesScreenProps {
  onSelectChat: (providerId: string, bookingId?: string) => void;
}

export function MessagesScreen({ onSelectChat }: MessagesScreenProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const appService = AppService.getInstance();
      
      // Get all customer bookings (excluding cancelled)
      const bookings = await appService.getBookingsByCustomer('customer1');
      const activeBookings = bookings.filter(b => b.status !== 'cancelled');
      
      // Transform bookings into chat conversations
      const chatData = await Promise.all(
        activeBookings.map(async (booking) => {
          const [provider, category] = await Promise.all([
            appService.getProviderById(booking.providerId),
            appService.getCategoriesForTown(booking.townId).then(cats => 
              cats.find(c => c.id === booking.categoryId)
            ),
          ]);

          // Generate mock last message based on booking status
          const lastMessages = {
            pending: 'Thanks for booking! I\'ll confirm the details shortly.',
            confirmed: 'See you on the scheduled date!',
            'in-progress': 'I\'m on my way to your location.',
            completed: 'Thanks for choosing our service!',
          };

          // Calculate time ago
          const bookingDate = new Date(booking.scheduledDate);
          const now = new Date();
          const diffHours = Math.abs(now.getTime() - bookingDate.getTime()) / 36e5;
          
          let timeAgo = '';
          if (diffHours < 1) {
            timeAgo = `${Math.floor(diffHours * 60)}m ago`;
          } else if (diffHours < 24) {
            timeAgo = `${Math.floor(diffHours)}h ago`;
          } else if (diffHours < 48) {
            timeAgo = 'Yesterday';
          } else {
            timeAgo = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }

          return {
            id: `chat-${booking.id}`,
            bookingId: booking.id,
            providerId: booking.providerId,
            providerName: provider?.displayName || 'Service Provider',
            providerAvatar: provider?.avatar || '',
            categoryName: category?.name || 'Service',
            lastMessage: lastMessages[booking.status] || 'Message received',
            lastMessageTime: bookingDate,
            timeAgo,
            unreadCount: booking.status === 'pending' ? 1 : 0,
            bookingStatus: booking.status,
          };
        })
      );

      // Sort by most recent
      chatData.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
      
      setChats(chatData as any);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[#2384F4]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="px-4 py-6">
        <h2 className="text-xl mb-1 text-white font-semibold">Messages</h2>
        <p className="text-sm text-white/80 mb-4">
          {chats.length === 0 ? 'No active conversations' : `${chats.length} active conversation${chats.length !== 1 ? 's' : ''}`}
        </p>

        {/* Search Bar */}
        {chats.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-100 focus:border-[#408AF1] focus:ring-2 focus:ring-[#408AF1]/20 outline-none transition-all"
            />
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {filteredChats.length > 0 ? (
          <>
            {filteredChats.map((chat, index) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectChat(chat.providerId, chat.bookingId)}
                className="w-full px-4 py-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all text-left flex items-start gap-3"
              >
                {/* Avatar with unread badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.providerAvatar}
                    alt={chat.providerName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#408AF1] text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>

                {/* Chat content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{chat.providerName}</h3>
                      <p className="text-xs text-gray-500">{chat.categoryName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">{(chat as any).timeAgo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(chat.bookingStatus)}`}>
                        {chat.bookingStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {chat.lastMessage}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-3" />
              </motion.button>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="font-semibold text-gray-900 mb-1">No results found</h3>
                <p className="text-sm text-gray-500">
                  Try searching with different keywords
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 mb-1">No messages yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Book a service to start chatting with providers
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}