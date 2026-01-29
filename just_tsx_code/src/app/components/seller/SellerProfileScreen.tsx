import { User as UserIcon, Clock, MapPin, Bell, CreditCard, HelpCircle, LogOut, ChevronRight, Settings, Award, BarChart3, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { User } from '@/domain/auth';
import type { Provider, Town, ServiceCategory } from '@/domain/models';
import * as Icons from 'lucide-react';
import { NotificationsScreen } from '@/app/components/NotificationsScreen';
import { PaymentMethodsScreen } from '@/app/components/PaymentMethodsScreen';
import { SettingsScreen } from '@/app/components/SettingsScreen';
import { HelpSupportScreen } from '@/app/components/HelpSupportScreen';

interface SellerProfileScreenProps {
  onLogout: () => void;
  onNavigateToNotifications?: () => void;
  provider: Provider | null;
  towns: Town[];
  categories: ServiceCategory[];
}

type ProfileView = 'main' | 'notifications' | 'payment' | 'settings' | 'help';

export function SellerProfileScreen({ 
  onLogout,
  onNavigateToNotifications,
  provider,
  towns,
  categories
}: SellerProfileScreenProps) {
  const [currentView, setCurrentView] = useState<ProfileView>('main');

  // If external navigation prop is provided and notifications is clicked
  const handleNotifications = () => {
    if (onNavigateToNotifications) {
      onNavigateToNotifications();
    } else {
      setCurrentView('notifications');
    }
  };

  // Render sub-screens
  if (currentView === 'notifications') {
    return (
      <NotificationsScreen
        onBack={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'payment') {
    return (
      <PaymentMethodsScreen
        onBack={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <SettingsScreen
        onBack={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'help') {
    return (
      <HelpSupportScreen
        onBack={() => setCurrentView('main')}
      />
    );
  }

  const menuItems = [
    { icon: Bell, label: 'Notifications', color: 'text-orange-600', bg: 'bg-orange-50', action: handleNotifications },
    { icon: CreditCard, label: 'Payment Settings', color: 'text-pink-600', bg: 'bg-pink-50', action: () => setCurrentView('payment') },
    { icon: Settings, label: 'Settings', color: 'text-gray-600', bg: 'bg-gray-50', action: () => setCurrentView('settings') },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-cyan-600', bg: 'bg-cyan-50', action: () => setCurrentView('help') },
  ];

  const user = { name: 'Mike Johnson', email: 'provider@demo.com', avatar: '' };

  // Get provider's selected towns
  const selectedTowns = provider && towns ? towns.filter(t => provider.townIds.includes(t.id)) : [];
  
  // Get provider's selected categories
  const selectedCategories = provider && categories ? categories.filter(c => provider.categoryIds.includes(c.id)) : [];

  return (
    <div className="px-4 py-6 overflow-y-auto h-full bg-[#2384F4]">
      {/* Profile Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 text-white border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl" />
          ) : (
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-10 h-10" />
            </div>
          )}
          <div>
            <h2 className="text-xl mb-1">{user?.name || 'Provider Name'}</h2>
            <p className="text-white/80 text-sm">{user?.email || 'provider@email.com'}</p>
            <div className="flex items-center gap-1.5 mt-1.5 bg-white/20 px-2.5 py-1 rounded-lg w-fit">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium">Pro Provider</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-2xl font-medium">156</p>
            <p className="text-sm text-white/80">Jobs Done</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-2xl font-medium">4.8</p>
            <p className="text-sm text-white/80">Rating</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-2xl font-medium">98%</p>
            <p className="text-sm text-white/80">Success</p>
          </div>
        </div>
      </div>

      {/* Service Areas */}
      {selectedTowns.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/90 mb-3 px-1">SERVICE AREAS</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {selectedTowns.map((town) => (
                <div
                  key={town.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                >
                  <MapPin className="w-4 h-4 text-[#408AF1]" />
                  <span className="text-sm font-medium text-gray-900">{town.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Services Offered */}
      {selectedCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/90 mb-3 px-1">SERVICES OFFERED</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="space-y-2">
              {selectedCategories.map((category) => {
                const IconComponent = (Icons as any)[category.icon] || Wrench;
                return (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#408AF1]/20 to-[#408AF1]/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-[#408AF1]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-medium text-white/90 mb-3 px-1">ACCOUNT</h3>
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={item.action}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-3"
          >
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 rounded-2xl p-4 flex items-center justify-center gap-2 font-medium hover:bg-red-100 transition-colors mb-6"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

      {/* App Version */}
      <p className="text-center text-xs text-gray-400 mb-20">Version 1.0.0</p>
    </div>
  );
}