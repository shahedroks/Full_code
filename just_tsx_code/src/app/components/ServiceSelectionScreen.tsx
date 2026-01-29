import { ArrowLeft, ChevronRight, Circle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { ServiceCategory, ServiceSubSection } from '@/domain/models';
import * as Icons from 'lucide-react';

interface ServiceSelectionScreenProps {
  category: ServiceCategory;
  onBack: () => void;
  onSubSectionSelect: (subSectionId: string) => void;
  selectedSubSectionId?: string;
}

export function ServiceSelectionScreen({
  category,
  onBack,
  onSubSectionSelect,
  selectedSubSectionId,
}: ServiceSelectionScreenProps) {
  const IconComponent = (Icons as any)[category.icon] || Icons.Sparkles;

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
            <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#408AF1]/10 to-[#408AF1]/5 rounded-2xl flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-[#408AF1]" />
          </div>
        </div>
      </div>

      {/* Sub-sections List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 px-1 mb-3">
            SELECT SERVICE TYPE
          </h3>
        </div>

        <div className="space-y-3">
          {category.subSections.map((subSection, index) => {
            const isSelected = selectedSubSectionId === subSection.id;

            return (
              <motion.button
                key={subSection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSubSectionSelect(subSection.id)}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border ${
                  isSelected
                    ? 'border-[#408AF1] bg-[#408AF1]/5'
                    : 'border-gray-100'
                } flex items-center gap-4`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#408AF1] bg-[#408AF1]'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">{subSection.name}</h4>
                  {subSection.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{subSection.description}</p>
                  )}
                </div>
                <ChevronRight className={`w-5 h-5 transition-colors ${
                  isSelected ? 'text-[#408AF1]' : 'text-gray-400'
                }`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}