import type { Severity } from '@/types';
import { SEVERITY_COLORS } from '@/dataStructures/severity';

export function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = SEVERITY_COLORS[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}
    >
      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
      {severity}
    </span>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: 'free' | 'booked' | 'active' | 'completed' | 'waiting';
  label?: string;
}) {
  const colors: Record<string, string> = {
    free: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    booked: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    waiting: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'free'
            ? 'bg-slate-400'
            : status === 'booked'
              ? 'bg-teal-500'
              : status === 'active'
                ? 'bg-blue-500'
                : status === 'completed'
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
        }`}
      />
      {label ?? status}
    </span>
  );
}
