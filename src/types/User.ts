export type UserRole = 'admin' | 'parent' | 'student' | 'educator' | 'driver' | 'cook' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  organization: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  qr_code: string;
  balance: number;
  parent_id: string;
  class: string;
  attendance_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  student_id: string;
  amount: number;
  type: 'CANTINE' | 'SORTIE' | 'SCOLARITE' | 'RECHARGE';
  date: string;
  details?: string | null;
  created_at: string;
}

export interface Badge {
  id: string;
  student_id: string;
  qr_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
