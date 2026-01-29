import { MapPin, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Town } from '@/domain/models';

interface TownChangeBottomSheetProps {
  isOpen: boolean;
  towns: Town[];
  currentTownId?: string;
  onClose: () => void;
  onSelectTown: (townId: string) => void;
}

export function TownChangeBottomSheet({
  isOpen,
  towns,
  currentTownId,
  onClose,
  onSelectTown,
}: TownChangeBottomSheetProps) {
  const enabledTowns = towns.filter(t => t.enabled);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Change Town</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Town List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-2">
                {enabledTowns.map((town) => {
                  const isCurrent = town.id === currentTownId;

                  return (
                    <button
                      key={town.id}
                      onClick={() => {
                        onSelectTown(town.id);
                        onClose();
                      }}
                      className={`w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border ${
                        isCurrent
                          ? 'border-[#5DD9C1] bg-[#5DD9C1]/5'
                          : 'border-gray-100'
                      } flex items-center gap-4`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isCurrent
                            ? 'bg-gradient-to-br from-[#5DD9C1] to-[#4BC4AC]'
                            : 'bg-gradient-to-br from-[#5DD9C1]/10 to-[#5DD9C1]/5'
                        }`}
                      >
                        <MapPin
                          className={`w-6 h-6 ${
                            isCurrent ? 'text-white' : 'text-[#5DD9C1]'
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900">
                          {town.name}
                          {isCurrent && (
                            <span className="ml-2 text-xs font-medium text-[#5DD9C1]">
                              (Current)
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{town.state}</p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 ${
                          isCurrent ? 'text-[#5DD9C1]' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {enabledTowns.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Towns Available
                  </h3>
                  <p className="text-gray-500">
                    We're not serving any towns yet. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
