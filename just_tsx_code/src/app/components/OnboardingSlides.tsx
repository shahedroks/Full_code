import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shield, MessageSquare, ChevronRight } from 'lucide-react';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Search,
    title: 'Find Local Experts',
    description: 'Discover trusted service providers in your town with verified ratings and reviews',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Pay safely through the app with secure payment processing',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: MessageSquare,
    title: 'Safe Communication',
    description: 'Chat directly with providers while keeping your contact info private',
    color: 'from-purple-500 to-purple-600',
  },
];

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`w-28 h-28 bg-gradient-to-br ${currentSlideData.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl`}
            >
              <IconComponent className="w-14 h-14 text-white" />
            </motion.div>

            <h2 className="text-2xl mb-4">{currentSlideData.title}</h2>
            <p className="text-gray-600 leading-relaxed">
              {currentSlideData.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-[#408AF1]'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentSlide < slides.length - 1 && (
            <button
              onClick={handleSkip}
              className="flex-1 py-4 rounded-2xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#408AF1]/30"
          >
            {currentSlide < slides.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}