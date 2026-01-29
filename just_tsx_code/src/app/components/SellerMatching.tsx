import { motion } from 'motion/react';
import { Star, MapPin, Clock, Zap, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AppService } from '@/services/AppService';
import type { ProviderListItem } from '@/domain/models';

interface SellerMatchingProps {
  categoryId: string;
  selectedTownId: string;
  bookingId: string;
  onBack: () => void;
  onSelectProvider: (provider: ProviderListItem) => void;
  onAutoAssign: () => void;
}

export function SellerMatching({
  categoryId,
  selectedTownId,
  bookingId,
  onBack,
  onSelectProvider,
  onAutoAssign,
}: SellerMatchingProps) {
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const appService = AppService.getInstance();

  useEffect(() => {
    loadProviders();
  }, [categoryId, selectedTownId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProviders = async () => {
    setLoading(true);
    console.log('Loading providers for category:', categoryId, 'town:', selectedTownId);
    const fetchedProviders = await appService.getProvidersForCategory(categoryId, selectedTownId);
    console.log('Fetched providers:', fetchedProviders);
    setProviders(fetchedProviders);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#2384F4]">
        <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white font-medium mb-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-xl text-white">Available Providers</h2>
          <p className="text-sm text-white/80 mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white font-medium mb-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl text-white">Available Providers</h2>
        <p className="text-sm text-white/80 mt-1">
          {providers.length} providers ready to help
        </p>
      </div>

      {/* Auto-assign banner */}
      <div className="bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] px-4 py-4 text-white">
        <p className="text-center font-medium">Choose a Provider</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        
        {providers.map((provider, index) => (
          <motion.button
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectProvider(provider)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#408AF1]/30 text-left"
          >
            <div className="flex gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] flex items-center justify-center flex-shrink-0">
                {provider.avatar ? (
                  <img
                    src={provider.avatar}
                    alt={provider.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  className="text-lg text-white font-semibold w-full h-full flex items-center justify-center"
                  style={{ display: provider.avatar ? 'none' : 'flex' }}
                >
                  {provider.displayName?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium mb-1">{provider.displayName}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{provider.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{provider.reviewCount} reviews</span>
                </div>
              </div>

              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium h-fit flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{provider.responseTime}</span>
              </div>
            </div>
          </motion.button>
        ))}

        {providers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium mb-1">No providers available right now</h3>
            <p className="text-sm text-gray-500">
              Try selecting a different time or we can notify you when someone becomes available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}