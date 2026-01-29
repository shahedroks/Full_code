import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ServiceSelectionScreen } from './ServiceSelectionScreen';
import { AddonsSelectionScreen } from './AddonsSelectionScreen';
import { BookingFormScreen } from './BookingFormScreen';
import { ProviderMatchingScreen } from './ProviderMatchingScreen';
import { AppService } from '@/services/AppService';
import type { ServiceCategory } from '@/domain/models';

interface NewBookingFlowProps {
  categoryId: string;
  townId: string;
  onBack: () => void;
  onComplete: (bookingId: string) => void;
}

type FlowStep = 'sub-section' | 'addons' | 'booking-form' | 'matching' | 'payment';

export function NewBookingFlow({ categoryId, townId, onBack, onComplete }: NewBookingFlowProps) {
  const [step, setStep] = useState<FlowStep>('sub-section');
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubSectionId, setSelectedSubSectionId] = useState<string | undefined>();
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [bookingFormData, setBookingFormData] = useState<any>(null);
  const [matchingStatus, setMatchingStatus] = useState<'loading' | 'success' | 'no-providers'>('loading');

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    const categories = await AppService.getInstance().getCategories();
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
      setCategory(cat);
    }
  };

  const handleSubSectionSelect = (subSectionId: string) => {
    setSelectedSubSectionId(subSectionId);
    setStep('addons');
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleContinueToBookingForm = () => {
    setStep('booking-form');
  };

  const handleBackToSubSection = () => {
    setStep('sub-section');
  };

  const handleBackToAddons = () => {
    setStep('addons');
  };

  const handleBookingFormSubmit = async (data: any) => {
    setBookingFormData(data);
    setStep('matching');
    
    // Simulate provider matching
    setMatchingStatus('loading');
    
    // Mock matching logic
    setTimeout(async () => {
      const providers = await AppService.getInstance().getProvidersForCategory(categoryId, townId);
      
      if (providers.length > 0) {
        setMatchingStatus('success');
        // After showing success, proceed to create booking
        setTimeout(() => {
          // In a real app, would navigate to payment screen
          // For now, we'll complete the flow
          onComplete('new-booking-id');
        }, 2000);
      } else {
        setMatchingStatus('no-providers');
      }
    }, 2000);
  };

  const handleChangeDateTime = () => {
    setStep('booking-form');
  };

  if (!category) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'sub-section' && (
        <ServiceSelectionScreen
          category={category}
          onBack={onBack}
          onSubSectionSelect={handleSubSectionSelect}
          selectedSubSectionId={selectedSubSectionId}
        />
      )}

      {step === 'addons' && (
        <AddonsSelectionScreen
          category={category}
          selectedAddonIds={selectedAddonIds}
          onBack={handleBackToSubSection}
          onToggleAddon={handleToggleAddon}
          onContinue={handleContinueToBookingForm}
        />
      )}

      {step === 'booking-form' && (
        <BookingFormScreen
          onBack={handleBackToAddons}
          onSubmit={handleBookingFormSubmit}
          initialData={bookingFormData}
        />
      )}

      {step === 'matching' && (
        <ProviderMatchingScreen
          status={matchingStatus}
          onChangeDateTime={handleChangeDateTime}
          onViewProvider={() => setStep('payment')}
          providerName="Available Provider"
        />
      )}
    </AnimatePresence>
  );
}
