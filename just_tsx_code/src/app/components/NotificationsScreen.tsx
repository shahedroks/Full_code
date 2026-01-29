import { motion } from 'motion/react';
import { Bell, Calendar, MessageSquare, TrendingUp, Clock, X, ArrowLeft } from 'lucide-react';

const notifications = [
  {
    id: '1',
    type: 'booking',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Booking Confirmed',
    message: 'Mike\'s Plumbing confirmed your appointment for tomorrow at 2:00 PM',
    timestamp: '5 min ago',
    unread: true,
  },
  {
    id: '2',
    type: 'message',
    icon: MessageSquare,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'New Message',
    message: 'Elite Electric Co. sent you a message',
    timestamp: '1 hour ago',
    unread: true,
  },
  {
    id: '4',
    type: 'promotion',
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: 'Special Offer',
    message: 'Get 15% off your next HVAC service this week',
    timestamp: '3 hours ago',
    unread: false,
  },
  {
    id: '5',
    type: 'reminder',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    title: 'Upcoming Appointment',
    message: 'Your appointment with Sparkle Clean is tomorrow',
    timestamp: '1 day ago',
    unread: false,
  },
];

interface NotificationsScreenProps {
  onClose?: () => void;
  onBack?: () => void;
}

export function NotificationsScreen({ onClose, onBack }: NotificationsScreenProps) {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {unreadCount}
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        <p className="text-sm text-white/70">Stay updated on your bookings</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer ${
                    notification.unread ? 'border-[#408AF1]/30 shadow-[#408AF1]/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-12 h-12 ${notification.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${notification.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#408AF1] ml-2 mt-1 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <Bell className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">No notifications</h3>
            <p className="text-sm text-white/70">
              We'll notify you about booking updates and messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
