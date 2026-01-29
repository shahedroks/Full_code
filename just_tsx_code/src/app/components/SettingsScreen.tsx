import { ArrowLeft, Lock, Globe, Moon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChangePasswordScreen } from '@/app/components/ChangePasswordScreen';
import { PrivacyPolicyScreen } from '@/app/components/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from '@/app/components/TermsOfServiceScreen';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'changePassword' | 'privacyPolicy' | 'termsOfService'>('main');
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    promotionalEmails: false,
    darkMode: false,
    language: 'English',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newValue = !prev[key];
      toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${newValue ? 'enabled' : 'disabled'}`);
      return { ...prev, [key]: newValue };
    });
  };

  // Show sub-screens
  if (currentScreen === 'changePassword') {
    return <ChangePasswordScreen onBack={() => setCurrentScreen('main')} />;
  }
  if (currentScreen === 'privacyPolicy') {
    return <PrivacyPolicyScreen onBack={() => setCurrentScreen('main')} />;
  }
  if (currentScreen === 'termsOfService') {
    return <TermsOfServiceScreen onBack={() => setCurrentScreen('main')} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="font-semibold text-lg text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase mb-3 px-1">Preferences</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 divide-y divide-white/10">
            <SettingToggle
              icon={<Moon className="w-5 h-5 text-white" />}
              label="Dark Mode"
              description="Use dark theme for the app"
              enabled={settings.darkMode}
              onToggle={() => handleToggle('darkMode')}
            />
            <button className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Language</p>
                <p className="text-sm text-white/70">{settings.language}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </motion.div>

        {/* Privacy & Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase mb-3 px-1">Privacy & Security</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 divide-y divide-white/10">
            <button
              className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
              onClick={() => setCurrentScreen('changePassword')}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Change Password</p>
                <p className="text-sm text-white/70">Update your account password</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
            <button
              className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
              onClick={() => setCurrentScreen('privacyPolicy')}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Privacy Policy</p>
                <p className="text-sm text-white/70">View our privacy policy</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
            <button
              className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
              onClick={() => setCurrentScreen('termsOfService')}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-white">Terms of Service</p>
                <p className="text-sm text-white/70">Read our terms and conditions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase mb-3 px-1">About</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Version</span>
              <span className="font-medium text-white">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Build</span>
              <span className="font-medium text-white">2024.01.22</span>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-sm font-semibold text-white/70 uppercase mb-3 px-1">Danger Zone</h2>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-red-500/30 transition-colors rounded-2xl">
              <div className="flex-1 text-left">
                <p className="font-medium text-red-200">Delete Account</p>
                <p className="text-sm text-white/80">Permanently delete your account and all data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-200" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function SettingToggle({ icon, label, description, enabled, onToggle }: SettingToggleProps) {
  return (
    <div className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-white' : 'bg-white/30'
        }`}
      >
        <motion.div
          className={`absolute top-1 w-5 h-5 rounded-full shadow-sm ${
            enabled ? 'bg-[#2384F4]' : 'bg-white'
          }`}
          animate={{ left: enabled ? '26px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}