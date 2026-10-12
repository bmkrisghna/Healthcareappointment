import {
  Stethoscope,
  PhoneCall,
  CheckCircle2,
  User,
  Clock,
  Activity,
  Users,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { SeverityBadge } from '@/components/Badges';

export function DoctorPortalPage() {
  const {
    user,
    doctors,
    callNext,
    markCompleted,
    getCurrentPatient,
    doctorWorkload,
    priorityQueue,
  } = useStore();

  const doctorId = user?.doctorId ?? 'doc-1';
  const currentPatient = getCurrentPatient(doctorId);
  const myDoctor = doctors.find((d) => d.id === doctorId);
  const workload = doctorWorkload(doctorId);

  const nextEmergency = priorityQueue.find(
    (p) => p.severity === 'Critical' || p.severity === 'Emergency'
  );
  const nextRoutine = priorityQueue.find(
    (p) => p.severity === 'Routine' || p.severity === 'Urgent'
  );
  const nextPatient = nextEmergency ?? nextRoutine;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Stethoscope className="text-teal-600" size={28} />
          Doctor Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome, {user?.name}. Manage your patient queue below.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Users size={16} />
            <span className="text-xs font-medium">In Queue</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {priorityQueue.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Activity size={16} />
            <span className="text-xs font-medium">Served Today</span>
          </div>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {workload}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Stethoscope size={16} />
            <span className="text-xs font-medium">Specialty</span>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
            {myDoctor?.specialty}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Current patient card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
            Current Patient
          </h2>

          {currentPatient ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center shrink-0">
                  <User size={24} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {currentPatient.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {currentPatient.age} years · {currentPatient.problemType}
                  </p>
                  <div className="mt-2">
                    <SeverityBadge severity={currentPatient.severity} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preferred Time</p>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {currentPatient.preferredTime}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Registered</p>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {new Date(currentPatient.registeredAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => markCompleted(doctorId)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <CheckCircle2 size={18} />
                Mark Completed
              </button>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-3">
                <Clock className="text-slate-400" size={28} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                No active patient. Call the next one from the queue.
              </p>
              <button
                onClick={() => callNext(doctorId)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 shadow-md"
              >
                <PhoneCall size={18} />
                Call Next Patient
              </button>
            </div>
          )}
        </div>

        {/* Next patient preview + call button */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Next Patient (Priority Order)
            </h2>

            {nextPatient ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <User size={16} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {nextPatient.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {nextPatient.age}y · {nextPatient.problemType}
                  </p>
                </div>
                <SeverityBadge severity={nextPatient.severity} />
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
                No patients waiting in queue.
              </p>
            )}

            <button
              onClick={() => callNext(doctorId)}
              disabled={!!currentPatient || !nextPatient}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <PhoneCall size={18} />
              Call Next Patient
            </button>
            {currentPatient && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
                Complete current patient before calling the next one.
              </p>
            )}
          </div>

          {/* Workload chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Daily Workload — All Doctors
            </h2>
            <div className="space-y-3">
              {doctors.map((doc) => {
                const count = doctorWorkload(doc.id);
                const maxCount = Math.max(...doctors.map((d) => doctorWorkload(d.id)), 1);
                const pct = (count / maxCount) * 100;
                const isMe = doc.id === doctorId;
                return (
                  <div key={doc.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-medium ${isMe ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {doc.name} {isMe && '(You)'}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{count}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMe ? 'bg-teal-500' : 'bg-sky-400 dark:bg-sky-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
