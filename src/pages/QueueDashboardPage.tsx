import {
  LayoutDashboard,
  ArrowRight,
  User,
  Clock,
  Hash,
  CircleDot,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { SeverityBadge } from '@/components/Badges';
import type { Patient } from '@/types';

function PatientCard({ patient, index }: { patient: Patient; index: number }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 animate-slide-right"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center shrink-0">
        <User size={16} className="text-teal-600 dark:text-teal-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
          {patient.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {patient.age}y · {patient.problemType}
        </p>
      </div>
      <SeverityBadge severity={patient.severity} />
    </div>
  );
}

export function QueueDashboardPage() {
  const { fifoQueue, priorityQueue, slots } = useStore();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <LayoutDashboard className="text-teal-600" size={28} />
          Live Queue Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time view of all three queue structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* FIFO Queue */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-sky-50 dark:bg-sky-950/30">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Hash size={18} className="text-sky-500" />
              FIFO Queue
              <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">
                {fifoQueue.length} patients
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Linked-list · First-In-First-Out
            </p>
          </div>
          <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
            {fifoQueue.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">
                Queue is empty
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-medium px-2 pb-1">
                  <span>HEAD</span>
                  <ArrowRight size={12} />
                  <span className="ml-auto">TAIL</span>
                </div>
                {fifoQueue.slice(0, 50).map((p, i) => (
                  <PatientCard key={p.id} patient={p} index={i} />
                ))}
                {fifoQueue.length > 50 && (
                  <p className="text-center text-xs text-slate-400 py-2">
                    +{fifoQueue.length - 50} more...
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Priority Queue */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-teal-50 dark:bg-teal-950/30">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Clock size={18} className="text-teal-500" />
              Priority Queue
              <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">
                {priorityQueue.length} patients
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Max-Heap · Auto-sorted by severity
            </p>
          </div>
          <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
            {priorityQueue.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">
                Queue is empty
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-medium px-2 pb-1">
                  <span>HIGHEST PRIORITY</span>
                  <ArrowRight size={12} className="ml-auto rotate-180" />
                </div>
                {priorityQueue.slice(0, 50).map((p, i) => (
                  <div
                    key={p.id}
                    className={`rounded-lg border transition-all animate-slide-right ${
                      p.severity === 'Critical'
                        ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30'
                        : p.severity === 'Emergency'
                          ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30'
                          : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                    }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <PatientCard patient={p} index={i} />
                  </div>
                ))}
                {priorityQueue.length > 50 && (
                  <p className="text-center text-xs text-slate-400 py-2">
                    +{priorityQueue.length - 50} more...
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Doctor Slot Ring */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-violet-50 dark:bg-violet-950/30">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <CircleDot size={18} className="text-violet-500" />
              Doctor Slot Ring
              <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">
                {slots.filter((s) => s.status === 'booked').length} booked
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Circular Queue · Round-robin allocation
            </p>
          </div>
          <div className="p-5">
            {/* Ring visualization */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto mb-5">
              {slots.map((slot, i) => {
                const angle = (i / slots.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 42;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <div
                    key={slot.doctorId}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-center border-2 transition-all ${
                        slot.status === 'booked'
                          ? 'bg-teal-500 border-teal-600 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-medium leading-tight">
                        {slot.doctorName.split(' ')[0]}
                      </span>
                      <span className="text-[9px] leading-tight">
                        {slot.status === 'booked' ? slot.patientName?.split(' ')[0] : 'Free'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {slots.filter((s) => s.status === 'booked').length}
                  </p>
                  <p className="text-[10px] text-slate-400">Booked</p>
                </div>
              </div>
              {/* Connecting circle */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-slate-200 dark:text-slate-600"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>

            {/* Slot list */}
            <div className="space-y-2">
              {slots.map((slot) => (
                <div
                  key={slot.doctorId}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      slot.status === 'booked' ? 'bg-teal-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                      {slot.doctorName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {slot.status === 'booked' ? slot.patientName : 'Available'}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      slot.status === 'booked'
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
