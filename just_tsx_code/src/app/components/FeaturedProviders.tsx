import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Award, TrendingUp } from 'lucide-react';
import { AppService } from '@/services/AppService';
import type { ProviderListItem } from '@/domain/models';

interface FeaturedProvidersProps {
  selectedTownId: string;
  onSelectProvider: (provider: any) => void;
}

export function FeaturedProviders({ selectedTownId, onSelectProvider }: FeaturedProvidersProps) {
  const [providers, setProviders] = useState<ProviderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const appService = AppService.getInstance();

  useEffect(() => {
    loadProviders();
  }, [selectedTownId]);

  const loadProviders = async () => {
    setLoading(true);
    const fetchedProviders = await appService.getTopRatedProviders(selectedTownId, 3);
    setProviders(fetchedProviders);
    setLoading(false);
  };

  const handleSelectProvider = async (providerId: string) => {
    const fullProvider = await appService.getProviderById(providerId);
    if (fullProvider) {
      onSelectProvider(fullProvider);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-48" />
          <div className="flex gap-3 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[280px] h-32 bg-white/20 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg flex items-center gap-2 text-white font-semibold">
            <TrendingUp className="w-5 h-5 text-white" />
            Top Rated Providers
          </h3>
          <p className="text-sm text-white/80 mt-1">Highly recommended in your area</p>
        </div>
      </div>

      <div className="space-y-3">
        {providers.map((provider, index) => (
          <motion.button
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelectProvider(provider.id)}
            className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-gray-100 text-left relative overflow-hidden group hover:scale-[1.02]"
          >
            {index === 0 && (
              <div className="absolute top-3 right-3">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                  <Award className="w-3 h-3" />
                  #1
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white shadow-md bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] flex items-center justify-center">
                {provider.avatar ? (
                  <img
                    src={provider.avatar}
                    alt={provider.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-2xl text-white font-semibold">${provider.displayName?.charAt(0).toUpperCase()}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-2xl text-white font-semibold">
                    {provider.displayName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-1 pr-8">
                <h4 className="font-medium mb-1">{provider.displayName}</h4>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{provider.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{provider.reviewCount} reviews</span>
                </div>

                {provider.availableToday && (
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Available Today
                  </div>
                )}
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#408AF1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}