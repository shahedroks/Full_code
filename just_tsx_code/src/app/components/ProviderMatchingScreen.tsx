import { Loader2, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';

type MatchingStatus = 'loading' | 'success' | 'no-providers';

interface ProviderMatchingScreenProps {
  status: MatchingStatus;
  onChangeDateTime?: () => void;
  onViewProvider?: () => void;
  providerName?: string;
}

export function ProviderMatchingScreen({
  status,
  onChangeDateTime,
  onViewProvider,
  providerName,
}: ProviderMatchingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DD9C1]/5 via-white to-[#5DD9C1]/10 flex flex-col items-center justify-center px-4">
      {/* Loading State */}
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-[#5DD9C1] to-[#4BC4AC] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Finding Providers...</h2>
          <p className="text-gray-600 max-w-sm">
            We're searching for the best providers in your area
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              className="w-2 h-2 bg-[#5DD9C1] rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-2 h-2 bg-[#5DD9C1] rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-2 h-2 bg-[#5DD9C1] rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Provider Matched!</h2>
          <p className="text-gray-600 max-w-sm mb-6">
            {providerName || 'A provider'} is available for your request
          </p>
          {onViewProvider && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onViewProvider}
              className="bg-gradient-to-r from-[#5DD9C1] to-[#4BC4AC] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Payment
            </motion.button>
          )}
        </motion.div>
      )}

      {/* No Providers State */}
      {status === 'no-providers' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Providers Available</h2>
          <p className="text-gray-600 max-w-sm mb-8">
            We couldn't find any providers for your selected date and time. Try changing your booking details.
          </p>
          
          {onChangeDateTime && (
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onChangeDateTime}
                className="w-full bg-gradient-to-r from-[#5DD9C1] to-[#4BC4AC] text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Change Date/Time
              </motion.button>
              <p className="text-sm text-gray-500">
                Or contact support for assistance
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
