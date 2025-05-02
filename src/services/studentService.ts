import { supabase } from '../lib/supabase';
import { Student, Transaction, Badge } from '../types/User';

export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getStudentsByParentId = async (parentId: string): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');

  if (error) throw error;
  return data;
};

export const addStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> => {
  const { data, error } = await supabase
    .from('students')
    .insert([student])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getBadges = async (): Promise<Badge[]> => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getBadgeByStudentId = async (studentId: string): Promise<Badge | null> => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error) throw error;
  return data;
};

export const toggleBadgeStatus = async (badgeId: string, isActive: boolean): Promise<Badge> => {
  const { data, error } = await supabase
    .from('badges')
    .update({ is_active: isActive })
    .eq('id', badgeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getTransactionsByStudentId = async (studentId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  if (error) throw error;
  return data;
};