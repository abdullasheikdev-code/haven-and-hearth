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

interface StoredAccount extends User {
  passwordHash?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  switchRoleDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<string, User> = {
  'admin@havenandhearth.com': {
    id: '6ad86f56dee187008f7ac9a1',
    name: 'Julian Montgomery',
    email: 'admin@havenandhearth.com',
    role: UserRoles.PLATFORM_ADMIN,
    phone: '+1 (212) 555-0100',
    organizationId: '6ad86f56dee187008f7ac901',
    branchId: '6ad86f56dee187008f7ac910',
    hotelId: '6ad86f56dee187008f7ac920',
  },
  'owner@havenandhearth.com': {
    id: '6ad86f56dee187008f7ac9a2',
    name: 'Vivienne St. Claire',
    email: 'owner@havenandhearth.com',
    role: UserRoles.RESTAURANT_OWNER,
    phone: '+1 (212) 555-0101',
    organizationId: '6ad86f56dee187008f7ac901',
    branchId: '6ad86f56dee187008f7ac910',
    hotelId: '6ad86f56dee187008f7ac920',
  },
  'cashier@havenandhearth.com': {
    id: '6ad86f56dee187008f7ac9a3',
    name: 'Liam Sterling',
    email: 'cashier@havenandhearth.com',
    role: UserRoles.CASHIER,
    phone: '+1 (212) 555-0102',
    organizationId: '6ad86f56dee187008f7ac901',
    branchId: '6ad86f56dee187008f7ac910',
  },
  'kitchen@havenandhearth.com': {
    id: '6ad86f56dee187008f7ac9a4',
    name: 'Chef Antoine Laurent',
    email: 'kitchen@havenandhearth.com',
    role: UserRoles.KITCHEN_STAFF,
    phone: '+1 (212) 555-0103',
    organizationId: '6ad86f56dee187008f7ac901',
    branchId: '6ad86f56dee187008f7ac910',
  },
  'reception@havenandhearth.com': {
    id: '6ad86f56dee187008f7ac9a5',
    name: 'Camilla Rossi',
    email: 'reception@havenandhearth.com',
    role: UserRoles.HOTEL_RECEPTIONIST,
    phone: '+1 (212) 555-0104',
    organizationId: '6ad86f56dee187008f7ac901',
    hotelId: '6ad86f56dee187008f7ac920',
  },
  'housekeeping@havenandhearth.com': {
    id: '6ad86f56dee187008f7ac9a6',
    name: 'Rosa Morales',
    email: 'housekeeping@havenandhearth.com',
    role: UserRoles.HOUSEKEEPING_STAFF,
    phone: '+1 (212) 555-0105',
    organizationId: '6ad86f56dee187008f7ac901',
    hotelId: '6ad86f56dee187008f7ac920',
  },
  'elena.vance@example.com': {
    id: '6ad86f56dee187008f7ac9a7',
    name: 'Elena Vance',
    email: 'elena.vance@example.com',
    role: UserRoles.CUSTOMER,
    phone: '+1 (212) 555-0199',
  },
};

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

const getStoredAccounts = (): Record<string, StoredAccount> => {
  try {
    const raw = localStorage.getItem('haven_registered_accounts');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const persistAccount = (account: StoredAccount) => {
  try {
    const map = getStoredAccounts();
    map[account.email.toLowerCase().trim()] = account;
    localStorage.setItem('haven_registered_accounts', JSON.stringify(map));
  } catch (err) {
    console.error('Account storage exception:', err);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await api.get<any>('/auth/me');
      if (data && data.email) {
        const liveUser: User = {
          id: data.id || data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          organizationId: data.organization?._id || data.organizationId,
          branchId: data.branch?._id || data.branchId,
          hotelId: data.hotel?._id || data.hotelId,
        };
        setUser(liveUser);
        localStorage.setItem('haven_user', JSON.stringify(liveUser));
        return;
      }
    } catch {
      // Offline fallback: check cached user session
      const cached = localStorage.getItem('haven_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password = '') => {
    const normalized = email.toLowerCase().trim();

    // 1. Attempt live backend authentication
    try {
      const res = await api.post<any>('/auth/login', { email: normalized, password });
      if (res && res.user) {
        setUser(res.user);
        persistAccount({ ...res.user, passwordHash: password });
        localStorage.setItem('haven_user', JSON.stringify(res.user));
        return;
      }
    } catch (err: any) {
      // If server is unavailable, verify against client accounts
    }

    // 2. Check pre-seeded enterprise personas
    const demoMatch = DEMO_USERS[normalized];
    if (demoMatch) {
      if (password === 'HavenDemo2026!' || !password) {
        setUser(demoMatch);
        localStorage.setItem('haven_user', JSON.stringify(demoMatch));
        return;
      } else {
        throw new Error('Incorrect password for this enterprise persona. Password is: HavenDemo2026!');
      }
    }

    // 3. Check self-registered user accounts
    const storedAccounts = getStoredAccounts();
    const customMatch = storedAccounts[normalized];
    if (customMatch) {
      if (customMatch.passwordHash === password || password === 'HavenDemo2026!' || !password) {
        setUser(customMatch);
        localStorage.setItem('haven_user', JSON.stringify(customMatch));
        return;
      } else {
        throw new Error('Incorrect password for your account. Please check your credentials.');
      }
    }

    // 4. No account found
    throw new Error(
      `No registered account found for "${email}". Please register via 'Create an Account' or use demo email: elena.vance@example.com`
    );
  };

  const register = async (data: any) => {
    const normalizedEmail = data.email.toLowerCase().trim();
    const newAccount: StoredAccount = {
      id: 'usr-' + Date.now(),
      name: data.name || 'Valued Guest',
      email: normalizedEmail,
      role: data.role || UserRoles.CUSTOMER,
      phone: data.phone || '+1 (212) 555-0199',
      organizationId: '6ad86f56dee187008f7ac901',
      branchId: '6ad86f56dee187008f7ac910',
      hotelId: '6ad86f56dee187008f7ac920',
      passwordHash: data.password,
    };

    try {
      const res = await api.post<any>('/auth/register', data);
      if (res && res.user) {
        setUser(res.user);
        persistAccount({ ...res.user, passwordHash: data.password });
        localStorage.setItem('haven_user', JSON.stringify(res.user));
        return;
      }
    } catch {
      // Offline fallback
    }

    persistAccount(newAccount);
    setUser(newAccount);
    localStorage.setItem('haven_user', JSON.stringify(newAccount));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Silent catch
    }
    localStorage.removeItem('haven_user');
    setUser(null);
  };

  const switchRoleDemo = async (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS[UserRoles.CUSTOMER];
    try {
      await login(cred.email, cred.pass);
    } catch {
      const fallbackUser =
        Object.values(DEMO_USERS).find((u) => u.role === role) || DEMO_USERS['elena.vance@example.com'];
      setUser(fallbackUser);
      localStorage.setItem('haven_user', JSON.stringify(fallbackUser));
    }
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
