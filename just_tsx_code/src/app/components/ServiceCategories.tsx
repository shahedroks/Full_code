import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { AppService } from '@/services/AppService';
import type { ServiceCategory } from '@/domain/models';

interface ServiceCategoriesProps {
  selectedTownId: string;
  onSelectCategory: (category: ServiceCategory) => void;
}

export function ServiceCategories({ selectedTownId, onSelectCategory }: ServiceCategoriesProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const appService = AppService.getInstance();

  useEffect(() => {
    loadCategories();
  }, [selectedTownId]);

  const loadCategories = async () => {
    setLoading(true);
    const fetchedCategories = await appService.getCategoriesForTown(selectedTownId);
    setCategories(fetchedCategories);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-32" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-white/20 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-8">
      <h3 className="text-lg mb-4 text-white font-semibold">Services Available</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, index) => {
          const IconComponent = (Icons as any)[category.icon] || Icons.Wrench;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectCategory(category)}
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#408AF1]/10 to-[#5ca3f5]/10 rounded-xl flex items-center justify-center mb-3">
                <IconComponent className="w-6 h-6 text-[#408AF1]" />
              </div>
              <p className="font-medium text-left text-gray-900">{category.name}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}