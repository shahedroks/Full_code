import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Shield, 
  ShieldAlert, 
  Check, 
  MessageSquare, 
  CreditCard,
  User,
  FileText,
  X,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { AppService } from '@/services/AppService';
import type { Booking } from '@/domain/models';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PaymentBreakdown } from '@/app/components/PaymentBreakdown';
import { WarrantyBadge } from '@/app/components/common/WarrantyBadge';

interface BookingDetailsProps {
  bookingId: string;
  onBack: () => void;
  onOpenChat: (bookingId: string) => void;
  onUpdateBooking?: (bookingId: string, status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled') => void;
  userRole: 'customer' | 'provider';
}

export function BookingDetails({ 
  bookingId, 
  onBack, 
  onOpenChat,
  onUpdateBooking,
  userRole 
}: BookingDetailsProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [townName, setTownName] = useState<string>('');
  const [providerName, setProviderName] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const bookingData = await AppService.getInstance().getBookingById(bookingId);
      
      if (!bookingData) {
        console.error('Booking not found');
        setLoading(false);
        return;
      }
      
      setBooking(bookingData);

      // Load related data
      const [category, town, provider] = await Promise.all([
        AppService.getInstance().getCategoriesForTown(bookingData.townId).then(cats => 
          cats.find(c => c.id === bookingData.categoryId)
        ),
        AppService.getInstance().getTownById(bookingData.townId),
        AppService.getInstance().getProviderById(bookingData.providerId),
      ]);

      if (category) setCategoryName(category.name);
      if (town) setTownName(town.name);
      if (provider) setProviderName(provider.displayName);
      
      // For provider view, we might want to show customer name
      if (userRole === 'provider') {
        setCustomerName('Customer'); // We don't expose full customer details for privacy
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (onUpdateBooking) {
      onUpdateBooking(bookingId, 'confirmed');
    }
  };

  const handleDecline = () => {
    if (onUpdateBooking) {
      onUpdateBooking(bookingId, 'cancelled');
    }
  };

  const handleStartJob = () => {
    if (onUpdateBooking) {
      onUpdateBooking(bookingId, 'in-progress');
    }
  };

  const handleCompleteJob = () => {
    if (onUpdateBooking) {
      onUpdateBooking(bookingId, 'completed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#2384F4] items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#408AF1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col h-full bg-[#2384F4] items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  const getStatusSteps = (status: string, role: 'customer' | 'provider') => {
    const steps = [
      { key: 'pending', label: 'Booking Requested', icon: Clock },
      { key: 'confirmed', label: 'Provider Confirmed', icon: Check },
      { key: 'in-progress', label: 'Service In Progress', icon: Clock },
      { key: 'completed', label: 'Service Completed', icon: Check },
    ];

    if (role === 'provider') {
      return steps;
    }

    // For customer, we might want to skip the 'Provider Confirmed' step
    return steps.filter(step => step.key !== 'confirmed');
  };

  const statusSteps = getStatusSteps(booking.status, userRole);

  const currentStepIndex = statusSteps.findIndex(s => s.key === booking.status);
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white font-medium mb-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-white">Booking Details</h2>
        <p className="text-sm text-white/70">Order #{booking.id.slice(0, 8)}</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 px-4">
        {/* Status Timeline */}
        <div className="py-6">
          <h3 className="font-semibold mb-4 text-white">Booking Status</h3>
          {isCancelled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm border-2 border-red-400/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Booking Cancelled</p>
                <p className="text-sm text-white/80">This booking has been cancelled</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isComplete
                            ? 'bg-white text-[#2384F4] shadow-lg shadow-white/30'
                            : 'bg-white/20 text-white/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-8 mt-1 transition-colors ${
                            isComplete ? 'bg-white' : 'bg-white/20'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p
                        className={`font-medium ${
                          isCurrent ? 'text-white' : isComplete ? 'text-white/90' : 'text-white/50'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-white/70 mt-0.5">Current status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Accept/Decline Actions for Provider - PENDING STATUS */}
        {userRole === 'provider' && booking.status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
          >
            <h3 className="font-semibold mb-3 text-white">Action Required</h3>
            <div className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-4 mb-4">
              <p className="text-sm text-white font-medium mb-1">New Booking Request</p>
              <p className="text-xs text-white/80">Review the details and accept or decline this job</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDecline}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 border border-white/30 shadow-sm"
              >
                <X className="w-5 h-5" />
                Decline
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
              >
                <CheckCircle className="w-5 h-5" />
                Accept Job
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Start Job Action for Provider - CONFIRMED STATUS */}
        {userRole === 'provider' && booking.status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleStartJob}
              className="w-full bg-white/90 hover:bg-white text-[#003E93] py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Clock className="w-5 h-5" />
              Start Job
            </motion.button>
          </motion.div>
        )}

        {/* Complete Job Action for Provider - IN-PROGRESS STATUS */}
        {userRole === 'provider' && booking.status === 'in-progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleCompleteJob}
              className="w-full bg-white/90 hover:bg-white text-[#003E93] py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Completed
            </motion.button>
          </motion.div>
        )}

        {/* Customer/Provider Info */}
        {userRole === 'customer' && (
          <div className="py-4">
            <h3 className="font-semibold mb-3 text-white">Service Provider</h3>
            <div className="flex items-center gap-3 mb-4">
              <ImageWithFallback
                src=""
                alt={providerName}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{providerName}</h4>
                <p className="text-sm text-white/70">{categoryName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenChat(bookingId)}
                className="flex-1 bg-white/90 hover:bg-white text-[#003E93] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </motion.button>
            </div>
          </div>
        )}

        {userRole === 'provider' && (
          <div className="py-4">
            <h3 className="font-semibold mb-3 text-white">Customer Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{customerName}</h4>
                <p className="text-sm text-white/70">{categoryName}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onOpenChat(bookingId)}
              className="w-full bg-white/90 hover:bg-white text-[#003E93] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              Message Customer
            </motion.button>
          </div>
        )}

        {/* Service Details */}
        <div className="py-4">
          <h3 className="font-semibold mb-3 text-white">Service Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Calendar className="w-5 h-5 text-white mt-0.5" />
              <div>
                <p className="text-white/70 text-xs mb-1">Date & Time</p>
                <p className="font-semibold text-white">
                  {new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {booking.scheduledTime}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <MapPin className="w-5 h-5 text-white mt-0.5" />
              <div>
                <p className="text-white/70 text-xs mb-1">Service Location</p>
                <p className="font-semibold text-white">{townName}</p>
              </div>
            </div>
            {booking.notes && (
              <div className="flex items-start gap-3 text-sm bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <FileText className="w-5 h-5 text-white mt-0.5" />
                <div>
                  <p className="text-white/70 text-xs mb-1">Special Instructions</p>
                  <p className="font-medium text-white">{booking.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="py-4">
          <h3 className="font-semibold mb-3 text-white">Payment Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <span className="text-white/80 text-sm">Payment Method</span>
              <span className="font-semibold flex items-center gap-2 text-white">
                {booking.paymentStatus === 'paid_in_app' ? (
                  <>
                    <CreditCard className="w-4 h-4 text-white"/>
                    In-App Payment
                  </>
                ) : (
                  'Cash on Completion'
                )}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <span className="text-white/80 text-sm">Status</span>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  booking.paymentStatus === 'paid_in_app'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {booking.paymentStatus === 'paid_in_app' ? 'Paid' : 'Pay on Completion'}
              </span>
            </div>

            {/* Warranty Badge for Paid Bookings */}
            {booking.paymentStatus === 'paid_in_app' && booking.status !== 'cancelled' && (
              <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-emerald-100 mb-0.5">
                      30-Day Workmanship Warranty
                    </p>
                    <p className="text-xs text-emerald-200/90">
                      This service includes free warranty coverage for workmanship issues within 30 days of completion.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(booking.totalAmount || booking.amount) && (
              <>
                <div className="pt-3 border-t border-white/20">
                  <PaymentBreakdown
                    totalAmount={booking.totalAmount || booking.amount || 0}
                    showProviderView={userRole === 'provider'}
                    variant="blue"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}