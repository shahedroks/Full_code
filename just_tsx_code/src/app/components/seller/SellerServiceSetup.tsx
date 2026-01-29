import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, Check, ChevronLeft, Wrench } from 'lucide-react';
import type { Town, ServiceCategory } from '@/domain/models';
import * as Icons from 'lucide-react';

interface SellerServiceSetupProps {
  towns: Town[];
  categories: ServiceCategory[];
  initialTownIds?: string[];
  initialCategoryIds?: string[];
  onBack: () => void;
  onSave: (categoryIds: string[], townIds: string[]) => void;
}

export function SellerServiceSetup({
  towns,
  categories,
  initialTownIds = [],
  initialCategoryIds = [],
  onBack,
  onSave,
}: SellerServiceSetupProps) {
  const [selectedTowns, setSelectedTowns] = useState<Set<string>>(new Set(initialTownIds));
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(initialCategoryIds)
  );

  const toggleTown = (townId: string) => {
    const newSet = new Set(selectedTowns);
    if (newSet.has(townId)) {
      newSet.delete(townId);
    } else {
      newSet.add(townId);
    }
    setSelectedTowns(newSet);
  };

  const toggleCategory = (categoryId: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);
    }
    setSelectedCategories(newSet);
  };

  const handleSave = () => {
    onSave(Array.from(selectedCategories), Array.from(selectedTowns));
  };

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
        <h2 className="text-xl text-white">Service Areas & Categories</h2>
        <p className="text-sm text-white/70">Choose where and what services you offer</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Service Areas (Towns) */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5 text-white" />
            Service Areas
            <span className="text-sm text-white/70">
              ({selectedTowns.size} selected)
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {towns.map((town, index) => {
              const isSelected = selectedTowns.has(town.id);
              return (
                <motion.button
                  key={town.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleTown(town.id)}
                  className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border hover:scale-105 text-left relative ${
                    isSelected
                      ? 'border-[#408AF1] ring-2 ring-[#408AF1]/30'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-medium ${isSelected ? 'text-[#408AF1]' : 'text-gray-900'}`}>{town.name}</p>
                      <p className="text-xs text-gray-500">{town.state}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#408AF1] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Service Categories */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
            <Briefcase className="w-5 h-5 text-white" />
            Service Categories
            <span className="text-sm text-white/70">
              ({selectedCategories.size} selected)
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => {
              const isSelected = selectedCategories.has(category.id);
              const IconComponent = (Icons as any)[category.icon] || Icons.Wrench;

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleCategory(category.id)}
                  className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border hover:scale-105 text-left relative ${
                    isSelected
                      ? 'border-[#408AF1] ring-2 ring-[#408AF1]/30'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#408AF1]/10 to-[#5ca3f5]/10 rounded-xl flex items-center justify-center mb-3">
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[#408AF1]' : 'text-[#408AF1]'}`} />
                  </div>
                  <p className={`font-medium text-sm ${isSelected ? 'text-[#408AF1]' : 'text-gray-900'}`}>
                    {category.name}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#408AF1] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <button
          onClick={handleSave}
          disabled={selectedTowns.size === 0 || selectedCategories.size === 0}
          className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#408AF1]/30"
        >
          Save Service Coverage
        </button>
      </div>
    </div>
  );
}