import { useState } from 'react';
import { HeartPulse, Lock, Mail, Stethoscope, UserCog } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export function LoginPage() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    const ok = login(email, password);
    if (!ok) {
      setError('Invalid credentials. Try one of the demo accounts below.');
    }
  };

  const quickLogin = (em: string) => {
    setEmail(em);
    setPassword('demo123');
    setError('');
    login(em, 'demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-teal-600 p-3 rounded-2xl mb-3 shadow-lg">
            <HeartPulse className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            MediQueue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Healthcare Appointment Scheduling System
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
                  placeholder="admin@health.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
                  placeholder="demo123"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md"
            >
              Sign In
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 text-center">
              Quick demo login (password: demo123)
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => quickLogin('admin@health.com')}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
              >
                <UserCog size={16} className="text-teal-600" />
                Admin / Receptionist
              </button>
              <button
                onClick={() => quickLogin('doctor@health.com')}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
              >
                <Stethoscope size={16} className="text-teal-600" />
                Dr. Sarah Chen
              </button>
              <button
                onClick={() => quickLogin('doctor2@health.com')}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
              >
                <Stethoscope size={16} className="text-teal-600" />
                Dr. James Patel
              </button>
              <button
                onClick={() => quickLogin('doctor3@health.com')}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
              >
                <Stethoscope size={16} className="text-teal-600" />
                Dr. Maria Gomez
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
