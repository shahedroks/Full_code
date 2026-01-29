import { motion } from 'motion/react';
import { Star, MapPin, Clock, Shield, CheckCircle, ChevronLeft } from 'lucide-react';
import { SERVICE_CATEGORIES, TOWNS } from '@/app/data/mockData';
import type { ProviderListItem } from '@/domain/models';

interface ProviderProfileProps {
  provider: ProviderListItem;
  onBack: () => void;
  onBookNow: () => void;
}

const mockReviews = [
  {
    id: '1',
    author: 'Sarah Johnson',
    rating: 5,
    date: 'Jan 10, 2026',
    comment: 'Excellent service! Very professional and completed the work quickly.',
  },
  {
    id: '2',
    author: 'Mike Chen',
    rating: 5,
    date: 'Jan 8, 2026',
    comment: 'Highly recommend. Great communication and fair pricing.',
  },
  {
    id: '3',
    author: 'Emily Davis',
    rating: 4,
    date: 'Jan 5, 2026',
    comment: 'Good work overall. Arrived on time and was very courteous.',
  },
];

export function ProviderProfile({ provider, onBack, onBookNow }: ProviderProfileProps) {
  // Since ProviderListItem only has categoryNames array, we'll use the first one to find the category
  const categoryName = provider.categoryNames?.[0] || 'Service';

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header with back button and provider image */}
      <div className="relative bg-[#2384F4] h-32">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-xl bg-[#2384F4] flex items-center justify-center overflow-hidden">
            {provider.avatar ? (
              <img
                src={provider.avatar}
                alt={provider.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image and show fallback on error
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <span 
              className="text-3xl text-white font-semibold w-full h-full flex items-center justify-center"
              style={{ display: provider.avatar ? 'none' : 'flex' }}
            >
              {provider.displayName?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-16 pb-24">
        <div className="text-center px-4 mb-6">
          <h2 className="text-xl mb-1 text-white">{provider.displayName}</h2>
          <p className="text-white/80 mb-3">{categoryName}</p>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-white">{provider.rating}</span>
              <span className="text-white/70">({provider.reviewCount})</span>
            </div>
            <span className="text-white/50">•</span>
            <span className="text-white/80">{provider.distance}</span>
          </div>

          {provider.availableToday && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium">Available Today</span>
            </div>
          )}
        </div>

        {/* Services Offered */}
        <div className="px-4 mb-3">
          <div className="bg-white rounded-2xl px-4 py-5 border border-gray-100">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#408AF1]" />
              Services Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.categoryNames?.map(service => (
                <div
                  key={service}
                  className="px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-700 border border-gray-200"
                >
                  {service}
                </div>
              )) || (
                <div className="px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-700 border border-gray-200">
                  {categoryName}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl px-4 py-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#408AF1]" />
                <span className="font-medium">Response Time</span>
              </div>
              <span className="text-gray-600">{provider.responseTime}</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4">
          <h3 className="font-medium mb-4 text-white">Recent Reviews</h3>
          <div className="space-y-3">
            {mockReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-md mx-auto">
        <button
          onClick={onBookNow}
          className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium shadow-lg shadow-[#408AF1]/30"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
