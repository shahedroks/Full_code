import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, Image as ImageIcon, ChevronLeft, Shield, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { AppService } from '@/services/AppService';
import { AuthService } from '@/services/AuthService';
import { detectContactAttempt } from '@/app/utils/chatProtection';
import { ContactWarningModal } from '@/app/components/ContactWarningModal';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  sent?: boolean;
  read?: boolean;
}

interface ChatScreenProps {
  bookingId?: string;
  userRole?: 'customer' | 'provider';
  provider?: { id: string; name: string; avatar?: string };
  onBack: () => void;
}

export function ChatScreen({ bookingId, userRole, provider, onBack }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState<'phone' | 'email' | 'phrase'>('phone');
  const [chatPartner, setChatPartner] = useState<{ name: string; avatar?: string; isOnline: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bookingId && userRole) {
      loadChatData();
    } else if (provider) {
      setChatPartner({ name: provider.name, avatar: provider.avatar, isOnline: true });
      setMessages(generateInitialMessages(provider.name));
      setLoading(false);
    }
  }, [bookingId, userRole, provider]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateInitialMessages = (providerName: string): Message[] => {
    const now = new Date();
    const messages: Message[] = [
      {
        id: '1',
        senderId: 'provider',
        content: `Hi! I'm ${providerName}. How can I help you today?`,
        timestamp: formatTime(new Date(now.getTime() - 3600000)),
        sent: true,
        read: true,
      },
      {
        id: '2',
        senderId: 'user',
        content: 'Hi! I was wondering about your availability this week.',
        timestamp: formatTime(new Date(now.getTime() - 3000000)),
        sent: true,
        read: true,
      },
      {
        id: '3',
        senderId: 'provider',
        content: 'I have openings on Tuesday and Thursday afternoon. Would either of those work for you?',
        timestamp: formatTime(new Date(now.getTime() - 2400000)),
        sent: true,
        read: true,
      },
    ];
    return messages;
  };

  const loadChatData = async () => {
    try {
      if (!bookingId) return;
      
      const booking = await AppService.getInstance().getBookingById(bookingId);
      if (!booking) return;

      setBookingInfo(booking);

      // Get the other party's information
      if (userRole === 'customer') {
        const providerInfo = await AppService.getInstance().getProviderById(booking.providerId);
        if (providerInfo) {
          setChatPartner({ 
            name: providerInfo.displayName || providerInfo.name,
            avatar: providerInfo.avatar,
            isOnline: Math.random() > 0.3, // Mock online status
          });
        }
      } else {
        // Provider view - show customer as "Customer" for privacy
        setChatPartner({ 
          name: 'Customer',
          avatar: 'https://images.unsplash.com/photo-1683815251677-8df20f826622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjkxNTc0Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          isOnline: true,
        });
      }

      // Generate conversation based on booking status
      const conversationMessages = generateBookingConversation(booking);
      setMessages(conversationMessages);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load chat data:', error);
      setLoading(false);
    }
  };

  const generateBookingConversation = (booking: any): Message[] => {
    const now = new Date();
    const baseMessages: Message[] = [
      {
        id: '1',
        senderId: 'provider',
        content: 'Thanks for booking with us! I\'ve received your request.',
        timestamp: formatTime(new Date(now.getTime() - 7200000)),
        sent: true,
        read: true,
      },
      {
        id: '2',
        senderId: 'user',
        content: 'Great! What time works best for you?',
        timestamp: formatTime(new Date(now.getTime() - 6900000)),
        sent: true,
        read: true,
      },
    ];

    if (booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed') {
      baseMessages.push({
        id: '3',
        senderId: 'provider',
        content: `I've confirmed your appointment for ${booking.scheduledDate} at ${booking.scheduledTime}. See you then!`,
        timestamp: formatTime(new Date(now.getTime() - 3600000)),
        sent: true,
        read: true,
      });
    }

    if (booking.status === 'in-progress') {
      baseMessages.push({
        id: '4',
        senderId: 'provider',
        content: 'I\'m on my way to your location now!',
        timestamp: formatTime(new Date(now.getTime() - 1800000)),
        sent: true,
        read: true,
      });
    }

    if (booking.status === 'completed') {
      baseMessages.push(
        {
          id: '4',
          senderId: 'provider',
          content: 'Service completed! Thank you for choosing us.',
          timestamp: formatTime(new Date(now.getTime() - 900000)),
          sent: true,
          read: true,
        },
        {
          id: '5',
          senderId: 'user',
          content: 'Thank you! Great service.',
          timestamp: formatTime(new Date(now.getTime() - 600000)),
          sent: true,
          read: true,
        }
      );
    }

    return baseMessages;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleMessageChange = (text: string) => {
    setMessage(text);
    const detection = detectContactAttempt(text);
    if (detection.isViolation && detection.violationType) {
      setShowWarning(true);
      setWarningType(detection.violationType);
    } else {
      setShowWarning(false);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    const detection = detectContactAttempt(message);
    if (detection.isViolation) {
      setShowWarning(true);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content: message,
      timestamp: formatTime(new Date()),
      sent: true,
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    setShowWarning(false);

    // Simulate provider typing and response
    if (Math.random() > 0.3) {
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'Thanks for your message! I\'ll get back to you shortly.',
          'Got it! I\'ll check my schedule and confirm.',
          'Absolutely! That works for me.',
          'No problem at all. I\'m happy to help!',
          'Great question! Let me provide some details...',
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'provider',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: formatTime(new Date()),
          sent: true,
          read: false,
        };
        setMessages(prev => [...prev, response]);
      }, 2000 + Math.random() * 2000);
    }

    toast.success('Message sent');
  };

  const handleAttachment = () => {
    toast.info('Attachment feature coming soon');
  };

  const handleImage = () => {
    toast.info('Image sharing coming soon');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[#2384F4]">
        <div className="w-12 h-12 border-4 border-[#408AF1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <img
            src={chatPartner?.avatar || ''}
            alt={chatPartner?.name || 'Chat Partner'}
            className="w-11 h-11 rounded-xl object-cover"
          />

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{chatPartner?.name || 'Chat Partner'}</h2>
            <div className="flex items-center gap-1.5 text-xs">
              {chatPartner?.isOnline ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-600 font-medium">Online</span>
                </>
              ) : (
                <span className="text-gray-500">Offline</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, index) => {
          const isUser = msg.senderId === 'user';
          const showAvatar = !isUser && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {!isUser && (
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar && (
                    <img
                      src={chatPartner?.avatar || ''}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  )}
                </div>
              )}

              <div className={`max-w-[75%] ${isUser ? 'bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white' : 'bg-white border border-gray-100'} rounded-2xl px-4 py-2.5 shadow-sm`}>
                <p className={`text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-900'}`}>
                  {msg.content}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <p className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                  {isUser && (
                    <span className="ml-1">
                      {msg.read ? (
                        <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                      ) : msg.sent ? (
                        <Check className="w-3.5 h-3.5 text-white/70" />
                      ) : null}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start gap-2"
            >
              <img
                src={chatPartner?.avatar || ''}
                alt=""
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Contact Warning Modal */}
      <ContactWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onEdit={() => setShowWarning(false)}
        violationType={warningType}
      />

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="flex gap-2 items-end">
          <button 
            onClick={handleAttachment}
            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={handleImage}
            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#408AF1]/20 border border-gray-200 focus:border-[#408AF1] transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white p-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#408AF1]/20 transition-all hover:shadow-xl hover:shadow-[#408AF1]/30 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}