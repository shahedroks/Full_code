import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, DollarSign, Check, AlertCircle, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import type { ServiceCategory, ProviderPricing, CategoryPricing, SubSectionPricing, AddonPricing } from '@/domain/models';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';

interface SellerPricingScreenProps {
  categories: ServiceCategory[];
  providerCategoryIds: string[];
  currentPricing?: ProviderPricing;
  onBack: () => void;
  onSave: (pricing: ProviderPricing) => void;
  onNavigateToServices?: () => void;
}

export function SellerPricingScreen({
  categories,
  providerCategoryIds,
  currentPricing,
  onBack,
  onSave,
  onNavigateToServices,
}: SellerPricingScreenProps) {
  console.log('SellerPricingScreen rendered with providerCategoryIds:', providerCategoryIds);
  
  const [pricing, setPricing] = useState<Map<string, CategoryPricing>>(new Map());
  const [activeSubsection, setActiveSubsection] = useState<Map<string, string>>(new Map());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initializedRef = useRef(false);

  // Filter categories to only show ones the provider offers
  const providerCategories = categories.filter(cat => providerCategoryIds.includes(cat.id));

  useEffect(() => {
    // Only initialize once when component mounts
    if (initializedRef.current) {
      return;
    }
    
    initializedRef.current = true;
    
    // Initialize pricing from current pricing or defaults
    const initialPricing = new Map<string, CategoryPricing>();
    
    if (currentPricing) {
      currentPricing.categoryPricing.forEach(cp => {
        initialPricing.set(cp.categoryId, cp);
      });
    } else {
      // Initialize with empty pricing for each category
      const filteredCategories = categories.filter(cat => providerCategoryIds.includes(cat.id));
      filteredCategories.forEach(category => {
        initialPricing.set(category.id, {
          categoryId: category.id,
          subSectionPricing: category.subSections.map(sub => ({
            subSectionId: sub.id,
            price: 0,
          })),
          addonPricing: category.addons.map(addon => ({
            addonId: addon.id,
            price: addon.price || 0,
          })),
        });
      });
    }
    
    setPricing(initialPricing);
  }, []); // Empty dependency array - only run once on mount

  const toggleCategory = (categoryId: string) => {
    const newSet = new Set(activeSubsection);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);
    }
    setActiveSubsection(newSet);
  };

  const updateSubSectionPrice = (categoryId: string, subSectionId: string, price: number) => {
    const newPricing = new Map(pricing);
    const catPricing = newPricing.get(categoryId);
    
    if (catPricing) {
      const updatedSubSections = catPricing.subSectionPricing.map(sp =>
        sp.subSectionId === subSectionId ? { ...sp, price } : sp
      );
      
      newPricing.set(categoryId, {
        ...catPricing,
        subSectionPricing: updatedSubSections,
      });
      
      setPricing(newPricing);
      setHasUnsavedChanges(true);
    }
  };

  const updateAddonPrice = (categoryId: string, addonId: string, price: number) => {
    const newPricing = new Map(pricing);
    const catPricing = newPricing.get(categoryId);
    
    if (catPricing) {
      const updatedAddons = catPricing.addonPricing.map(ap =>
        ap.addonId === addonId ? { ...ap, price } : ap
      );
      
      newPricing.set(categoryId, {
        ...catPricing,
        addonPricing: updatedAddons,
      });
      
      setPricing(newPricing);
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = () => {
    // No validation needed since prices are predefined
    const pricingArray = Array.from(pricing.values());

    const pricing: ProviderPricing = {
      providerId: currentPricing?.providerId || 'current-provider',
      categoryPricing: pricingArray,
    };

    onSave(pricing);
    setHasUnsavedChanges(false);
    toast.success('Service pricing saved successfully');
  };

  const getCategoryProgress = (categoryId: string): number => {
    const catPricing = pricing.get(categoryId);
    if (!catPricing) return 0;
    
    const totalItems = catPricing.subSectionPricing.length;
    const completedItems = catPricing.subSectionPricing.filter(sp => sp.price > 0).length;
    
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  return (
    <div className="flex flex-col h-full bg-[#2384F4]">
      {/* Header */}
      <div className="bg-[#2384F4] px-4 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white font-medium mb-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-white">Service Pricing</h2>
        <p className="text-sm text-white/70">View standard prices for your services</p>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex gap-2">
        <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white">
          <p className="font-medium mb-1">Standard Pricing</p>
          <p className="text-xs text-white/80">
            These are the standard prices set by Renizo. Customers pay in full, and you receive 90% after the 10% service fee.
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {providerCategories.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-white/30 mx-auto mb-3" />
            <p className="text-white mb-2">No services selected</p>
            <p className="text-sm text-white/70">
              Please select your service categories first
            </p>
            {onNavigateToServices && (
              <button
                onClick={onNavigateToServices}
                className="mt-4 px-4 py-2 bg-white text-[#408AF1] rounded-2xl font-semibold shadow-lg transition-all hover:shadow-xl"
              >
                Select Services
              </button>
            )}
          </div>
        ) : (
          providerCategories.map((category, index) => {
            const isExpanded = activeSubsection.has(category.id);
            const progress = getCategoryProgress(category.id);
            const IconComponent = (Icons as any)[category.icon] || Icons.Wrench;
            const catPricing = pricing.get(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#408AF1]/20 to-[#408AF1]/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-[#408AF1]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {category.subSections.length} services • {category.addons.length} add-ons
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && catPricing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-4 space-y-4 bg-gray-50/50">
                        {/* Sub-sections */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-[#408AF1] rounded-full" />
                            Base Services
                          </h4>
                          <div className="space-y-2">
                            {category.subSections.map((subSection) => {
                              const pricing = catPricing.subSectionPricing.find(
                                sp => sp.subSectionId === subSection.id
                              );
                              
                              return (
                                <div key={subSection.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{subSection.name}</p>
                                    <p className="text-xs text-gray-500">Standard pricing</p>
                                  </div>
                                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-900">
                                      {subSection.price?.toFixed(2) || '0.00'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Add-ons */}
                        {category.addons.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                              Add-Ons (Optional Services)
                            </h4>
                            <div className="space-y-2">
                              {category.addons.map((addon) => {
                                const pricing = catPricing.addonPricing.find(
                                  ap => ap.addonId === addon.id
                                );
                                
                                return (
                                  <div key={addon.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-700">{addon.name}</p>
                                      <p className="text-xs text-gray-500">Optional extra service</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                                      <DollarSign className="w-4 h-4 text-emerald-600" />
                                      <span className="text-sm font-semibold text-emerald-700">
                                        {addon.price?.toFixed(2) || '0.00'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}