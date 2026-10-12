import { CalendarClock, Play, RefreshCw, User } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { SeverityBadge } from '@/components/Badges';

export function SlotAllocationPage() {
  const { slots, doctors, allocateSlots, priorityQueue } = useStore();

  const bookedCount = slots.filter((s) => s.status === 'booked').length;
  const freeCount = slots.length - bookedCount;
  const maxWorkload = Math.max(...doctors.map((d) => d.patientsServed), 1);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarClock className="text-teal-600" size={28} />
          Slot Allocation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Round-robin assignment using the circular queue distributes patients evenly across doctors.
        </p>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={allocateSlots}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-md"
        >
          <Play size={18} />
          Allocate Next Patient Batch
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            In Queue: <span className="font-semibold text-slate-700 dark:text-slate-200">{priorityQueue.length}</span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Booked: <span className="font-semibold text-teal-600 dark:text-teal-400">{bookedCount}</span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Free: <span className="font-semibold text-slate-700 dark:text-slate-200">{freeCount}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Doctor slots grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
            <RefreshCw size={16} className="text-teal-500" />
            Doctor Slots
          </h2>

          <div className="space-y-4">
            {doctors.map((doc) => {
              const slot = slots.find((s) => s.doctorId === doc.id);
              const isBooked = slot?.status === 'booked';
              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isBooked
                      ? 'border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/30'
                      : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {doc.specialty} · {doc.slotCount} slots/day
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isBooked
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {slot?.status}
                    </span>
                  </div>

                  {isBooked && slot?.patientName && (
                    <div className="flex items-center gap-2 pt-2 border-t border-teal-200 dark:border-teal-800">
                      <User size={14} className="text-teal-600 dark:text-teal-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        {slot.patientName}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Workload balance chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
            Workload Balance
          </h2>

          {/* Bar chart */}
          <div className="flex items-end justify-around gap-4 h-48 mb-4 pt-4">
            {doctors.map((doc) => {
              const count = doc.patientsServed;
              const height = (count / maxWorkload) * 100;
              return (
                <div key={doc.id} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {count}
                  </span>
                  <div className="w-full max-w-[60px] flex items-end h-32">
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-700 shadow-md"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">
                    {doc.name.replace('Dr. ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Balance indicator */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-300">Balance Status</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {(() => {
                  const counts = doctors.map((d) => d.patientsServed);
                  const diff = Math.max(...counts) - Math.min(...counts);
                  if (diff <= 1) return 'Well Balanced';
                  if (diff <= 3) return 'Moderate';
                  return 'Imbalanced';
                })()}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Round-robin allocation ensures equitable patient distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Next in queue preview */}
      {priorityQueue.length > 0 && (
        <div className="mt-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
            Next Patients to Allocate ({Math.min(priorityQueue.length, 5)} of {priorityQueue.length})
          </h2>
          <div className="space-y-2">
            {priorityQueue.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 animate-slide-right"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-xs font-bold text-slate-400 w-6">#{i + 1}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">
                  {p.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{p.problemType}</span>
                <SeverityBadge severity={p.severity} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
