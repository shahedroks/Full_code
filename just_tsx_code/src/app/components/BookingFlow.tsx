import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Shield, ShieldAlert, CreditCard, Check, Package, Plus, Minus, ShieldCheck } from 'lucide-react';
import type { Provider } from '@/app/data/mockData';
import { getServiceStructure, calculateTotalPrice } from '@/app/data/serviceStructure';
import { WarrantyInfoModal } from '@/app/components/common/WarrantyInfoModal';

interface BookingFlowProps {
  provider: Provider;
  categoryId: string;
  onBack: () => void;
  onComplete: () => void;
}

type BookingStep = 'service' | 'date' | 'payment' | 'confirmation';

export function BookingFlow({ provider, categoryId, onBack, onComplete }: BookingFlowProps) {
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedSubSection, setSelectedSubSection] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'app' | 'cash'>('app');
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);

  const serviceStructure = getServiceStructure(categoryId);
  const dates = ['Today', 'Tomorrow', 'Jan 18', 'Jan 19', 'Jan 20'];
  const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const totalPrice = calculateTotalPrice(selectedSubSection, selectedAddOns, categoryId);
  const serviceFee = totalPrice * 0.1; // 10% service fee
  const finalTotal = totalPrice + serviceFee;

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleContinue = () => {
    if (step === 'service' && selectedSubSection) {
      setStep('date');
    } else if (step === 'date' && selectedDate && selectedTime) {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('confirmation');
    }
  };

  if (step === 'confirmation') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full px-4 py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-2xl mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 text-center mb-8">
          Your appointment with {provider.name} is confirmed for {selectedDate} at {selectedTime}
        </p>

        {/* Warranty Info */}
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 mb-1">30-Day Warranty Included</h3>
              <p className="text-sm text-emerald-700 mb-2">
                Your service includes a free workmanship warranty for 30 days after completion.
              </p>
              <button
                onClick={() => setShowWarrantyModal(true)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline"
              >
                Learn more about warranty coverage
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium"
        >
          Done
        </button>

        <WarrantyInfoModal 
          isOpen={showWarrantyModal}
          onClose={() => setShowWarrantyModal(false)}
        />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100">
        <button onClick={onBack} className="text-[#408AF1] font-medium mb-2">
          ← Back
        </button>
        <h2 className="text-xl">Book {provider.name}</h2>
        <div className="flex gap-2 mt-3">
          <div className={`h-1 flex-1 rounded-full ${step !== 'service' ? 'bg-[#408AF1]' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step === 'payment' || step === 'confirmation' ? 'bg-[#408AF1]' : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step === 'confirmation' ? 'bg-[#408AF1]' : 'bg-gray-200'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 'service' && serviceStructure && (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Sub-sections */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-[#408AF1]" />
                  <label className="font-medium">Select Service Type</label>
                </div>
                <div className="space-y-2">
                  {serviceStructure.subSections.map(subSection => (
                    <button
                      key={subSection.id}
                      onClick={() => setSelectedSubSection(subSection.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left $${
                        selectedSubSection === subSection.id
                          ? 'border-[#408AF1] bg-[#408AF1]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${selectedSubSection === subSection.id ? 'text-[#408AF1]' : 'text-gray-900'}`}>
                            {subSection.name}
                          </p>
                          {subSection.basePrice && (
                            <p className="text-sm text-gray-500 mt-0.5">${subSection.basePrice}</p>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedSubSection === subSection.id ? 'border-[#408AF1]' : 'border-gray-300'
                        }`}>
                          {selectedSubSection === subSection.id && (
                            <div className="w-3 h-3 rounded-full bg-[#408AF1]" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              {selectedSubSection && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Plus className="w-5 h-5 text-[#408AF1]" />
                    <label className="font-medium">Add-Ons (Optional)</label>
                  </div>
                  <div className="space-y-2">
                    {serviceStructure.addOns.map(addOn => {
                      const isSelected = selectedAddOns.includes(addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(addOn.id)}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-[#408AF1] bg-[#408AF1]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium text-sm ${isSelected ? 'text-[#408AF1]' : 'text-gray-900'}`}>
                                {addOn.name}
                              </p>
                              <p className="text-sm text-gray-500">+${addOn.price}</p>
                            </div>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#408AF1] bg-[#408AF1]' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Price Summary */}
              {selectedSubSection && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">Price Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Service Price</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee (10%)</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-blue-200">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'date' && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#408AF1]" />
                  <label className="font-medium">Select Date</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {dates.map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all ${
                        selectedDate === date
                          ? 'border-[#408AF1] bg-[#408AF1]/10 text-[#408AF1] font-medium'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#408AF1]" />
                  <label className="font-medium">Select Time</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {times.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all ${
                        selectedTime === time
                          ? 'border-[#408AF1] bg-[#408AF1]/10 text-[#408AF1] font-medium'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#408AF1]" />
                <label className="font-medium">Payment Method</label>
              </div>

              {/* Price Summary at Top */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Service Price</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee (10%)</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-300">
                    <span>Total Amount</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('app')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'app'
                      ? 'border-[#408AF1] bg-[#408AF1]/5'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                      paymentMethod === 'app' ? 'border-[#408AF1]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'app' && (
                        <div className="w-3 h-3 rounded-full bg-[#408AF1]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium mb-1">Pay in App</p>
                      <p className="text-sm text-gray-600">Secure payment through Renizo</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#408AF1] bg-[#408AF1]/5'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                      paymentMethod === 'cash' ? 'border-[#408AF1]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cash' && (
                        <div className="w-3 h-3 rounded-full bg-[#408AF1]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium mb-1">Pay with Cash</p>
                      <p className="text-sm text-gray-600">Pay service provider directly</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-900">
                  Choose your preferred payment method. In-app payments are processed securely through Renizo.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleContinue}
          disabled={
            (step === 'service' && !selectedSubSection) ||
            (step === 'date' && (!selectedDate || !selectedTime))
          }
          className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 'service' ? 'Continue to Date & Time' : step === 'date' ? 'Continue to Payment' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}