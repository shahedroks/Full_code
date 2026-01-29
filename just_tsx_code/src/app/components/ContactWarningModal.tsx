import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  violationType: 'phone' | 'email' | 'phrase';
}

export function ContactWarningModal({
  isOpen,
  onClose,
  onEdit,
  violationType,
}: ContactWarningModalProps) {
  const getWarningMessage = () => {
    switch (violationType) {
      case 'phone':
        return 'Your message contains a phone number.';
      case 'email':
        return 'Your message contains an email address.';
      case 'phrase':
        return 'Your message requests outside contact.';
      default:
        return 'Your message may violate chat guidelines.';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-orange-50 px-6 py-5 border-b border-orange-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Communication Policy
                  </h3>
                  <p className="text-sm text-orange-700">
                    {getWarningMessage()}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-orange-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                      i
                    </span>
                    In-App Chat Only
                  </h4>
                  <p className="text-sm text-blue-800">
                    To maintain security and accountability, all communication must happen through the Renizo in-app chat.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Why this matters:</strong>
                  </p>
                  <ul className="space-y-1.5 text-sm text-gray-600 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-[#5DD9C1] mt-1">•</span>
                      <span>Secure, documented communication for your protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#5DD9C1] mt-1">•</span>
                      <span>Protects both customers and providers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#5DD9C1] mt-1">•</span>
                      <span>Ensures quality and accountability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onEdit}
                className="flex-1 bg-gradient-to-r from-[#5DD9C1] to-[#4BC4AC] text-white py-3.5 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                Edit Message
              </button>
              <button
                onClick={onClose}
                className="px-6 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}