import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';
import { SplashScreen } from '@/app/components/SplashScreen';
import { OnboardingSlides } from '@/app/components/OnboardingSlides';
import { TownSelectionModal } from '@/app/components/TownSelectionModal';
import { Header } from '@/app/components/Header';
import { BottomNav } from '@/app/components/BottomNav';
import { ServiceCategories } from '@/app/components/ServiceCategories';
import { FeaturedProviders } from '@/app/components/FeaturedProviders';
import { ProviderList } from '@/app/components/ProviderList';
import { ProviderProfile } from '@/app/components/ProviderProfile';
import { TaskSubmission } from '@/app/components/TaskSubmission';
import { SellerMatching } from '@/app/components/SellerMatching';
import { BookingFlow } from '@/app/components/BookingFlow';
import { BookingDetails } from '@/app/components/BookingDetails';
import { PaymentScreen } from '@/app/components/PaymentScreen';
import { ChatScreen } from '@/app/components/ChatScreen';
import { BookingsScreen } from '@/app/components/BookingsScreen';
import { MessagesScreen } from '@/app/components/MessagesScreen';
import { NotificationsScreen } from '@/app/components/NotificationsScreen';
import { ProfileScreen } from '@/app/components/ProfileScreen';
import { SearchScreen } from '@/app/components/SearchScreen';
import { WelcomeBanner } from '@/app/components/WelcomeBanner';
import { AppService } from '@/services/AppService';
import { AuthService } from '@/services/AuthService';
import type { Town, ServiceCategory, Provider } from '@/domain/models';
import type { User } from '@/domain/auth';
import { Toaster, toast } from 'sonner';

type AppFlow = 'splash' | 'onboarding' | 'main';

type ViewState = 
  | { type: 'home' }
  | { type: 'category'; category: ServiceCategory }
  | { type: 'provider-profile'; provider: Provider }
  | { type: 'task-submission' }
  | { type: 'seller-matching'; categoryId: string; date: string; time: string; bookingId: string }
  | { type: 'booking'; provider: Provider; categoryId: string }
  | { type: 'payment'; providerName: string; amount: string; bookingId: string }
  | { type: 'booking-details'; bookingId: string }
  | { type: 'chat'; provider: Provider; bookingId?: string }
  | { type: 'notifications' };

interface CustomerAppProps {
  user: User;
  onLogout: () => void;
  onUpdateUser?: (updatedUser: Partial<User>) => void;
}

