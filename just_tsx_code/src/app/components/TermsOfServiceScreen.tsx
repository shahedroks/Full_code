import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
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
          <h1 className="font-semibold text-lg">Terms of Service</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Terms of Service</h2>
              <p className="text-white/90 text-sm">Last updated: {lastUpdated}</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            Please read these terms carefully before using Renizo.
          </p>
        </motion.div>

        {/* Acceptance of Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Acceptance of Terms</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            By accessing and using Renizo, you accept and agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services. We reserve the right to 
            modify these terms at any time, and continued use of the platform constitutes acceptance of 
            any changes.
          </p>
        </motion.div>

        {/* User Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg">User Accounts</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>You must be at least 18 years old to create an account</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>You are responsible for maintaining the confidentiality of your account</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>You must provide accurate and complete information</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>One person or business may not maintain multiple accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#408AF1] rounded-full mt-2 flex-shrink-0" />
              <span>You are responsible for all activities under your account</span>
            </li>
          </ul>
        </motion.div>

        {/* Service Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg">Service Usage & Conduct</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">You agree to use Renizo only for lawful purposes and in accordance with these terms. You agree NOT to:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Violate any applicable laws or regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Impersonate any person or entity</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Share phone numbers or contact information outside the app</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Interfere with or disrupt the service or servers</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Use the platform for any fraudulent or malicious activity</span>
            </li>
          </ul>
        </motion.div>

        {/* Payments & Fees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg">Payments & Service Fees</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Renizo charges a 10% service fee on all bookings</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>All payments must be processed through the Renizo platform</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Refunds are subject to our cancellation policy (24-hour notice required)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Service providers are responsible for applicable taxes</span>
            </li>
          </ul>
        </motion.div>

        {/* 30-Day Warranty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.225 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg">30-Day Workmanship Warranty</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            All services booked and paid through Renizo include a 30-day workmanship warranty at no additional cost.
          </p>
          <div className="bg-emerald-50 rounded-xl p-4 mb-3">
            <h4 className="text-sm font-semibold text-emerald-900 mb-2">What's Covered</h4>
            <ul className="space-y-1.5 text-sm text-emerald-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Defects in workmanship or service quality</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Issues directly related to the completed service</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Follow-up repairs at no additional charge</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">What's Not Covered</h4>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Normal wear and tear or deterioration</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Damage caused by misuse or external factors</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Services not booked through Renizo</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Issues reported after 30 days from service completion</span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-gray-600 mt-3 leading-relaxed">
            To file a warranty claim, contact the service provider through in-app chat within 30 days of service completion. 
            If the issue remains unresolved, contact Renizo support for assistance.
          </p>
        </motion.div>

        {/* Termination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-lg">Termination</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate your account at any time for violations of these 
            terms, fraudulent activity, or any conduct that we determine to be harmful to other users or 
            the platform. You may also delete your account at any time through the app settings.
          </p>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5"
        >
          <h3 className="font-semibold mb-2">Limitation of Liability</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Renizo acts as a marketplace platform connecting service providers and customers. We \n            are not responsible for the quality, safety, or legality of services provided. Our total liability is limited to the amount paid \n            for the specific service in question.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-5"
        >
          <h3 className="font-semibold mb-2">Questions About Terms?</h3>
          <p className="text-sm text-gray-700 mb-3">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-sm font-medium text-[#408AF1]">legal@renizo.com</p>
        </motion.div>
      </div>
    </div>
  );
}