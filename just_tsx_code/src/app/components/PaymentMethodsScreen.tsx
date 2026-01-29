import { ArrowLeft, CreditCard, Plus, Trash2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
}

interface PaymentMethodsScreenProps {
  onBack: () => void;
}

export function PaymentMethodsScreen({ onBack }: PaymentMethodsScreenProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: true,
      holderName: 'John Doe',
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8888',
      expiryMonth: '08',
      expiryYear: '26',
      isDefault: false,
      holderName: 'John Doe',
    },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success('Default payment method updated');
  };

  const handleDelete = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      toast.error('Cannot delete default payment method. Set another card as default first.');
      return;
    }

    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
      toast.success('Payment method removed');
    }
  };

  const getCardIcon = (type: string) => {
    const colors = {
      visa: 'text-blue-600',
      mastercard: 'text-red-600',
      amex: 'text-green-600',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const getCardName = (type: string) => {
    const names = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
    };
    return names[type as keyof typeof names] || type;
  };

  if (showAddCard) {
    return <AddCardScreen onBack={() => setShowAddCard(false)} onAdd={(card) => {
      setPaymentMethods([...paymentMethods, card]);
      setShowAddCard(false);
      toast.success('Payment method added successfully');
    }} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="font-semibold text-lg text-white">Payment Methods</h1>
          </div>
          <button
            onClick={() => setShowAddCard(true)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {paymentMethods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">No Payment Methods</h3>
            <p className="text-white/70 mb-6">Add a payment method to start booking services</p>
            <button
              onClick={() => setShowAddCard(true)}
              className="bg-white/90 hover:bg-white text-[#003E93] px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Add Payment Method
            </button>
          </motion.div>
        ) : (
          <>
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-white">{getCardName(method.type)} •••• {method.last4}</p>
                        <p className="text-sm text-white/80">{method.holderName}</p>
                        <p className="text-sm text-white/70">Expires {method.expiryMonth}/{method.expiryYear}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300 hover:text-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {method.isDefault ? (
                      <div className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium mt-2">
                        <Check className="w-3 h-3" />
                        Default
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-sm text-white font-medium mt-2 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: paymentMethods.length * 0.05 }}
              onClick={() => setShowAddCard(true)}
              className="w-full border-2 border-dashed border-white/30 rounded-2xl p-6 hover:border-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-white">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Payment Method</span>
              </div>
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}

interface AddCardScreenProps {
  onBack: () => void;
  onAdd: (card: PaymentMethod) => void;
}

function AddCardScreen({ onBack, onAdd }: AddCardScreenProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleChange('cardNumber', formatted);
  };

  const handleSubmit = () => {
    if (!formData.cardNumber || !formData.holderName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      toast.error('Please fill in all fields');
      return;
    }

    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      toast.error('Invalid card number');
      return;
    }

    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: cardNumber.startsWith('4') ? 'visa' : cardNumber.startsWith('5') ? 'mastercard' : 'amex',
      last4: cardNumber.slice(-4),
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      isDefault: false,
      holderName: formData.holderName,
    };

    onAdd(newCard);
  };

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="font-semibold text-lg text-white">Add Payment Method</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-white/90 hover:bg-white text-[#003E93] rounded-xl font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Card Number</label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
          <input
            type="text"
            value={formData.holderName}
            onChange={(e) => handleChange('holderName', e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Month</label>
            <input
              type="text"
              value={formData.expiryMonth}
              onChange={(e) => handleChange('expiryMonth', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="MM"
              maxLength={2}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Year</label>
            <input
              type="text"
              value={formData.expiryYear}
              onChange={(e) => handleChange('expiryYear', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="YY"
              maxLength={2}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">CVV</label>
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="123"
              maxLength={3}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mt-6">
          <p className="text-sm text-white/90">
            <strong>Secure Payment:</strong> Your payment information is encrypted and securely stored. We never share your card details with service providers.
          </p>
        </div>
      </div>
    </div>
  );
}