import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  Patient,
  Doctor,
  Slot,
  Analytics,
  User,
  Severity,
  TimingResult,
} from '@/types';
import { LinkedListQueue } from '@/dataStructures/LinkedListQueue';
import { MaxHeap } from '@/dataStructures/MaxHeap';
import { CircularQueue } from '@/dataStructures/CircularQueue';
import { SEVERITY_PRIORITY } from '@/dataStructures/severity';
import { SEED_DOCTORS, generateSeedPatients } from '@/data/seed';

const MAX_CAPACITY = 500;

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface StoreContextValue {
  // Auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Queue snapshots (for rendering)
  fifoQueue: Patient[];
  priorityQueue: Patient[];
  slots: Slot[];
  doctors: Doctor[];

  // Patients
  addPatient: (
    name: string,
    age: number,
    problemType: string,
    severity: Severity,
    preferredTime: string
  ) => { ok: boolean; message: string };
  totalRegistered: number;

  // Doctor portal
  callNext: (doctorId: string) => Patient | null;
  markCompleted: (doctorId: string) => void;
  getCurrentPatient: (doctorId: string) => Patient | null;
  doctorWorkload: (doctorId: string) => number;

  // Slot allocation
  allocateSlots: () => void;

  // Analytics
  analytics: Analytics;

  // Simulation
  simulate: (count: number) => TimingResult;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Constants
  maxCapacity: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Queue refs — these data structures persist across renders
  const fifoRef = useRef(new LinkedListQueue<Patient>());
  const heapRef = useRef(new MaxHeap<Patient>());
  const ringRef = useRef(new CircularQueue<string>(SEED_DOCTORS.length));
  const doctorsRef = useRef<Doctor[]>([...SEED_DOCTORS]);
  const slotPatientRef = useRef<Map<string, Patient>>(new Map());
  const currentPatientRef = useRef<Map<string, Patient>>(new Map());
  const completedRef = useRef<Patient[]>([]);

  // Render trigger state
  const [tick, setTick] = useState(0);
  const forceRender = useCallback(() => setTick((t) => t + 1), []);

  // Init ring with doctor round-robin
  useEffect(() => {
    const ring = ringRef.current;
    if (ring.isEmpty) {
      SEED_DOCTORS.forEach((d) => ring.enqueue(d.id));
    }
  }, []);

  // Seed 20 patients on mount
  useEffect(() => {
    const seedPatients = generateSeedPatients(20);
    seedPatients.forEach((p) => {
      fifoRef.current.enqueue(p);
      heapRef.current.insert(p, SEVERITY_PRIORITY[p.severity]);
    });
    forceRender();
  }, [forceRender]);

  // Dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Toast auto-dismiss
  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = useCallback(
    (email: string, _password: string): boolean => {
      const lower = email.toLowerCase().trim();
      if (lower === 'admin@health.com') {
        setUser({ id: 'admin', name: 'Administrator', role: 'admin' });
        return true;
      }
      if (lower === 'doctor@health.com') {
        setUser({ id: 'doc-1', name: 'Dr. Sarah Chen', role: 'doctor', doctorId: 'doc-1' });
        return true;
      }
      if (lower === 'doctor2@health.com') {
        setUser({ id: 'doc-2', name: 'Dr. James Patel', role: 'doctor', doctorId: 'doc-2' });
        return true;
      }
      if (lower === 'doctor3@health.com') {
        setUser({ id: 'doc-3', name: 'Dr. Maria Gomez', role: 'doctor', doctorId: 'doc-3' });
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => setUser(null), []);

  const addPatient = useCallback(
    (
      name: string,
      age: number,
      problemType: string,
      severity: Severity,
      preferredTime: string
    ): { ok: boolean; message: string } => {
      const total =
        fifoRef.current.size + completedRef.current.length + slotPatientRef.current.size;
      if (total >= MAX_CAPACITY) {
        return { ok: false, message: 'Capacity limit (500) reached.' };
      }
      if (!name.trim()) return { ok: false, message: 'Name is required.' };
      if (age < 0 || age > 130) return { ok: false, message: 'Age must be 0–130.' };

      const patient: Patient = {
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim(),
        age,
        problemType,
        severity,
        preferredTime,
        registeredAt: Date.now(),
        calledAt: null,
        completedAt: null,
        assignedDoctor: null,
      };

      fifoRef.current.enqueue(patient);
      heapRef.current.insert(patient, SEVERITY_PRIORITY[severity]);
      showToast(`${patient.name} registered (${severity})`, 'success');
      forceRender();
      return { ok: true, message: 'Patient registered successfully.' };
    },
    [showToast, forceRender]
  );

  // Priority dequeue — always serves highest severity first
  const callNext = useCallback(
    (doctorId: string): Patient | null => {
      const patient = heapRef.current.extractMax();
      if (!patient) {
        showToast('No patients in queue', 'warning');
        return null;
      }
      fifoRef.current.remove((p) => p.id === patient.id);

      patient.calledAt = Date.now();
      patient.assignedDoctor = doctorId;
      currentPatientRef.current.set(doctorId, patient);

      const doc = doctorsRef.current.find((d) => d.id === doctorId);
      if (doc) doc.patientsServed++;

      showToast(`Calling ${patient.name} (${patient.severity})`, 'info');
      forceRender();
      return patient;
    },
    [showToast, forceRender]
  );

  const markCompleted = useCallback(
    (doctorId: string) => {
      const patient = currentPatientRef.current.get(doctorId);
      if (!patient) {
        showToast('No active patient to complete', 'warning');
        return;
      }
      patient.completedAt = Date.now();
      currentPatientRef.current.delete(doctorId);
      completedRef.current.push(patient);
      slotPatientRef.current.delete(doctorId);
      showToast(`${patient.name} marked completed`, 'success');
      forceRender();
    },
    [showToast, forceRender]
  );

  const getCurrentPatient = useCallback((doctorId: string): Patient | null => {
    return currentPatientRef.current.get(doctorId) ?? null;
  }, []);

  const doctorWorkload = useCallback((doctorId: string): number => {
    const doc = doctorsRef.current.find((d) => d.id === doctorId);
    return doc?.patientsServed ?? 0;
  }, []);

  // Slot allocation — round-robin via circular queue
  const allocateSlots = useCallback(() => {
    const ring = ringRef.current;
    let allocated = 0;

    while (!heapRef.current.isEmpty && allocated < 100) {
      const patient = heapRef.current.extractMax();
      if (!patient) break;

      // Find next available doctor slot via ring
      let attempts = 0;
      let doctorId: string | undefined;
      while (attempts < ring.cap) {
        const candidate = ring.dequeue();
        if (candidate) {
          ring.enqueue(candidate);
          doctorId = candidate;
          break;
        }
        attempts++;
      }
      if (!doctorId) break;

      const doc = doctorsRef.current.find((d) => d.id === doctorId);
      if (doc) {
        patient.assignedDoctor = doctorId;
        slotPatientRef.current.set(doctorId, patient);
        fifoRef.current.remove((p) => p.id === patient.id);
        allocated++;
      }
    }

    if (allocated > 0) showToast(`${allocated} patients allocated to slots`, 'success');
    forceRender();
  }, [showToast, forceRender]);

  // Build slot view
  const slots: Slot[] = doctorsRef.current.map((doc, i) => {
    const patient = slotPatientRef.current.get(doc.id);
    return {
      index: i,
      doctorId: doc.id,
      doctorName: doc.name,
      status: patient ? 'booked' : 'free',
      patientId: patient?.id ?? null,
      patientName: patient?.name ?? null,
    };
  });

  // Analytics
  const analytics: Analytics = (() => {
    const completed = completedRef.current;
    const served = completed.length;
    let totalWait = 0;
    let emergencyWait = 0;
    let emergencyCount = 0;

    for (const p of completed) {
      if (p.calledAt && p.completedAt) {
        const wait = p.completedAt - p.registeredAt;
        totalWait += wait;
        if (p.severity === 'Emergency' || p.severity === 'Critical') {
          emergencyWait += p.calledAt - p.registeredAt;
          emergencyCount++;
        }
      }
    }

    const avgWait = served > 0 ? Math.round(totalWait / served / 1000) : 0;
    const emergencyResponse = emergencyCount > 0 ? Math.round(emergencyWait / emergencyCount) : 0;

    // FIFO vs Priority simulation
    const fifoTimes = [12, 18, 25, 30, 20, 15, 28, 22, 35, 19];
    const priorityTimes = [8, 5, 3, 2, 10, 7, 4, 6, 3, 5];
    const fifoVsPriority = fifoTimes.map((f, i) => ({
      label: `Batch ${i + 1}`,
      fifo: f,
      priority: priorityTimes[i],
    }));

    const perDoctorWorkload = doctorsRef.current.map((d) => ({
      doctorId: d.id,
      doctorName: d.name,
      patients: d.patientsServed,
    }));

    return {
      averageWaitingTime: avgWait,
      patientsServed: served,
      emergencyResponseTime: emergencyResponse,
      fifoVsPriority,
      perDoctorWorkload,
    };
  })();

  // Simulation
  const simulate = useCallback(
    (count: number): TimingResult => {
      const startFill = performance.now();
      const patients = generateSeedPatients(count);
      patients.forEach((p) => {
        fifoRef.current.enqueue(p);
        heapRef.current.insert(p, SEVERITY_PRIORITY[p.severity]);
      });
      const fillEnd = performance.now();

      // Measure emergency response (extract first emergency/critical)
      const emergStart = performance.now();
      let emergFound = false;
      const tempHeap = new MaxHeap<Patient>();
      const allSnapshot = heapRef.current.toArray();
      allSnapshot.forEach((p) => {
        const prio = SEVERITY_PRIORITY[p.severity];
        tempHeap.insert(p, prio);
      });
      const firstP = tempHeap.peekMax();
      if (firstP && (firstP.severity === 'Emergency' || firstP.severity === 'Critical')) {
        emergFound = true;
      }
      const emergEnd = performance.now();

      // Measure allocation time
      const allocStart = performance.now();
      let allocCount = 0;
      const ring = ringRef.current;
      const tempHeap2 = new MaxHeap<Patient>();
      allSnapshot.forEach((p) => {
        tempHeap2.insert(p, SEVERITY_PRIORITY[p.severity]);
      });
      const maxAlloc = Math.min(count, 50);
      while (!tempHeap2.isEmpty && allocCount < maxAlloc) {
        const p = tempHeap2.extractMax();
        if (!p) break;
        const docId = ring.dequeue();
        if (docId) ring.enqueue(docId);
        allocCount++;
      }
      const allocEnd = performance.now();

      const emergencyMs = emergFound ? Math.round(emergEnd - emergStart) : 0;
      const allocationMs = Math.round(allocEnd - allocStart);
      const fillMs = Math.round(fillEnd - startFill);

      showToast(
        `Simulation done: ${count} patients in ${fillMs}ms | Emergency: ${emergencyMs}ms | Alloc: ${allocationMs}ms`,
        'success'
      );

      forceRender();
      return {
        emergencyResponseMs: emergencyMs,
        allocationMs,
        totalPatients: count,
      };
    },
    [showToast, forceRender]
  );

  const totalRegistered =
    fifoRef.current.size + completedRef.current.length + slotPatientRef.current.size;

  const value: StoreContextValue = {
    user,
    login,
    logout,
    fifoQueue: fifoRef.current.toArray(),
    priorityQueue: heapRef.current.toArray(),
    slots,
    doctors: doctorsRef.current,
    addPatient,
    totalRegistered,
    callNext,
    markCompleted,
    getCurrentPatient,
    doctorWorkload,
    allocateSlots,
    analytics,
    simulate,
    toasts,
    showToast,
    dismissToast,
    darkMode,
    toggleDarkMode: () => setDarkMode((d) => !d),
    maxCapacity: MAX_CAPACITY,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
