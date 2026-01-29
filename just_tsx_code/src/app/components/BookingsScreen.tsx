import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, ShieldAlert, Calendar, Clock, Plus } from 'lucide-react';
import { AppService } from '@/services/AppService';
import type { Booking } from '@/domain/models';

interface BookingCardProps {
  booking: {
    id: string;
    providerName: string;
    providerAvatar: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
    categoryName: string;
  };
  onSelect: () => void;
}

export function BookingCard({ booking, onSelect }: BookingCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
    >
      <div className="flex gap-3 mb-3">
        <img
          src={booking.providerAvatar}
          alt={booking.providerName}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex-1">
          <h3 className="font-medium">{booking.providerName}</h3>
          <p className="text-sm text-gray-500">{booking.categoryName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs h-fit ${statusColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {booking.date}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {booking.time}
        </div>
      </div>
    </motion.button>
  );
}

interface BookingsScreenProps {
  onCreateNew?: () => void;
  onSelectBooking?: (bookingId: string) => void;
}

export function BookingsScreen({ onCreateNew, onSelectBooking }: BookingsScreenProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const appService = AppService.getInstance();
      
      // Load customer bookings (using customer1 as default)
      const rawBookings = await appService.getBookingsByCustomer('customer1');
      
      // Transform bookings to include display data
      const transformedBookings = await Promise.all(
        rawBookings.map(async (booking) => {
          const [provider, category] = await Promise.all([
            appService.getProviderById(booking.providerId),
            appService.getCategoriesForTown(booking.townId).then(cats => 
              cats.find(c => c.id === booking.categoryId)
            ),
          ]);

          const bookingDate = new Date(booking.scheduledDate);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          let dateStr = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (bookingDate.toDateString() === today.toDateString()) {
            dateStr = 'Today';
          } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
            dateStr = 'Tomorrow';
          }

          return {
            id: booking.id,
            providerName: provider?.displayName || 'Unknown Provider',
            providerAvatar: provider?.avatar || '',
            date: dateStr,
            time: booking.scheduledTime,
            status: booking.status,
            categoryName: category?.name || 'Service',
          };
        })
      );

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[#2384F4]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl text-white font-semibold">My Bookings</h2>
        </div>
        <p className="text-sm text-white/80">{bookings.length} total bookings</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/80">No bookings yet</p>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="mt-4 px-6 py-3 bg-white text-[#408AF1] rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Booking
              </button>
            )}
          </div>
        ) : (
          bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onSelect={() => onSelectBooking?.(booking.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}