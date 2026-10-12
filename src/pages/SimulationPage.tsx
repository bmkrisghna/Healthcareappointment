import { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, AlertCircle, Zap, Clock, Users } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import type { TimingResult } from '@/types';

export function SimulationPage() {
  const { simulate, totalRegistered, maxCapacity } = useStore();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TimingResult | null>(null);
  const [count, setCount] = useState(500);

  const runSimulation = () => {
    setRunning(true);
    setTimeout(() => {
      const res = simulate(count);
      setResult(res);
      setRunning(false);
    }, 300);
  };

  const emergencyPass = result ? result.emergencyResponseMs < 1000 : false;
  const allocationPass = result ? result.allocationMs < 2000 : false;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FlaskConical className="text-teal-600" size={28} />
          Simulation Lab
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Stress-test the system with bulk patient data and measure performance.
        </p>
      </div>

      {/* Control panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="count" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Number of Patients
            </label>
            <select
              id="count"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
            >
              <option value={50}>50 patients</option>
              <option value={100}>100 patients</option>
              <option value={250}>250 patients</option>
              <option value={500}>500 patients (full capacity)</option>
            </select>
          </div>
          <button
            onClick={runSimulation}
            disabled={running}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md whitespace-nowrap"
          >
            {running ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play size={18} />
                Simulate {count} Patients
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Current system load: {totalRegistered} / {maxCapacity} patients
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Summary card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Simulation Results
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <Users size={20} className="text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {result.totalPatients}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Patients Loaded</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <Zap size={20} className="text-orange-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {result.emergencyResponseMs}ms
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Emergency Response</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <Clock size={20} className="text-sky-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {result.allocationMs}ms
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Allocation Time</p>
              </div>
            </div>
          </div>

          {/* Pass/fail checks */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Performance Checks
            </h2>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  emergencyPass
                    ? 'bg-emerald-50 dark:bg-emerald-950/40'
                    : 'bg-red-50 dark:bg-red-950/40'
                }`}
              >
                {emergencyPass ? (
                  <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
                  Emergency response &lt; 1,000ms
                </span>
                <span
                  className={`text-sm font-medium ${
                    emergencyPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {result.emergencyResponseMs}ms — {emergencyPass ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  allocationPass
                    ? 'bg-emerald-50 dark:bg-emerald-950/40'
                    : 'bg-red-50 dark:bg-red-950/40'
                }`}
              >
                {allocationPass ? (
                  <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
                  Slot allocation &lt; 2,000ms
                </span>
                <span
                  className={`text-sm font-medium ${
                    allocationPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {result.allocationMs}ms — {allocationPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Timing Breakdown
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Emergency Response</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {result.emergencyResponseMs}ms / 1000ms
                  </span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      emergencyPass ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((result.emergencyResponseMs / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Allocation Speed</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {result.allocationMs}ms / 2000ms
                  </span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      allocationPass ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((result.allocationMs / 2000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
