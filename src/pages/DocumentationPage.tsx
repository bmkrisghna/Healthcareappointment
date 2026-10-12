import { BookOpen, Link2, Network, Circle, Clock, Code2 } from 'lucide-react';

const STRUCTURES = [
  {
    name: 'Linked-List FIFO Queue',
    icon: Link2,
    feature: 'Normal patient registration queue',
    file: 'src/dataStructures/LinkedListQueue.ts',
    description:
      'Patients are registered in arrival order using a singly linked list with head and tail pointers. The first patient registered is the first one served (First-In-First-Out).',
    operations: [
      { op: 'enqueue (add patient)', complexity: 'O(1)', note: 'Append to tail pointer' },
      { op: 'dequeue (serve patient)', complexity: 'O(1)', note: 'Remove from head pointer' },
      { op: 'peek (view next)', complexity: 'O(1)', note: 'Read head node value' },
      { op: 'remove (cancel patient)', complexity: 'O(n)', note: 'Traverse to find and unlink' },
      { op: 'size', complexity: 'O(1)', note: 'Maintained as counter' },
    ],
  },
  {
    name: 'Binary Max-Heap Priority Queue',
    icon: Network,
    feature: 'Emergency and severity-based triage',
    file: 'src/dataStructures/MaxHeap.ts',
    description:
      'Patients are stored in an array-based binary heap ordered by severity weight (Critical=4, Emergency=3, Urgent=2, Routine=1). The highest-severity patient is always extracted first, ensuring emergencies jump ahead of routine cases.',
    operations: [
      { op: 'insert (add to heap)', complexity: 'O(log n)', note: 'Sift up to restore heap property' },
      { op: 'extractMax (serve next)', complexity: 'O(log n)', note: 'Sift down after swap with last' },
      { op: 'peekMax (view next)', complexity: 'O(1)', note: 'Read root element' },
      { op: 'toArray (sorted snapshot)', complexity: 'O(n log n)', note: 'Sort by priority for display' },
      { op: 'size', complexity: 'O(1)', note: 'Array length' },
    ],
  },
  {
    name: 'Circular Queue (Ring Buffer)',
    icon: Circle,
    feature: 'Doctor slot allocation in round-robin',
    file: 'src/dataStructures/CircularQueue.ts',
    description:
      'A fixed-size ring buffer holds doctor IDs. The front and rear pointers wrap around using modulo arithmetic, cycling through doctors evenly. Each allocation dequeues the next doctor, assigns a patient, then re-enqueues the doctor for the next round — ensuring balanced workload.',
    operations: [
      { op: 'enqueue (add to ring)', complexity: 'O(1)', note: 'Wrap rear = (rear+1) % capacity' },
      { op: 'dequeue (next doctor)', complexity: 'O(1)', note: 'Wrap front = (front+1) % capacity' },
      { op: 'peek (current doctor)', complexity: 'O(1)', note: 'Read front slot' },
      { op: 'isFull / isEmpty', complexity: 'O(1)', note: 'Compare size to capacity' },
      { op: 'getSlot (view slot)', complexity: 'O(1)', note: 'Direct array index' },
    ],
  },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/login', description: 'Authenticate user, return JWT token' },
  { method: 'POST', path: '/patients', description: 'Register a new patient into queues' },
  { method: 'GET', path: '/queue', description: 'Get FIFO queue state' },
  { method: 'GET', path: '/priority-queue', description: 'Get priority queue (sorted by severity)' },
  { method: 'POST', path: '/next', description: 'Call next patient (highest priority first)' },
  { method: 'POST', path: '/allocate-slot', description: 'Assign patient to next doctor (round-robin)' },
  { method: 'GET', path: '/doctors', description: 'List all doctors and their slot status' },
  { method: 'GET', path: '/analytics', description: 'Get performance metrics and analytics' },
  { method: 'POST', path: '/simulate', description: 'Bulk-load random patients, return timings' },
];

export function DocumentationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="text-teal-600" size={28} />
          Documentation & Viva Notes
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Data structure mapping, time complexities, and API reference for your presentation.
        </p>
      </div>

      {/* Data structures */}
      <div className="space-y-5">
        {STRUCTURES.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-teal-100 dark:bg-teal-900 p-2.5 rounded-lg shrink-0">
                  <Icon size={20} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                    {s.name}
                  </h2>
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                    Powers: {s.feature}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {s.description}
              </p>

              <div className="flex items-center gap-2 mb-2">
                <Code2 size={14} className="text-slate-400" />
                <code className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded">
                  {s.file}
                </code>
              </div>

              {/* Complexity table */}
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 pr-4 font-medium text-slate-600 dark:text-slate-300">Operation</th>
                      <th className="text-left py-2 pr-4 font-medium text-slate-600 dark:text-slate-300">Time Complexity</th>
                      <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-300">How</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {s.operations.map((op) => (
                      <tr key={op.op}>
                        <td className="py-2 pr-4 text-slate-700 dark:text-slate-200 font-mono text-xs">
                          {op.op}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="inline-block px-2 py-0.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded text-xs font-mono font-medium">
                            {op.complexity}
                          </span>
                        </td>
                        <td className="py-2 text-slate-500 dark:text-slate-400 text-xs">{op.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature mapping summary */}
      <div className="bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
          <Clock size={16} className="text-teal-600" />
          Feature → Data Structure Quick Reference
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Patient Registration</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">FIFO Linked Queue</p>
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">O(1) enqueue</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Emergency Triage</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Max-Heap Priority Queue</p>
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">O(log n) extract max</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Doctor Slot Assignment</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Circular Queue</p>
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">O(1) round-robin</p>
          </div>
        </div>
      </div>

      {/* API endpoints */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
          REST API Endpoints
        </h2>
        <div className="space-y-2">
          {API_ENDPOINTS.map((ep) => (
            <div
              key={ep.path}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
            >
              <span
                className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                  ep.method === 'GET'
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300'
                    : 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                }`}
              >
                {ep.method}
              </span>
              <code className="text-sm font-mono text-slate-700 dark:text-slate-200 shrink-0">
                {ep.path}
              </code>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">
                {ep.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture note */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-3">
          Architecture Overview
        </h2>
        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>Frontend:</strong> React + Vite + Tailwind CSS — single-page application with
            role-based views for Admin/Receptionist and Doctor roles.
          </p>
          <p>
            <strong>Backend (reference):</strong> Python FastAPI with SQLite — see the{' '}
            <code className="text-xs bg-slate-50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              backend/
            </code>{' '}
            folder for the REST API reference implementation. All queue logic is implemented from
            scratch (no built-in queue libraries).
          </p>
          <p>
            <strong>Frontend-only mode:</strong> The app runs fully in the browser using in-memory
            React state and custom TypeScript data structures. Seed data includes 3 doctors and 20
            sample patients loaded automatically on startup.
          </p>
        </div>
      </div>
    </div>
  );
}
