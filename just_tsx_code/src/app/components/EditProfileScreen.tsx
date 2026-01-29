import { ArrowLeft, Camera, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import type { User } from '@/domain/auth';
import { toast } from 'sonner';

interface EditProfileScreenProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export function EditProfileScreen({ user, onBack, onSave }: EditProfileScreenProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar || '',
  });

  const [isChanged, setIsChanged] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsChanged(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Phone is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    onSave(formData);
    toast.success('Profile updated successfully!');
    onBack();
  };

  const handleCancel = () => {
    if (isChanged) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const handleAvatarChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you would upload this to a server
        // For now, we'll create a local URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          handleChange('avatar', result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="font-semibold text-lg text-white">Edit Profile</h1>
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              isChanged
                ? 'bg-white/90 text-[#003E93] hover:bg-white'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                <UserIcon className="w-14 h-14 text-white" />
              </div>
            )}
            <button
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 w-10 h-10 bg-white text-[#2384F4] rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-white/70 mt-3">Tap to change photo</p>
        </motion.div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3.5 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3.5 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </motion.div>

          {/* Phone Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3.5 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-[#0060CF] border border-white/20 rounded-xl p-4 mt-6"
          >
            <p className="text-sm text-white/90">
              <strong>Note:</strong> Your email and phone number are used for account security and communication with service providers.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}