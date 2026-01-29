import { ShieldCheck } from 'lucide-react';

interface WarrantyBadgeProps {
  variant?: 'default' | 'compact';
  showIcon?: boolean;
}

export function WarrantyBadge({ variant = 'default', showIcon = true }: WarrantyBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
        {showIcon && <ShieldCheck className="w-3 h-3" />}
        <span>30-Day Warranty</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
      {showIcon && <ShieldCheck className="w-4 h-4" />}
      <span className="text-sm font-medium">30-Day Workmanship Warranty</span>
    </div>
  );
}
