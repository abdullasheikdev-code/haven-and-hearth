import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { UserRole, UserRoles } from '@haven/shared';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  organizationId?: string;
  branchId?: string;
  hotelId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  switchRoleDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string }> = {
  [UserRoles.PLATFORM_ADMIN]: { email: 'admin@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.RESTAURANT_OWNER]: { email: 'owner@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.BRANCH_MANAGER]: { email: 'owner@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.CASHIER]: { email: 'cashier@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.WAITER]: { email: 'cashier@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.KITCHEN_STAFF]: { email: 'kitchen@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.INVENTORY_MANAGER]: { email: 'owner@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.HOTEL_RECEPTIONIST]: { email: 'reception@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.HOUSEKEEPING_STAFF]: { email: 'housekeeping@havenandhearth.com', pass: 'HavenDemo2026!' },
  [UserRoles.CUSTOMER]: { email: 'elena.vance@example.com', pass: 'HavenDemo2026!' },
  [UserRoles.GUEST]: { email: 'elena.vance@example.com', pass: 'HavenDemo2026!' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await api.get<any>('/auth/me');
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          organizationId: data.organization?._id,
          branchId: data.branch?._id,
          hotelId: data.hotel?._id,
        });
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<any>('/auth/login', { email, password });
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.post<any>('/auth/register', data);
    setUser(res.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const switchRoleDemo = async (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS[UserRoles.CUSTOMER];
    await login(cred.email, cred.pass);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
