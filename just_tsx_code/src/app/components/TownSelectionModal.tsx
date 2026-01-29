import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Search } from 'lucide-react';
import { AppService } from '@/services/AppService';
import type { Town } from '@/domain/models';

interface TownSelectionModalProps {
  isOpen: boolean;
  onSelectTown: (town: Town) => void;
  canClose?: boolean;
}

export function TownSelectionModal({ isOpen, onSelectTown, canClose = false }: TownSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTownId, setSelectedTownId] = useState<string | null>(null);
  const [towns, setTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(true);

  const appService = AppService.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadTowns();
    }
  }, [isOpen]);

  const loadTowns = async () => {
    setLoading(true);
    const fetchedTowns = await appService.getTowns();
    setTowns(fetchedTowns);
    setLoading(false);
  };

  const filteredTowns = towns.filter(town =>
    town.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    town.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    const town = towns.find(t => t.id === selectedTownId);
    if (town) {
      onSelectTown(town);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#2384F4] rounded-3xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] flex flex-col"
          >
            {canClose && (
              <button
                onClick={() => onSelectTown(towns[0])}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#2384F4]" />
              </div>
              <h2 className="text-2xl mb-2 text-white">Select Your Town</h2>
              <p className="text-white/80">Choose your location to see available services</p>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search towns..."
                className="w-full pl-12 pr-4 py-3 bg-white text-black placeholder:text-gray-400 rounded-2xl outline-none focus:ring-2 focus:ring-white/30 border-2 border-white/20"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-6">
              {filteredTowns.map((town, index) => (
                <motion.button
                  key={town.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTownId(town.id)}
                  className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between group border-2 ${
                    selectedTownId === town.id
                      ? 'bg-white border-white'
                      : 'bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                      selectedTownId === town.id ? 'bg-[#2384F4]' : 'bg-white/20'
                    }`}>
                      <MapPin className={`w-5 h-5 ${selectedTownId === town.id ? 'text-white' : 'text-white'}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${selectedTownId === town.id ? 'text-[#2384F4]' : 'text-white'}`}>{town.name}</p>
                      <p className={`text-sm ${selectedTownId === town.id ? 'text-[#2384F4]/70' : 'text-white/80'}`}>{town.state}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedTownId === town.id ? 'border-[#2384F4] bg-[#2384F4]' : 'border-white/50'
                  }`}>
                    {selectedTownId === town.id && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedTownId}
              className="w-full bg-white text-[#2384F4] py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-white/95 transition-all"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}