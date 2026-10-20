import React from 'react';
import { HealthStatusLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface HealthBadgeProps {
  status: HealthStatusLevel;
  label?: string;
  className?: string;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ status, label, className = '' }) => {
  if (status === 'high_warning') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 ${className}`}>
        <AlertOctagon className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
        <span>{label || 'Cảnh báo cao'}</span>
      </span>
    );
  }

  if (status === 'caution') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>{label || 'Mức lưu ý'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      <span>{label || 'Tiến bộ tốt'}</span>
    </span>
  );
};
