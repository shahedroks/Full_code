import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Shield, Check, X, ChevronLeft, ShieldCheck } from 'lucide-react';
import { PaymentBreakdown } from '@/app/components/PaymentBreakdown';

interface PaymentScreenProps {
  amount: string;
  providerName: string;
  onBack: () => void;
  onSuccess: () => void;
}

type PaymentState = 'input' | 'processing' | 'success' | 'failure';

export function PaymentScreen({ amount, providerName, onBack, onSuccess }: PaymentScreenProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('input');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Parse amount (remove $ and convert to number)
  const numericAmount = parseFloat(amount.replace('$', '').replace(',', ''));

  const handlePayment = () => {
    setPaymentState('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.2; // 80% success rate
      setPaymentState(success ? 'success' : 'failure');
      
      if (success) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  if (paymentState === 'processing') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-gray-200 border-t-[#408AF1] rounded-full mb-4"
        />
        <h3 className="text-xl font-medium mb-2">Processing Payment</h3>
        <p className="text-gray-600">Please wait...</p>
      </div>
    );
  }

  if (paymentState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#2384F4] z-50 flex flex-col items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-2xl font-medium mb-2 text-white">Payment Successful!</h2>
        <p className="text-white text-center mb-8">
          Your payment of {amount} has been processed
        </p>

        <div className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-white mt-0.5" />
            <div>
              <p className="font-medium text-white mb-1">Secure Payment</p>
              <p className="text-sm text-white/80">
                Your booking is confirmed and payment has been securely processed
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (paymentState === 'failure') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-6"
        >
          <X className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-2xl font-medium mb-2">Payment Failed</h2>
        <p className="text-gray-600 text-center mb-8">
          We couldn't process your payment. Please try again.
        </p>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setPaymentState('input')}
            className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white font-medium mb-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl text-white">Payment</h2>
        <p className="text-sm text-white/80">Secure checkout</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Amount Summary */}
        <div className="bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] rounded-2xl p-6 text-white mb-6">
          <p className="text-white/80 mb-1">Payment to</p>
          <h3 className="text-xl font-medium mb-4">{providerName}</h3>
          <div className="pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm mb-1">Total Amount</p>
            <p className="text-3xl font-semibold">{amount}</p>
          </div>
        </div>

        {/* Payment Breakdown */}
        <PaymentBreakdown totalAmount={numericAmount} className="mb-6" />

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 3))}
                placeholder="123"
                maxLength={3}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-[#408AF1] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-1">
            <span>🔒 Encrypted</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#2384F4]">
        <button
          onClick={handlePayment}
          disabled={!cardNumber || !expiryDate || !cvv}
          className="w-full bg-[#003E93] text-white py-4 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#003E93]/30"
        >
          Pay {amount}
        </button>
      </div>
    </div>
  );
}