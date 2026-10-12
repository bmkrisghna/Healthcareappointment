import { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { PROBLEM_TYPE_OPTIONS } from '@/data/seed';
import type { Severity } from '@/types';

const SEVERITIES: Severity[] = ['Routine', 'Urgent', 'Emergency', 'Critical'];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30',
];

export function PatientEntryPage() {
  const { addPatient, totalRegistered, maxCapacity } = useStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [problemType, setProblemType] = useState(PROBLEM_TYPE_OPTIONS[0]);
  const [severity, setSeverity] = useState<Severity>('Routine');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) {
      setResult({ ok: false, message: 'Age must be a valid number.' });
      return;
    }
    const res = addPatient(name, ageNum, problemType, severity, preferredTime);
    setResult(res);
    if (res.ok) {
      setName('');
      setAge('');
      setProblemType(PROBLEM_TYPE_OPTIONS[0]);
      setSeverity('Routine');
      setPreferredTime(TIME_SLOTS[0]);
    }
  };

  const capacityPct = Math.min((totalRegistered / maxCapacity) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <UserPlus className="text-teal-600" size={28} />
          Patient Entry Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Register a new patient into the queueing system.
        </p>
      </div>

      {/* Capacity bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Users size={16} className="text-teal-600" />
            System Capacity
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {totalRegistered} / {maxCapacity}
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              capacityPct > 90 ? 'bg-red-500' : 'bg-teal-500'
            }`}
            style={{ width: `${capacityPct}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Age + Problem Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              id="age"
              type="number"
              min={0}
              max={130}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
              placeholder="35"
              required
            />
          </div>
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Problem Type
            </label>
            <select
              id="problem"
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
            >
              {PROBLEM_TYPE_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Severity Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SEVERITIES.map((s) => {
              const active = severity === s;
              const colorMap: Record<Severity, string> = {
                Routine: active ? 'bg-sky-500 text-white border-sky-500' : 'border-sky-200 text-sky-700 dark:text-sky-300 dark:border-sky-800',
                Urgent: active ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-200 text-amber-700 dark:text-amber-300 dark:border-amber-800',
                Emergency: active ? 'bg-orange-500 text-white border-orange-500' : 'border-orange-200 text-orange-700 dark:text-orange-300 dark:border-orange-800',
                Critical: active ? 'bg-red-500 text-white border-red-500' : 'border-red-200 text-red-700 dark:text-red-300 dark:border-red-800',
              };
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`px-3 py-2.5 text-sm font-medium border-2 rounded-lg transition-all ${colorMap[s]}`}
                  aria-pressed={active}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Preferred Appointment Time
          </label>
          <select
            id="time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Result message */}
        {result && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              result.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
            }`}
            role="alert"
          >
            {result.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {result.message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          Register Patient
        </button>
      </form>
    </div>
  );
}
