import { useState } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';
import { PROVIDERS, SERVICE_CATEGORIES } from '@/app/data/mockData';
import type { Provider, ServiceCategory } from '@/app/data/mockData';

interface SearchScreenProps {
  selectedTownId: string;
  onSelectProvider: (provider: Provider) => void;
}

export function SearchScreen({ selectedTownId, onSelectProvider }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = PROVIDERS.filter(provider => {
    if (!provider.townIds.includes(selectedTownId)) return false;
    
    const query = searchQuery.toLowerCase();
    const matchesName = provider.name.toLowerCase().includes(query);
    const category = SERVICE_CATEGORIES.find(c => c.id === provider.categoryId);
    const matchesCategory = category?.name.toLowerCase().includes(query);
    
    return matchesName || matchesCategory;
  });

  const filteredCategories = SERVICE_CATEGORIES.filter(cat => {
    if (!cat.townIds.includes(selectedTownId)) return false;
    return cat.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      <div className="px-4 py-6">
        <h2 className="text-xl mb-4 text-white font-semibold">Search</h2>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services or providers..."
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {searchQuery ? (
          <>
            {filteredCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-white">Categories</h3>
                <div className="space-y-2">
                  {filteredCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-3 border border-gray-100"
                    >
                      <p className="font-medium">{category.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {filteredProviders.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-white">Providers</h3>
                <div className="space-y-3">
                  {filteredProviders.map((provider, index) => (
                    <motion.button
                      key={provider.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSelectProvider(provider)}
                      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] flex items-center justify-center flex-shrink-0">
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
                            className="text-lg text-white font-semibold w-full h-full flex items-center justify-center"
                            style={{ display: provider.avatar ? 'none' : 'flex' }}
                          >
                            {provider.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{provider.name}</h4>
                          <p className="text-sm text-gray-500">
                            {SERVICE_CATEGORIES.find(c => c.id === provider.categoryId)?.name}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {filteredCategories.length === 0 && filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white">No results found</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-white/50 mx-auto mb-3" />
            <p className="text-white">Search for services or providers</p>
          </div>
        )}
      </div>
    </div>
  );
}