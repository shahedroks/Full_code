import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { AuthService } from '@/services/AuthService';
import type { User as UserType, UserRole } from '@/domain/auth';

interface RegisterScreenProps {
  onRegisterSuccess: (user: UserType) => void;
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onRegisterSuccess, onSwitchToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authService = AuthService.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await authService.register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
    });

    setLoading(false);

    if (result.success) {
      onRegisterSuccess(result.session.user);
    } else {
      setError(result.error.message);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-[#2384F4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full max-h-[95vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Header */}
        <button
          onClick={onSwitchToLogin}
          className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-10 h-10 text-[#2384F4]" />
          </div>
          <h1 className="text-3xl mb-2 text-white">Create Account</h1>
          <p className="text-white/80">Join our service marketplace</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-300/30 rounded-2xl p-4 mb-6"
          >
            <p className="text-sm text-white">{error}</p>
          </motion.div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('role', 'customer')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  formData.role === 'customer'
                    ? 'border-white bg-white text-[#2384F4]'
                    : 'border-white/30 hover:border-white/50 text-white'
                }`}
              >
                <div className="text-2xl mb-1">👤</div>
                <p className="font-medium text-sm">Find Services</p>
                <p className="text-xs opacity-70">Customer</p>
              </button>
              <button
                type="button"
                onClick={() => updateField('role', 'provider')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  formData.role === 'provider'
                    ? 'border-white bg-white text-[#2384F4]'
                    : 'border-white/30 hover:border-white/50 text-white'
                }`}
              >
                <div className="text-2xl mb-1">🔧</div>
                <p className="font-medium text-sm">Offer Services</p>
                <p className="text-xs opacity-70">Provider</p>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2384F4] transition-colors z-10" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-2xl outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2384F4] transition-colors z-10" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-2xl outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2384F4] transition-colors z-10" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1-555-0100"
                required
                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-2xl outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2384F4] transition-colors z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-3 bg-white text-black rounded-2xl outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2384F4] transition-colors z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-2xl outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#2384F4] py-4 rounded-2xl font-semibold disabled:opacity-50 shadow-lg flex items-center justify-center gap-2 hover:shadow-xl hover:bg-white/95 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#2384F4]/30 border-t-[#2384F4] rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-center text-white/70 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}