export type Severity = 'Routine' | 'Urgent' | 'Emergency' | 'Critical';
export type Role = 'admin' | 'doctor';
export type SlotStatus = 'free' | 'booked';

export interface Patient {
  id: string;
  name: string;
  age: number;
  problemType: string;
  severity: Severity;
  preferredTime: string;
  registeredAt: number;
  calledAt: number | null;
  completedAt: number | null;
  assignedDoctor: string | null;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  slotCount: number;
  patientsServed: number;
}

export interface Slot {
  index: number;
  doctorId: string;
  doctorName: string;
  status: SlotStatus;
  patientId: string | null;
  patientName: string | null;
}

export interface Analytics {
  averageWaitingTime: number;
  patientsServed: number;
  emergencyResponseTime: number;
  fifoVsPriority: { label: string; fifo: number; priority: number }[];
  perDoctorWorkload: { doctorId: string; doctorName: string; patients: number }[];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  doctorId?: string;
}

export interface TimingResult {
  emergencyResponseMs: number;
  allocationMs: number;
  totalPatients: number;
}
