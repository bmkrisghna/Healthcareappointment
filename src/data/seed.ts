import type { Doctor, Patient, Severity } from '@/types';

export const SEED_DOCTORS: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Sarah Chen', specialty: 'General Medicine', slotCount: 8, patientsServed: 0 },
  { id: 'doc-2', name: 'Dr. James Patel', specialty: 'Cardiology', slotCount: 8, patientsServed: 0 },
  { id: 'doc-3', name: 'Dr. Maria Gomez', specialty: 'Emergency Care', slotCount: 8, patientsServed: 0 },
];

const PROBLEM_TYPES = [
  'Fever', 'Chest Pain', 'Fracture', 'Headache', 'Abdominal Pain',
  'Shortness of Breath', 'Allergic Reaction', 'Hypertension',
  'Diabetes Check', 'Skin Rash', 'Back Pain', 'Nausea',
];

const NAMES = [
  'John Smith', 'Emma Wilson', 'Liam Brown', 'Olivia Davis', 'Noah Miller',
  'Ava Garcia', 'William Rodriguez', 'Sophia Martinez', 'James Anderson',
  'Isabella Thomas', 'Benjamin Taylor', 'Mia Moore', 'Elijah Jackson',
  'Charlotte Lee', 'Lucas Harris', 'Amelia Clark', 'Mason Lewis',
  'Harper Walker', 'Ethan Hall', 'Evelyn Allen',
];

const SEVERITIES: Severity[] = ['Routine', 'Urgent', 'Emergency', 'Critical'];

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSeedPatients(count: number): Patient[] {
  const now = Date.now();
  const patients: Patient[] = [];
  for (let i = 0; i < count; i++) {
    patients.push({
      id: `seed-${i + 1}`,
      name: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ''),
      age: 18 + Math.floor(Math.random() * 72),
      problemType: randomItem(PROBLEM_TYPES),
      severity: randomItem(SEVERITIES),
      preferredTime: randomItem(TIMES),
      registeredAt: now - (count - i) * 60000,
      calledAt: null,
      completedAt: null,
      assignedDoctor: null,
    });
  }
  return patients;
}

export const PROBLEM_TYPE_OPTIONS = PROBLEM_TYPES;
export const NAME_POOL = NAMES;
