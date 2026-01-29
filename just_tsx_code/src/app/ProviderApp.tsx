import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell } from 'lucide-react';
import { SellerHome } from '@/app/components/seller/SellerHome';
import { SellerAvailabilitySetup } from '@/app/components/seller/SellerAvailabilitySetup';
import { SellerServiceSetup } from '@/app/components/seller/SellerServiceSetup';
import { SellerPricingScreen } from '@/app/components/seller/SellerPricingScreen';
import { SellerBottomNav } from '@/app/components/seller/SellerBottomNav';
import { SellerBookingsScreen } from '@/app/components/seller/SellerBookingsScreen';
import { SellerMessagesScreen } from '@/app/components/seller/SellerMessagesScreen';
import { SellerEarningsScreen } from '@/app/components/seller/SellerEarningsScreen';
import { SellerProfileScreen } from '@/app/components/seller/SellerProfileScreen';
import { BookingDetails } from '@/app/components/BookingDetails';
import { ChatScreen } from '@/app/components/ChatScreen';
import { NotificationsScreen } from '@/app/components/NotificationsScreen';
import { AppService } from '@/services/AppService';
import { AuthService } from '@/services/AuthService';
import { toast, Toaster } from 'sonner';
import type { User } from '@/domain/auth';
import type { Booking, Town, ServiceCategory, TimeSlot, DayOffException, Provider, ProviderPricing } from '@/domain/models';
import logo from 'figma:asset/d3b4c7636b6767777985706c8ec5912f3e236179.png';

type ScreenType = 
  | 'home' 
  | 'availability' 
  | 'services'
  | 'pricing'
  | 'bookings' 
  | 'messages' 
  | 'earnings' 
  | 'profile' 
  | 'booking-details' 
  | 'chat' 
  | 'notifications';

interface ProviderAppProps {
  onLogout: () => void;
}

