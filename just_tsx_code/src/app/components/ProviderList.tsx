import { motion } from 'motion/react';
import { Star, MapPin, Clock } from 'lucide-react';
import { PROVIDERS, type Provider, type ServiceCategory } from '@/app/data/mockData';

interface ProviderListProps {
  category: ServiceCategory;
  selectedTownId: string;
  onSelectProvider: (provider: Provider) => void;
  onBack: () => void;
}

export function ProviderList({ category, selectedTownId, onSelectProvider, onBack }: ProviderListProps) {
  const providers = PROVIDERS.filter(
    p => p.categoryId === category.id && p.townIds.includes(selectedTownId)
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-[#408AF1] font-medium mb-2"
        >
          ← Back
        </button>
        <h2 className="text-xl">{category.name} Services</h2>
        <p className="text-sm text-gray-500">{providers.length} providers available</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {providers.map((provider, index) => (
          <motion.button
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectProvider(provider)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] flex items-center justify-center flex-shrink-0">
                {provider.avatar ? (
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  className="text-xl text-white font-semibold w-full h-full flex items-center justify-center"
                  style={{ display: provider.avatar ? 'none' : 'flex' }}
                >
                  {provider.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium">{provider.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    provider.availability === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {provider.availability === 'available' ? 'Available' : 'Busy'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-sm text-gray-500">({provider.reviewCount})</span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-sm text-gray-600">{provider.priceRange}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {provider.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {provider.responseTime.replace('Usually responds in ', '')}
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}