import { ArrowLeft, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import type { ServiceCategory, ServiceAddon } from '@/domain/models';
import * as Icons from 'lucide-react';

interface AddonsSelectionScreenProps {
  category: ServiceCategory;
  selectedAddonIds: string[];
  onBack: () => void;
  onToggleAddon: (addonId: string) => void;
  onContinue: () => void;
}

export function AddonsSelectionScreen({
  category,
  selectedAddonIds,
  onBack,
  onToggleAddon,
  onContinue,
}: AddonsSelectionScreenProps) {
  const IconComponent = (Icons as any)[category.icon] || Icons.Sparkles;
  const totalAddonsPrice = category.addons
    .filter(addon => selectedAddonIds.includes(addon.id))
    .reduce((sum, addon) => sum + (addon.price || 0), 0);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Add-ons</h2>
            <p className="text-sm text-gray-500">Optional extras for your service</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#408AF1]/10 to-[#408AF1]/5 rounded-2xl flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-[#408AF1]" />
          </div>
        </div>
      </div>

      {/* Add-ons List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 px-1 mb-3">
            SELECT ADD-ONS (OPTIONAL)
          </h3>
        </div>

        <div className="space-y-3">
          {category.addons.map((addon, index) => {
            const isSelected = selectedAddonIds.includes(addon.id);

            return (
              <motion.button
                key={addon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onToggleAddon(addon.id)}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border ${
                  isSelected
                    ? 'border-[#408AF1] bg-[#408AF1]/5'
                    : 'border-gray-100'
                } flex items-center gap-4`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#408AF1] bg-[#408AF1]'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">{addon.name}</h4>
                </div>
                {addon.price !== undefined && (
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${addon.price}</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {category.addons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Add-ons Available</h3>
            <p className="text-gray-500">This service doesn't have any optional add-ons.</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-area-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            {selectedAddonIds.length} add-on{selectedAddonIds.length !== 1 ? 's' : ''} selected
          </span>
          {totalAddonsPrice > 0 && (
            <span className="text-lg font-semibold text-gray-900">
              +${totalAddonsPrice}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-[#408AF1] to-[#5ca3f5] text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}