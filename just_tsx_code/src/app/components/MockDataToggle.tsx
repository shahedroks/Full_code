import { motion } from 'motion/react';
import { Check, X, TestTube } from 'lucide-react';
import { AppService } from '@/services/AppService';

interface MockDataToggleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MockDataToggle({ isOpen, onClose }: MockDataToggleProps) {
  const appService = AppService.getInstance();
  const toggles = appService.getMockToggles();

  if (!isOpen) return null;

  const handleToggle = (key: keyof typeof toggles) => {
    appService.setMockToggle(key, !toggles[key]);
    // Force re-render by closing and reopening
    onClose();
    setTimeout(() => window.location.reload(), 100);
  };

  const handleReset = () => {
    appService.resetMockToggles();
    appService.resetData();
    onClose();
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white rounded-t-3xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-[#408AF1]" />
            <h3 className="font-medium">Mock Data Toggles</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Test edge cases by toggling mock data scenarios
        </p>

        <div className="space-y-3">
          <ToggleButton
            label="Disable All Towns"
            description="All towns will show as disabled"
            enabled={toggles.disableAllTowns}
            onToggle={() => handleToggle('disableAllTowns')}
          />

          <ToggleButton
            label="No Sellers Available"
            description="No providers will be returned"
            enabled={toggles.noSellersAvailable}
            onToggle={() => handleToggle('noSellersAvailable')}
          />

          <ToggleButton
            label="Payment Always Fails"
            description="All payment attempts will fail"
            enabled={toggles.paymentAlwaysFails}
            onToggle={() => handleToggle('paymentAlwaysFails')}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
          >
            Reset All & Reload
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleButton({ label, description, enabled, onToggle }: ToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full bg-gray-50 rounded-2xl p-4 text-left hover:bg-gray-100 transition-colors border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <div
          className={`relative w-12 h-6 rounded-full flex-shrink-0 ml-3 transition-colors ${
            enabled ? 'bg-[#408AF1]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-[26px]' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>
    </button>
  );
}