import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ShieldAlert, Calendar, Clock, MapPin, FileText, User, ShieldCheck, Info } from 'lucide-react';
import type { Booking } from '@/domain/models';

interface BookingCardProps {
  booking: Booking & {
    customerName: string;
    categoryName: string;
    townName: string;
  };
  onSelect: () => void;
}

function BookingCard({ booking, onSelect }: BookingCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
    >
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#408AF1]/10 to-[#5ca3f5]/10 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-[#408AF1]" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{booking.customerName}</h3>
          <p className="text-sm text-gray-500">{booking.categoryName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs h-fit ${statusColors[booking.status]}`}>
          {booking.status === 'in-progress' ? 'Active' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {booking.scheduledTime}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {booking.townName}
        </div>
      </div>

      {booking.notes && (
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <div className="flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-gray-700 flex-1 line-clamp-2">{booking.notes}</p>
          </div>
        </div>
      )}

      <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
        booking.paidInApp
          ? 'bg-green-50 text-green-700'
          : 'bg-gray-50 text-gray-700'
      }`}>
        {booking.paidInApp ? (
          <>
            <Shield className="w-4 h-4" />
            <span>Paid In-App</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-4 h-4" />
            <span>Pending Payment</span>
          </>
        )}
      </div>
    </motion.button>
  );
}

interface SellerBookingsScreenProps {
  bookings: Array<Booking & { customerName: string; categoryName: string; townName: string }>;
  onSelectBooking: (bookingId: string) => void;
}

export function SellerBookingsScreen({ bookings, onSelectBooking }: SellerBookingsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return booking.status === 'in-progress' || booking.status === 'confirmed';
    return booking.status === activeFilter;
  });

  const filters = [
    { id: 'all' as const, label: 'All', count: bookings.length },
    { id: 'pending' as const, label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'active' as const, label: 'Active', count: bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length },
    { id: 'completed' as const, label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled' as const, label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="px-4 py-6">
        <h2 className="text-xl mb-1 text-white font-semibold">My Bookings</h2>
        <p className="text-sm text-white/70">{bookings.length} total bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-[#2384F4] border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#003E93] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-1.5 ${
                  activeFilter === filter.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  ({filter.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredBookings.length > 0 ? (
          <>
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onSelect={() => onSelectBooking(booking.id)}
              />
            ))}
            
            {/* Warranty Info for Providers */}
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-100 mb-1 text-sm">30-Day Warranty Reminder</h3>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    All services paid through Renizo include a 30-day workmanship warranty. Be prepared to address any 
                    quality issues reported within 30 days of service completion at no additional charge to the customer.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-medium mb-1 text-white">No {activeFilter !== 'all' && activeFilter} bookings</h3>
            <p className="text-sm text-white/70">
              {activeFilter === 'pending' && 'New booking requests will appear here'}
              {activeFilter === 'active' && 'Active jobs will appear here'}
              {activeFilter === 'completed' && 'Completed jobs will appear here'}
              {activeFilter === 'cancelled' && 'Cancelled bookings will appear here'}
              {activeFilter === 'all' && 'Your bookings will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}