import { MessageSquare, ChevronRight, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Chat {
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  bookingId: string;
  categoryName: string;
}

interface SellerMessagesScreenProps {
  onSelectChat: (customerId: string, bookingId: string) => void;
}

export function SellerMessagesScreen({ onSelectChat }: SellerMessagesScreenProps) {
  // Mock chat data - this will be replaced with real data from API
  const chats: Chat[] = [
    {
      customerId: 'customer1',
      customerName: 'John Doe',
      customerAvatar: '',
      lastMessage: 'Thank you! See you tomorrow.',
      timestamp: '10:30 AM',
      unread: 2,
      bookingId: 'booking1',
      categoryName: 'Plumbing',
    },
    {
      customerId: 'customer2',
      customerName: 'Sarah Johnson',
      customerAvatar: '',
      lastMessage: 'What time will you arrive?',
      timestamp: 'Yesterday',
      unread: 0,
      bookingId: 'booking2',
      categoryName: 'Electrical',
    },
    {
      customerId: 'customer3',
      customerName: 'Mike Williams',
      customerAvatar: '',
      lastMessage: 'Great job, thanks!',
      timestamp: 'Jan 15',
      unread: 0,
      bookingId: 'booking3',
      categoryName: 'Cleaning',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="px-4 py-6">
        <h2 className="text-xl text-white font-semibold">Messages</h2>
        <p className="text-sm text-white/80 mt-1">Chat with your customers</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {chats.length > 0 ? (
          <>
            {chats.map((chat, index) => (
              <motion.button
                key={chat.customerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectChat(chat.customerId, chat.bookingId)}
                className="w-full px-4 py-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all text-left flex items-center gap-3"
              >
                <div className="relative">
                  {chat.customerAvatar ? (
                    <img
                      src={chat.customerAvatar}
                      alt={chat.customerName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-[#408AF1]/10 to-[#5ca3f5]/10 rounded-xl flex items-center justify-center">
                      <User className="w-7 h-7 text-[#408AF1]" />
                    </div>
                  )}
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {chat.unread}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{chat.customerName}</h3>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {chat.categoryName}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </motion.button>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium mb-1">No messages yet</h3>
            <p className="text-sm text-gray-500">
              Customer messages will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}