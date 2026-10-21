import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  ChefHat,
  Grid,
  BedDouble,
  Brush,
  Boxes,
  BarChart3,
  LogOut,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';

export const StaffLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Executive Overview', path: '/app/overview', icon: LayoutDashboard },
    { name: 'POS Terminal', path: '/app/pos', icon: Receipt },
    { name: 'Kitchen KDS', path: '/app/kitchen', icon: ChefHat },
    { name: 'Floor Tables', path: '/app/tables', icon: Grid },
    { name: 'Hotel Front Desk', path: '/hotel/overview', icon: BedDouble },
    { name: 'Housekeeping', path: '/hotel/housekeeping', icon: Brush },
    { name: 'Inventory & Stock', path: '/app/inventory', icon: Boxes },
    { name: 'Business Reports', path: '/app/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-ivory-200 flex text-left font-sans">
      {/* Operations Sidebar */}
      <aside className="w-64 bg-forest-950 text-ivory-100 flex flex-col justify-between shrink-0 border-r border-forest-900 hidden md:flex">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-forest-900">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-mango-200 font-serif font-bold text-lg">
                H
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-ivory-50 tracking-tight leading-none block">
                  Haven <span className="text-terracotta-500">&amp;</span> Hearth
                </span>
                <span className="text-[10px] uppercase tracking-wider text-forest-300 font-bold block mt-0.5">
                  Operations Console
                </span>
              </div>
            </Link>

            {/* Active User Persona Pill */}
            {user && (
              <div className="mt-4 p-2.5 rounded-xl bg-forest-900/90 border border-forest-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ivory-100 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-mango-300 font-semibold tracking-wide uppercase mt-0.5">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-800 text-ivory-50 shadow-sm border border-forest-700/60'
                      : 'text-forest-200/70 hover:bg-forest-900/60 hover:text-ivory-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-mango-300' : 'text-forest-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-forest-900 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-forest-200/70 hover:bg-forest-900 hover:text-ivory-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-mango-400" />
              <span>Public Storefront</span>
            </span>
          </Link>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Operations Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operations Header Bar */}
        <header className="h-16 bg-white border-b border-ivory-300 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-forest-950 bg-ivory-200 px-3 py-1 rounded-full border border-ivory-300">
              The Grand Haven Estate • Flagship Branch
            </span>
            <span className="text-xs text-charcoal-500 hidden sm:inline">
              Live Operations Mode
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-700">
            <Link
              to="/"
              className="text-terracotta-600 hover:text-terracotta-700 font-bold flex items-center gap-1"
            >
              <span>Switch to Guest View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 sm:p-8 bg-ivory-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
