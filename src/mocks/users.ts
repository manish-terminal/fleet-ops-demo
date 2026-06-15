import type { User } from '@/types/auth';

export const mockUsers = [
  { email: 'admin@fleetops.demo',   password: 'demo1234', role: 'admin' },
  { email: 'manager@fleetops.demo', password: 'demo1234', role: 'manager' },
  { email: 'staff@fleetops.demo',   password: 'demo1234', role: 'office_staff' },
  { email: 'driver@fleetops.demo',  password: 'demo1234', role: 'driver' },
];

export const mockUserProfiles: Record<string, User> = {
  'admin@fleetops.demo': {
    id: 'usr-admin',
    name: 'Arun ',
    email: 'admin@fleetops.demo',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    phone: '+91 98765 43210',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  'manager@fleetops.demo': {
    id: 'usr-manager',
    name: 'Amit Patel',
    email: 'manager@fleetops.demo',
    role: 'manager',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    phone: '+91 98765 12345',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  'staff@fleetops.demo': {
    id: 'usr-staff',
    name: 'Priya Nair',
    email: 'staff@fleetops.demo',
    role: 'office_staff',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    phone: '+91 98765 67890',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  'driver@fleetops.demo': {
    id: 'usr-driver',
    name: 'Vikram Singh',
    email: 'driver@fleetops.demo',
    role: 'driver',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    phone: '+91 98765 23456',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
};

