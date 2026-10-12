import { BarChart3, Clock, Users, Zap, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

function MiniBarChart({
  data,
}: {
  data: { label: string; fifo: number; priority: number }[];
}) {
  const maxVal = Math.max(...data.flatMap((d) => [d.fifo, d.priority]), 1);

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">{d.label}</span>
            <span className="text-slate-400">
              FIFO {d.fifo}s · Priority {d.priority}s
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
              <div
                className="h-full bg-sky-400 dark:bg-sky-500 rounded transition-all duration-500"
                style={{ width: `${(d.fifo / maxVal) * 100}%` }}
              />
            </div>
            <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded transition-all duration-500"
                style={{ width: `${(d.priority / maxVal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-sky-400 dark:bg-sky-500 rounded" />
          <span className="text-slate-600 dark:text-slate-300">FIFO Queue</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-teal-500 rounded" />
          <span className="text-slate-600 dark:text-slate-300">Priority Queue</span>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { analytics } = useStore();

  const stats = [
    {
      label: 'Avg Waiting Time',
      value: `${analytics.averageWaitingTime}s`,
      icon: Clock,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
    },
    {
      label: 'Patients Served',
      value: `${analytics.patientsServed}`,
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
    },
    {
      label: 'Emergency Response',
      value: `${analytics.emergencyResponseTime}ms`,
      icon: Zap,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-teal-600" size={28} />
          Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Performance metrics and queue comparison analytics.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border border-slate-200 dark:border-slate-700 p-5 ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <Icon size={18} className={stat.color} />
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FIFO vs Priority comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-teal-500" />
            FIFO vs Priority Queue — Response Time
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Seconds per patient batch (lower is better)
          </p>
          <MiniBarChart data={analytics.fifoVsPriority} />
        </div>

        {/* Per-doctor workload */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1 flex items-center gap-2">
            <Users size={16} className="text-teal-500" />
            Patients Served Per Doctor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Balanced by circular queue round-robin
          </p>

          <div className="flex items-end justify-around gap-4 h-40 mb-4">
            {analytics.perDoctorWorkload.map((doc) => {
              const maxCount = Math.max(...analytics.perDoctorWorkload.map((d) => d.patients), 1);
              const height = (doc.patients / maxCount) * 100;
              return (
                <div key={doc.doctorId} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {doc.patients}
                  </span>
                  <div className="w-full max-w-[60px] flex items-end h-28">
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-700"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">
                    {doc.doctorName.replace('Dr. ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {analytics.perDoctorWorkload.map((doc) => (
              <div key={doc.doctorId} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{doc.doctorName}</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">
                  {doc.patients} patients
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="mt-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
          Performance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-medium text-slate-600 dark:text-slate-300">Metric</th>
                <th className="text-left py-2 pr-4 font-medium text-slate-600 dark:text-slate-300">Value</th>
                <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-300">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <tr>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">Emergency Response Time</td>
                <td className="py-2.5 pr-4 font-medium text-teal-600 dark:text-teal-400">
                  {analytics.emergencyResponseTime}ms
                </td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">&lt; 1000ms</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">Patients Served</td>
                <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">
                  {analytics.patientsServed}
                </td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">Average Waiting Time</td>
                <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">
                  {analytics.averageWaitingTime}s
                </td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">Minimize</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">Queue Balance</td>
                <td className="py-2.5 pr-4 font-medium text-emerald-600 dark:text-emerald-400">
                  Round-Robin
                </td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">Balanced</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