export function ProviderApp({ onLogout }: ProviderAppProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'messages' | 'earnings' | 'profile'>('home');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [upcomingJobs, setUpcomingJobs] = useState<Array<Booking & { customerName: string; categoryName: string; townName: string }>>([]);
  const [pendingRequests, setPendingRequests] = useState<Array<Booking & { customerName: string; categoryName: string; townName: string }>>([]);
  const [allBookings, setAllBookings] = useState<Array<Booking & { customerName: string; categoryName: string; townName: string }>>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [currentPricing, setCurrentPricing] = useState<ProviderPricing | null>(null);

  const user = AuthService.getInstance().getCurrentUser()!;

  useEffect(() => {
    loadBookings();
    loadTownsAndCategories();
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    try {
      const [providerData, pricingData] = await Promise.all([
        AppService.getInstance().getProviderById(user.id),
        AppService.getInstance().getProviderPricing(user.id),
      ]);
      setProvider(providerData);
      setCurrentPricing(pricingData);
    } catch (error) {
      console.error('Failed to load provider data:', error);
    }
  };

  const loadTownsAndCategories = async () => {
    try {
      const [townsData, categoriesData] = await Promise.all([
        AppService.getInstance().getTowns(),
        AppService.getInstance().getCategories(), // Get all categories
      ]);
      setTowns(townsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load towns and categories:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const bookings = await AppService.getInstance().getProviderBookings(user.id);
      
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const [category, town] = await Promise.all([
            AppService.getInstance().getCategoriesForTown(booking.townId).then(cats => 
              cats.find(c => c.id === booking.categoryId)
            ),
            AppService.getInstance().getTownById(booking.townId),
          ]);
          
          return {
            ...booking,
            customerName: 'Customer', // We don't expose customer details to provider in listing
            categoryName: category?.name || 'Unknown',
            townName: town?.name || 'Unknown',
          };
        })
      );

      setAllBookings(enrichedBookings);
      
      const pending = enrichedBookings.filter(b => b.status === 'pending');
      const upcoming = enrichedBookings.filter(b => 
        b.status === 'confirmed' || b.status === 'in-progress'
      );
      
      setPendingRequests(pending);
      setUpcomingJobs(upcoming);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedBookingId(jobId);
    setCurrentScreen('booking-details');
  };

  const handleOpenChat = (bookingId: string) => {
    setSelectedChatId(bookingId);
    setCurrentScreen('chat');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    loadBookings();
  };

  const handleBackToBookings = () => {
    setCurrentScreen('bookings');
    setActiveTab('bookings');
    loadBookings();
  };

  const handleBackToMessages = () => {
    setCurrentScreen('messages');
    setActiveTab('messages');
  };

  const handleViewNotifications = () => {
    setCurrentScreen('notifications');
  };

  const handleBackFromNotifications = () => {
    setCurrentScreen(activeTab);
  };

  const handleTabChange = (tab: 'home' | 'bookings' | 'messages' | 'earnings' | 'profile') => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  const handleUpdateBooking = async (bookingId: string, status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled') => {
    try {
      await AppService.getInstance().updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status}`);
      loadBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleSaveAvailability = async (
    availableTowns: string[],
    timeSlots: TimeSlot[],
    daysOff: DayOffException[]
  ) => {
    try {
      await AppService.updateProviderAvailability(user.id, availableTowns, timeSlots, daysOff);
      toast.success('Availability updated successfully');
      setCurrentScreen('home');
      setActiveTab('home');
    } catch (error) {
      console.error('Failed to update availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleSaveServices = async (serviceCategories: string[], availableTowns: string[]) => {
    try {
      const updatedProvider = await AppService.getInstance().updateProviderServices(user.id, serviceCategories, availableTowns);
      toast.success('Services updated successfully');
      
      // Use setState callback to ensure navigation happens after state update
      setProvider(updatedProvider);
      
      // Wait for next tick to ensure state is updated
      setTimeout(() => {
        setCurrentScreen('home');
        setActiveTab('home');
      }, 0);
    } catch (error) {
      console.error('Failed to update services:', error);
      toast.error('Failed to update services');
    }
  };

  const handleSavePricing = async (pricing: ProviderPricing) => {
    try {
      await AppService.getInstance().saveProviderPricing(pricing);
      setCurrentPricing(pricing);
      toast.success('Pricing updated successfully');
      setCurrentScreen('home');
      setActiveTab('home');
    } catch (error) {
      console.error('Failed to update pricing:', error);
      toast.error('Failed to update pricing');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#2384F4] max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-[#0060CF] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Renizo"
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center gap-1">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewNotifications}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#2384F4]">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SellerHome
                upcomingJobs={upcomingJobs}
                pendingRequests={pendingRequests}
                onSelectJob={handleSelectJob}
                onManageServices={() => setCurrentScreen('services')}
                onManagePricing={async () => {
                  // Reload provider data before navigating to pricing
                  await loadProviderData();
                  setCurrentScreen('pricing');
                }}
                providerStatus={provider?.status || 'offline'}
                onStatusChange={async (status) => {
                  try {
                    await AppService.getInstance().updateProviderStatus(user.id, status);
                    setProvider(prev => prev ? { ...prev, status } : null);
                    toast.success(`Status updated to ${status === 'active' ? 'Available' : 'Offline'}`);
                  } catch (error) {
                    console.error('Failed to update status:', error);
                    toast.error('Failed to update status');
                  }
                }}
              />
            </motion.div>
          )}

          {currentScreen === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <SellerAvailabilitySetup
                onBack={handleBackToHome}
                onSave={handleSaveAvailability}
              />
            </motion.div>
          )}

          {currentScreen === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <SellerServiceSetup
                towns={towns}
                categories={categories}
                onBack={handleBackToHome}
                onSave={handleSaveServices}
              />
            </motion.div>
          )}

          {currentScreen === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <SellerPricingScreen
                categories={categories}
                providerCategoryIds={provider?.categoryIds || []}
                currentPricing={currentPricing}
                onBack={handleBackToHome}
                onSave={handleSavePricing}
                onNavigateToServices={() => setCurrentScreen('services')}
              />
            </motion.div>
          )}

          {currentScreen === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SellerBookingsScreen
                bookings={allBookings}
                onSelectBooking={handleSelectJob}
              />
            </motion.div>
          )}

          {currentScreen === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SellerMessagesScreen
                onSelectChat={(customerId, bookingId) => {
                  setSelectedChatId(bookingId);
                  setCurrentScreen('chat');
                }}
              />
            </motion.div>
          )}

          {currentScreen === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SellerEarningsScreen
                bookings={allBookings}
              />
            </motion.div>
          )}

          {currentScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SellerProfileScreen
                onLogout={onLogout}
                provider={provider}
                towns={towns}
                categories={categories}
              />
            </motion.div>
          )}

          {currentScreen === 'booking-details' && selectedBookingId && (
            <motion.div
              key="booking-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <BookingDetails
                bookingId={selectedBookingId}
                onBack={activeTab === 'bookings' ? handleBackToBookings : handleBackToHome}
                onOpenChat={handleOpenChat}
                onUpdateBooking={handleUpdateBooking}
                userRole="provider"
              />
            </motion.div>
          )}

          {currentScreen === 'chat' && selectedChatId && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ChatScreen
                bookingId={selectedChatId}
                onBack={activeTab === 'messages' ? handleBackToMessages : (activeTab === 'bookings' ? handleBackToBookings : handleBackToHome)}
                userRole="provider"
              />
            </motion.div>
          )}

          {currentScreen === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <NotificationsScreen
                onBack={handleBackFromNotifications}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {!['booking-details', 'chat', 'availability', 'services', 'pricing', 'notifications'].includes(currentScreen) && (
        <SellerBottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingCount={pendingRequests.length}
          unreadMessages={0}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}