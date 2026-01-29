import { MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Town } from '@/domain/models';

interface TownSelectionGateProps {
  towns: Town[];
  onTownSelect: (townId: string) => void;
}

export function TownSelectionGate({ towns, onTownSelect }: TownSelectionGateProps) {
  const enabledTowns = towns.filter(t => t.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#408AF1]/5 via-white to-[#408AF1]/10 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-20 h-20 bg-gradient-to-br from-[#408AF1] to-[#5ca3f5] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <MapPin className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          Welcome to Renizo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg"
        >
          Select your town to get started
        </motion.p>
      </div>

      {/* Town List */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-lg mx-auto space-y-3">
          {enabledTowns.map((town, index) => (
            <motion.button
              key={town.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => onTownSelect(town.id)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-4 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#408AF1]/10 to-[#408AF1]/5 rounded-xl flex items-center justify-center group-hover:from-[#408AF1]/20 group-hover:to-[#408AF1]/10 transition-colors">
                <MapPin className="w-7 h-7 text-[#408AF1]" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg text-gray-900">{town.name}</h3>
                <p className="text-sm text-gray-500">{town.state}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#408AF1] transition-colors" />
            </motion.button>
          ))}

          {enabledTowns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Towns Available</h3>
              <p className="text-gray-500">
                We're not serving any towns yet. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 text-center">
        <p className="text-sm text-gray-400">
          Local services made professional
        </p>
      </div>
    </div>
  );
}