export function CustomerApp({ user, onLogout, onUpdateUser }: CustomerAppProps) {
  const [appFlow, setAppFlow] = useState<AppFlow>('splash');
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownModal, setShowTownModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [viewState, setViewState] = useState<ViewState>({ type: 'home' });

  const appService = AppService.getInstance();
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem(`hasOnboarded_${user.id}`);
    const savedTown = localStorage.getItem(`selectedTown_${user.id}`);
    
    if (!hasOnboarded) {
      // New user - show onboarding flow
      return;
    }
    
    if (savedTown) {
      setSelectedTown(JSON.parse(savedTown));
      setAppFlow('main');
    } else {
      setAppFlow('onboarding');
    }
  }, [user.id]);

  const handleSplashComplete = () => {
    const hasOnboarded = localStorage.getItem(`hasOnboarded_${user.id}`);
    setAppFlow(hasOnboarded ? 'main' : 'onboarding');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem(`hasOnboarded_${user.id}`, 'true');
    setShowTownModal(true);
    setAppFlow('main');
  };

  const handleSelectTown = (town: Town) => {
    setSelectedTown(town);
    localStorage.setItem(`selectedTown_${user.id}`, JSON.stringify(town));
    setShowTownModal(false);
    toast.success(`Now showing services in ${town.name}`);
  };

  const handleChangeTown = () => {
    setShowTownModal(true);
  };

  const handleSelectCategory = (category: ServiceCategory) => {
    setViewState({ type: 'task-submission' });
  };

  const handleSelectProvider = (provider: Provider) => {
    setViewState({ type: 'provider-profile', provider });
  };

  const handleBookNow = (provider: Provider) => {
    setViewState({ type: 'booking', provider, categoryId: provider.categoryId });
  };

  const handleCreateTask = () => {
    setViewState({ type: 'task-submission' });
  };

  const handleTaskSubmit = async (taskData: { 
    categoryId: string; 
    date: string; 
    time: string;
    address: string;
    notes?: string;
  }) => {
    if (!selectedTown) return;

    try {
      // Create the booking
      const booking = await appService.createBooking({
        customerId: user.id,
        providerId: 'temp', // Will be assigned after matching
        categoryId: taskData.categoryId,
        townId: selectedTown.id,
        scheduledDate: taskData.date,
        scheduledTime: taskData.time,
        address: taskData.address,
        notes: taskData.notes,
      });

      setViewState({ 
        type: 'seller-matching', 
        categoryId: taskData.categoryId,
        date: taskData.date,
        time: taskData.time,
        bookingId: booking.id,
      });
      toast.success('Finding available providers...');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  const handleAutoAssign = async () => {
    toast.success('Provider auto-assigned! Redirecting to payment...');
    setTimeout(async () => {
      if (selectedTown && viewState.type === 'seller-matching') {
        const providers = await appService.getAvailableProvidersForBooking(
          viewState.categoryId,
          selectedTown.id,
          viewState.date,
          viewState.time
        );
        if (providers.length > 0) {
          const provider = await appService.getProviderById(providers[0].id);
          if (provider) {
            setViewState({ type: 'payment', providerName: provider.displayName, amount: '$150.00', bookingId: viewState.bookingId });
          }
        }
      }
    }, 1500);
  };

  const handlePaymentSuccess = () => {
    setViewState({ type: 'home' });
    setActiveTab('bookings');
    toast.success('Booking confirmed! You can track it in your bookings.');
  };

  const handleBookingComplete = () => {
    if (viewState.type === 'booking') {
      setViewState({ type: 'payment', providerName: viewState.provider.displayName, amount: '$150.00', bookingId: viewState.provider.id });
    }
  };

  const handleOpenChat = async (providerId: string, bookingId?: string) => {
    const provider = await appService.getProviderById(providerId);
    if (provider) {
      setViewState({ type: 'chat', provider, bookingId });
      setActiveTab('messages');
    }
  };

  const handleViewNotifications = () => {
    setViewState({ type: 'notifications' });
  };

  const handleCloseNotifications = () => {
    setViewState({ type: 'home' });
  };

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  const renderContent = () => {
    if (!selectedTown) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }

    // Notifications view
    if (viewState.type === 'notifications') {
      return <NotificationsScreen onClose={handleCloseNotifications} />;
    }

    // Tab-based views
    if (activeTab === 'bookings') {
      if (viewState.type === 'booking-details') {
        return (
          <BookingDetails
            bookingId={viewState.bookingId}
            onBack={() => setViewState({ type: 'home' })}
            onOpenChat={async (bookingId) => {
              // Find the booking to get provider info and open chat directly
              const booking = await AppService.getInstance().getBookingById(bookingId);
              if (booking) {
                const provider = await AppService.getInstance().getProviderById(booking.providerId);
                if (provider) {
                  setActiveTab('messages');
                  setViewState({ type: 'chat', provider, bookingId });
                }
              }
            }}
            userRole="customer"
          />
        );
      }
      return (
        <BookingsScreen
          onCreateNew={handleCreateTask}
          onSelectBooking={(id) => setViewState({ type: 'booking-details', bookingId: id })}
        />
      );
    }

    if (activeTab === 'messages') {
      if (viewState.type === 'chat') {
        return (
          <ChatScreen
            provider={viewState.provider}
            bookingId={viewState.bookingId}
            userRole="customer"
            onBack={() => setViewState({ type: 'home' })}
          />
        );
      }
      return <MessagesScreen onSelectChat={handleOpenChat} />;
    }

    if (activeTab === 'profile') {
      return (
        <ProfileScreen 
          onChangeTown={handleChangeTown}
          onLogout={handleLogout}
          onUpdateUser={onUpdateUser}
          user={user}
        />
      );
    }

    if (activeTab === 'search') {
      return (
        <SearchScreen
          selectedTownId={selectedTown.id}
          onSelectProvider={handleSelectProvider}
        />
      );
    }

    // Home tab with complex view states
    if (viewState.type === 'payment') {
      return (
        <PaymentScreen
          amount={viewState.amount}
          providerName={viewState.providerName}
          onBack={() => setViewState({ type: 'home' })}
          onSuccess={handlePaymentSuccess}
        />
      );
    }

    if (viewState.type === 'booking') {
      return (
        <BookingFlow
          provider={viewState.provider}
          categoryId={viewState.categoryId}
          onBack={() => setViewState({ type: 'provider-profile', provider: viewState.provider })}
          onComplete={handleBookingComplete}
        />
      );
    }

    if (viewState.type === 'seller-matching') {
      return (
        <SellerMatching
          categoryId={viewState.categoryId}
          selectedTownId={selectedTown.id}
          bookingId={viewState.bookingId}
          onBack={() => setViewState({ type: 'task-submission' })}
          onSelectProvider={async (provider) => {
            // Update the booking with the selected provider
            await appService.updateBooking(viewState.bookingId, {
              providerId: provider.id,
            });
            
            // Get pricing for the service - for now using a mock price
            // In production, you'd fetch the actual service pricing
            const amount = '$150.00';
            
            setViewState({ 
              type: 'payment', 
              providerName: provider.displayName, 
              amount,
              bookingId: viewState.bookingId
            });
          }}
          onAutoAssign={handleAutoAssign}
        />
      );
    }

    if (viewState.type === 'task-submission') {
      return (
        <TaskSubmission
          selectedTownId={selectedTown.id}
          onBack={() => setViewState({ type: 'home' })}
          onSubmit={handleTaskSubmit}
        />
      );
    }

    if (viewState.type === 'provider-profile') {
      return (
        <ProviderProfile
          provider={viewState.provider}
          onBack={() => setViewState({ type: 'home' })}
          onBookNow={() => handleBookNow(viewState.provider)}
        />
      );
    }

    if (viewState.type === 'category') {
      return (
        <ProviderList
          category={viewState.category}
          selectedTownId={selectedTown.id}
          onSelectProvider={handleSelectProvider}
          onBack={() => setViewState({ type: 'home' })}
        />
      );
    }

    // Home screen
    return (
      <div className="overflow-y-auto bg-[#2384F4]">
        <WelcomeBanner userName={user.name} />
        
        {/* Quick Action Button */}
        <div className="px-4 mb-4">
          <button
            onClick={handleCreateTask}
            className="w-full bg-[#003E93] text-white py-4 rounded-2xl font-medium shadow-lg shadow-[#003E93]/30 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            Create New Booking
          </button>
        </div>

        <FeaturedProviders
          selectedTownId={selectedTown.id}
          onSelectProvider={handleSelectProvider}
        />
        
        <ServiceCategories
          selectedTownId={selectedTown.id}
          onSelectCategory={handleSelectCategory}
        />
      </div>
    );
  };

  // Splash screen
  if (appFlow === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Onboarding slides
  if (appFlow === 'onboarding' && !localStorage.getItem(`hasOnboarded_${user.id}`)) {
    return <OnboardingSlides onComplete={handleOnboardingComplete} />;
  }

  // Main app
  return (
    <div className="h-screen flex flex-col bg-[#2384F4] max-w-md mx-auto relative">
      <TownSelectionModal
        isOpen={showTownModal}
        onSelectTown={handleSelectTown}
        canClose={selectedTown !== null}
      />

      <Header 
        selectedTown={selectedTown} 
        onChangeTown={handleChangeTown} 
        onNotifications={handleViewNotifications}
        user={user}
      />

      <main className="flex-1 overflow-hidden pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + viewState.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Toaster position="top-center" />
    </div>
  );
}