import { X, ShieldCheck, CheckCircle } from 'lucide-react';

interface WarrantyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WarrantyInfoModal({ isOpen, onClose }: WarrantyInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">30-Day Renizo Warranty</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-sm text-emerald-900">
              All services booked and paid within the Renizo platform include a <strong>30-day workmanship warranty</strong> at no additional cost.
            </p>
          </div>

          {/* What's Covered */}
          <div>
            <h3 className="font-semibold mb-3">What's Covered</h3>
            <div className="space-y-2">
              {[
                'Defects in workmanship or service quality',
                'Issues directly related to the completed service',
                'Follow-up repairs for warranty-valid issues',
                'Re-service at no additional charge for covered issues',
              ].map((item, index) => (
                <div key={index} className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Not Covered */}
          <div>
            <h3 className="font-semibold mb-3">What's Not Covered</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Normal wear and tear or deterioration</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Damage caused by misuse or external factors</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Services not booked through Renizo</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Issues reported after 30 days from service completion</span>
              </li>
            </ul>
          </div>

          {/* How to File a Claim */}
          <div>
            <h3 className="font-semibold mb-3">How to File a Warranty Claim</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span><strong>Contact the provider</strong> through the in-app chat within 30 days of service completion</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span><strong>Describe the issue</strong> with photos if possible</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span><strong>Work with the provider</strong> to schedule a follow-up visit</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                <span><strong>If unresolved,</strong> contact Renizo support for assistance</span>
              </li>
            </ol>
          </div>

          {/* Important Notes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Important Notes</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• Warranty is only valid for services paid through Renizo</li>
              <li>• Provider must be given opportunity to resolve the issue</li>
              <li>• Warranty claim must be filed within 30 days of service completion</li>
              <li>• Keep all booking records and in-app communication as documentation</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
