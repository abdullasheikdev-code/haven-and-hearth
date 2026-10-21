import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, UserRoles } from '@haven/shared';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, ChefHat, BedDouble, Receipt, Brush, Crown, User as UserIcon, X, ChevronRight } from 'lucide-react';

const ROLES_META: { role: UserRole; label: string; name: string; path: string; icon: any; color: string }[] = [
  { role: UserRoles.CUSTOMER, label: 'Customer', name: 'Elena Vance', path: '/', icon: UserIcon, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { role: UserRoles.RESTAURANT_OWNER, label: 'Owner & GM', name: 'Vivienne St. Claire', path: '/app/overview', icon: Crown, color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { role: UserRoles.CASHIER, label: 'POS Terminal', name: 'Liam Sterling', path: '/app/pos', icon: Receipt, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { role: UserRoles.KITCHEN_STAFF, label: 'Kitchen KDS', name: 'Chef Antoine', path: '/app/kitchen', icon: ChefHat, color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { role: UserRoles.HOTEL_RECEPTIONIST, label: 'Hotel Front Desk', name: 'Camilla Rossi', path: '/hotel/overview', icon: BedDouble, color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { role: UserRoles.HOUSEKEEPING_STAFF, label: 'Housekeeping', name: 'Rosa Morales', path: '/hotel/housekeeping', icon: Brush, color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { role: UserRoles.PLATFORM_ADMIN, label: 'Platform Admin', name: 'Julian Montgomery', path: '/app/reports', icon: Shield, color: 'bg-red-100 text-red-800 border-red-300' },
];

export const DemoRoleSwitcher: React.FC = () => {
  const { user, switchRoleDemo } = useAuth();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  const handleSelectRole = async (item: typeof ROLES_META[0]) => {
    try {
      setSwitching(true);
      await switchRoleDemo(item.role);
      navigate(item.path);
      setOpen(false);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-forest-800 text-ivory-50 shadow-editorial border border-forest-600/40 hover:bg-forest-900 transition-all transform hover:scale-105 group"
          title="Switch Live Demo Role"
        >
          <Sparkles className="w-4 h-4 text-mango-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            Active: <span className="text-mango-200">{user ? user.role.replace('_', ' ') : 'Guest'}</span>
          </span>
          <span className="bg-terracotta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Switch</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-editorial border border-charcoal-100 w-80 p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <h3 className="font-serif font-bold text-charcoal-900 text-sm">Demo Persona Switcher</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full text-charcoal-500 hover:bg-ivory-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-charcoal-500 my-2">
            Instant 1-click test switch between personas with real seeded operational permissions:
          </p>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {ROLES_META.map((item) => {
              const Icon = item.icon;
              const isCurrent = user?.role === item.role;
              return (
                <button
                  key={item.role}
                  disabled={switching}
                  onClick={() => handleSelectRole(item)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-ivory-300 font-semibold border border-forest-600/30'
                      : 'hover:bg-ivory-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal-900 leading-tight">{item.label}</p>
                      <p className="text-[11px] text-charcoal-500 leading-tight">{item.name}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-charcoal-100 text-[11px] text-charcoal-500 flex justify-between items-center">
            <span>Pass: <code className="bg-ivory-200 px-1 py-0.5 rounded font-mono">HavenDemo2026!</code></span>
            <span className="text-terracotta-600 font-medium">Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};
