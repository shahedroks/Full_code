import { User as UserIcon, MapPin, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, History, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { User } from '@/domain/auth';
import { EditProfileScreen } from '@/app/components/EditProfileScreen';
import { PaymentMethodsScreen } from '@/app/components/PaymentMethodsScreen';
import { SettingsScreen } from '@/app/components/SettingsScreen';
import { HelpSupportScreen } from '@/app/components/HelpSupportScreen';

interface ProfileScreenProps {
  onChangeTown: () => void;
  onLogout?: () => void;
  user?: User;
  onUpdateUser?: (updatedUser: Partial<User>) => void;
}

type ProfileView = 'main' | 'edit-profile' | 'payment' | 'settings' | 'help';

export function ProfileScreen({ onChangeTown, onLogout, user, onUpdateUser }: ProfileScreenProps) {
  const [currentView, setCurrentView] = useState<ProfileView>('main');

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    setCurrentView('main');
  };

  if (currentView === 'edit-profile' && user) {
    return (
      <EditProfileScreen
        user={user}
        onBack={() => setCurrentView('main')}
        onSave={handleSaveProfile}
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
    { icon: UserIcon, label: 'Edit Profile', color: 'text-[#408AF1]', bg: 'bg-[#408AF1]/10', action: () => setCurrentView('edit-profile') },
    { icon: MapPin, label: 'Change Town', color: 'text-green-600', bg: 'bg-green-50', action: onChangeTown },
    { icon: CreditCard, label: 'Payment Methods', color: 'text-pink-600', bg: 'bg-pink-50', action: () => setCurrentView('payment') },
    { icon: Settings, label: 'Settings', color: 'text-gray-600', bg: 'bg-gray-50', action: () => setCurrentView('settings') },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-yellow-600', bg: 'bg-yellow-50', action: () => setCurrentView('help') },
  ];

  return (
    <div className="min-h-full bg-[#2384F4] px-4 py-6">
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
            <h2 className="text-xl mb-1">{user?.name || 'John Doe'}</h2>
            <p className="text-white/90">{user?.email || 'john.doe@email.com'}</p>
          </div>
        </div>
        <div className="flex gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-2xl font-medium">12</p>
            <p className="text-sm text-white/90">Bookings</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-2xl font-medium">8</p>
            <p className="text-sm text-white/90">Reviews</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="text-2xl font-medium">4</p>
            <p className="text-sm text-white/90">Favorites</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={item.action}
            className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-gray-100 flex items-center gap-3"
          >
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        ))}
      </div>

      <button className="w-full bg-red-50 text-red-600 rounded-2xl p-4 flex items-center justify-center gap-2 font-medium hover:bg-red-100 transition-colors" onClick={onLogout}>
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </div>
  );
}