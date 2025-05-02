import { User, UserRole } from '../types/User';
import { v4 as uuidv4 } from 'uuid';

// Mock user database
const users = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=68',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'parent-1',
    name: 'Parent User',
    email: 'parent@example.com',
    password: 'parent123',
    role: 'parent' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=13',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-1',
    name: 'Student User',
    email: 'student@example.com',
    password: 'student123',
    role: 'student' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=23',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'educator-1',
    name: 'Educator User',
    email: 'educator@example.com',
    password: 'educator123',
    role: 'educator' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=32',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'driver-1',
    name: 'Driver User',
    email: 'driver@example.com',
    password: 'driver123',
    role: 'driver' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=53',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cook-1',
    name: 'Cook User',
    email: 'cook@example.com',
    password: 'cook123',
    role: 'cook' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=43',
    createdAt: new Date().toISOString(),
  }
];

export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
};

export const mockLogout = async (): Promise<void> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const generateToken = (): string => {
  return uuidv4();
};