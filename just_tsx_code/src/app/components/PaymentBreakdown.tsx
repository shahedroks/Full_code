import { motion } from 'motion/react';
import { DollarSign, Info, ShieldCheck } from 'lucide-react';

interface PaymentBreakdownProps {
  totalAmount: number;
  showProviderView?: boolean;
  className?: string;
  variant?: 'default' | 'blue'; // Add variant prop
  showWarranty?: boolean; // Add warranty display option
}

export function PaymentBreakdown({ totalAmount, showProviderView = false, className = '', variant = 'default', showWarranty = true }: PaymentBreakdownProps) {
  const renizoFee = totalAmount * 0.10;
  const providerAmount = totalAmount * 0.90;

  const isBlueVariant = variant === 'blue';

  return (
    <div className={`${isBlueVariant ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-white border-gray-200'} rounded-2xl border p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className={`w-5 h-5 ${isBlueVariant ? 'text-white' : 'text-[#5DD9C1]'}`} />
        <h3 className={`font-semibold ${isBlueVariant ? 'text-white' : 'text-gray-900'}`}>
          {showProviderView ? 'Your Earnings' : 'Payment Breakdown'}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Total Amount (what customer pays) */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isBlueVariant ? 'text-white/80' : 'text-gray-600'}`}>
            {showProviderView ? 'Service Total' : 'Total Amount'}
          </span>
          <span className={`font-semibold ${isBlueVariant ? 'text-white' : 'text-gray-900'}`}>
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className={`border-t ${isBlueVariant ? 'border-white/20' : 'border-gray-200'}`} />

        {/* Renizo Fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm ${isBlueVariant ? 'text-white/80' : 'text-gray-600'}`}>Renizo Service Fee</span>
            <div className="group relative">
              <Info className={`w-3.5 h-3.5 ${isBlueVariant ? 'text-white/60' : 'text-gray-400'} cursor-help`} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                Renizo charges a 10% service fee for providing the platform, payment processing, and 30-day warranty coverage
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
          <span className={`font-medium ${isBlueVariant ? 'text-white/80' : 'text-gray-600'}`}>
            -{`$${renizoFee.toFixed(2)}`} <span className={`text-xs ${isBlueVariant ? 'text-white/60' : 'text-gray-500'}`}>(10%)</span>
          </span>
        </div>

        {/* Provider Amount (what provider receives) */}
        {showProviderView && (
          <>
            <div className={`border-t ${isBlueVariant ? 'border-white/20' : 'border-gray-200'}`} />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between ${isBlueVariant ? 'bg-white/20' : 'bg-gradient-to-br from-[#5DD9C1]/10 to-[#4BC4AC]/10'} rounded-xl p-3 -mx-1`}
            >
              <span className={`font-semibold ${isBlueVariant ? 'text-white' : 'text-gray-900'}`}>You Receive</span>
              <span className={`font-bold text-xl ${isBlueVariant ? 'text-white' : 'text-[#5DD9C1]'}`}>
                ${providerAmount.toFixed(2)}
              </span>
            </motion.div>
          </>
        )}
      </div>

      {/* Warranty Info for Customers */}
      {!showProviderView && showWarranty && (
        <div className={`mt-4 ${isBlueVariant ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-emerald-50 border-emerald-200/50'} border rounded-xl p-3`}>
          <div className="flex items-start gap-2">
            <ShieldCheck className={`w-4 h-4 ${isBlueVariant ? 'text-emerald-300' : 'text-emerald-600'} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-xs font-medium ${isBlueVariant ? 'text-emerald-100' : 'text-emerald-900'} mb-0.5`}>
                30-Day Workmanship Warranty
              </p>
              <p className={`text-xs ${isBlueVariant ? 'text-emerald-200/90' : 'text-emerald-700'}`}>
                All services include free warranty coverage for workmanship issues within 30 days of completion.
              </p>
            </div>
          </div>
        </div>
      )}

      {showProviderView && (
        <div className={`mt-4 ${isBlueVariant ? 'bg-white/10 border-white/30' : 'bg-[#5DD9C1]/10 border-[#5DD9C1]/30'} border rounded-xl p-3`}>
          <p className={`text-xs ${isBlueVariant ? 'text-white/90' : 'text-gray-700'}`}>
            <span className="font-medium">Net earnings after platform fee.</span> The 10% Renizo fee covers payment processing, platform maintenance, and warranty protection.
          </p>
        </div>
      )}
    </div>
  );
}