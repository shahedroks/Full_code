import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const lastUpdated = 'January 22, 2024';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Your Privacy Matters</h2>
              <p className="text-white/90 text-sm">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            We are committed to protecting your personal information and your right to privacy.
          </p>
        </motion.div>

        {/* Information We Collect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Information We Collect</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Personal Information:</strong> Name, email address, phone number, and profile photo when you create an account.</p>
            <p><strong>Booking Information:</strong> Service bookings, preferences, and transaction history.</p>
            <p><strong>Payment Information:</strong> Payment card details (securely processed through our encrypted payment system).</p>
            <p><strong>Location Data:</strong> Your selected town to show relevant local services.</p>
            <p><strong>Communications:</strong> Messages sent through our in-app chat system.</p>
          </div>
        </motion.div>

        {/* How We Use Your Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg">How We Use Your Information</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>Provide, operate, and maintain our services</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>Process your bookings and payments</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>Communicate with you about your account and services</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>Improve our services and develop new features</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>Ensure safety and security of our platform</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>Comply with legal obligations</span>
            </li>
          </ul>
        </motion.div>

        {/* Data Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg">Data Security</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>End-to-end encryption for all sensitive data</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>Secure payment processing through PCI-compliant systems</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>Regular security audits and updates</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <span>Limited access to personal information on a need-to-know basis</span>
            </li>
          </ul>
        </motion.div>

        {/* Your Rights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg">Your Rights</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            You have the right to:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span>Access and review your personal information</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span>Request corrections to your data</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span>Delete your account and associated data</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span>Opt-out of marketing communications</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span>Export your data in a portable format</span>
            </li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-5"
        >
          <h3 className="font-semibold mb-2">Questions About Privacy?</h3>
          <p className="text-sm text-gray-700 mb-3">
            If you have any questions or concerns about our privacy practices, please contact us at:
          </p>
          <p className="text-sm font-medium text-[#408AF1]">privacy@renizo.com</p>
        </motion.div>
      </div>
    </div>
  );
}
