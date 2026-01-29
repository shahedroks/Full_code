import { Home, Calendar, MessageSquare, DollarSign, User } from 'lucide-react';

interface SellerBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SellerBottomNav({ activeTab, onTabChange }: SellerBottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'earnings', icon: DollarSign, label: 'Earnings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#003E93] border-t border-white/10 px-4 py-3 z-40">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <div className={`p-2.5 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] text-white' 
                  : 'text-white/70 hover:text-white'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs ${
                isActive ? 'text-white font-medium' : 'text-white/70'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}