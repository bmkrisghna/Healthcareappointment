import { useState, useRef, useEffect } from 'react';
import {
  HeartPulse,
  UserPlus,
  LayoutDashboard,
  Stethoscope,
  CalendarClock,
  BarChart3,
  FlaskConical,
  BookOpen,
  LogOut,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export type Page =
  | 'login'
  | 'patient-entry'
  | 'queue-dashboard'
  | 'doctor-portal'
  | 'slot-allocation'
  | 'analytics'
  | 'simulation'
  | 'documentation';

interface NavItem {
  id: Page;
  label: string;
  icon: typeof HeartPulse;
  roles: ('admin' | 'doctor')[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'patient-entry', label: 'Patient Entry', icon: UserPlus, roles: ['admin'] },
  { id: 'queue-dashboard', label: 'Queue Dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor'] },
  { id: 'doctor-portal', label: 'Doctor Portal', icon: Stethoscope, roles: ['doctor'] },
  { id: 'slot-allocation', label: 'Slot Allocation', icon: CalendarClock, roles: ['admin'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'doctor'] },
  { id: 'simulation', label: 'Simulation', icon: FlaskConical, roles: ['admin'] },
  { id: 'documentation', label: 'Documentation', icon: BookOpen, roles: ['admin', 'doctor'] },
];

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: Props) {
  const { user, logout, darkMode, toggleDarkMode } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-teal-600 text-white p-2 rounded-lg shadow-md"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <HeartPulse size={20} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="bg-teal-600 p-2 rounded-lg">
            <HeartPulse className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
              MediQueue
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Appointment System</p>
          </div>
        </div>

        {/* User badge */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center">
              <span className="text-teal-700 dark:text-teal-200 font-semibold text-sm">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-l-4 border-teal-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} className={active ? 'text-teal-600 dark:text-teal-400' : ''} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
