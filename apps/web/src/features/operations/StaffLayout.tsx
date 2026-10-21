import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRoles } from '@haven/shared';
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
  Menu as MenuIcon,
  X,
  MoreHorizontal,
} from 'lucide-react';

export const StaffLayout: React.FC = () => {
  const { user, logout, switchRoleDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const isStaff = user && user.role !== UserRoles.CUSTOMER && user.role !== UserRoles.GUEST;

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-ivory-300 shadow-editorial space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-forest-900 text-mango-300 flex items-center justify-center mx-auto shadow-soft">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600">
            Enterprise Security Policy
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Operations Access Required
          </h2>
          <p className="text-xs text-charcoal-500 leading-relaxed">
            {user ? (
              <>
                You are currently signed in as <strong>{user.name}</strong> ({user.role.replace('_', ' ')}).
                Hospitality operational suites (POS, Kitchen KDS, Hotel Front Desk, Reports) require staff authorization.
              </>
            ) : (
              <>Please authenticate with staff credentials to enter the Haven &amp; Hearth Operations Hub.</>
            )}
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => switchRoleDemo(UserRoles.RESTAURANT_OWNER)}
              className="w-full py-2.5 rounded-xl bg-forest-800 text-ivory-50 text-xs font-bold hover:bg-forest-900 transition-colors shadow-soft"
            >
              Authorize as Owner &amp; GM (Vivienne St. Claire)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchRoleDemo(UserRoles.CASHIER)}
                className="py-2 px-3 rounded-xl bg-ivory-200 text-charcoal-800 text-xs font-bold hover:bg-ivory-300 transition-colors"
              >
                POS Cashier
              </button>
              <button
                onClick={() => switchRoleDemo(UserRoles.KITCHEN_STAFF)}
                className="py-2 px-3 rounded-xl bg-ivory-200 text-charcoal-800 text-xs font-bold hover:bg-ivory-300 transition-colors"
              >
                Kitchen Chef
              </button>
              <button
                onClick={() => switchRoleDemo(UserRoles.HOTEL_RECEPTIONIST)}
                className="py-2 px-3 rounded-xl bg-ivory-200 text-charcoal-800 text-xs font-bold hover:bg-ivory-300 transition-colors"
              >
                Hotel Desk
              </button>
              <button
                onClick={() => switchRoleDemo(UserRoles.HOUSEKEEPING_STAFF)}
                className="py-2 px-3 rounded-xl bg-ivory-200 text-charcoal-800 text-xs font-bold hover:bg-ivory-300 transition-colors"
              >
                Housekeeping
              </button>
            </div>
            <Link
              to="/"
              className="block pt-3 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700"
            >
              Return to Guest Dining &amp; Sanctuary
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Mobile Slide-Out Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-72 bg-forest-950 text-ivory-100 flex flex-col justify-between p-6 z-10 shadow-editorial animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-forest-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-mango-200 font-serif font-bold">
                    H
                  </div>
                  <div>
                    <span className="font-serif text-base font-bold text-ivory-50 leading-tight block">
                      Operations Hub
                    </span>
                    <span className="text-[10px] text-forest-300 font-bold uppercase">
                      {user?.role.replace('_', ' ') || 'Staff'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 rounded-lg text-forest-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation in Mobile Drawer */}
              <nav className="mt-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileNavOpen(false)}
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

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-forest-900 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-forest-200/70 hover:bg-forest-900"
              >
                <ExternalLink className="w-3.5 h-3.5 text-mango-400" />
                <span>Guest Storefront</span>
              </Link>
              <button
                onClick={async () => {
                  setMobileNavOpen(false);
                  await logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Operations Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operations Header Bar */}
        <header className="h-16 bg-white border-b border-ivory-300 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Navigation Trigger Button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl bg-ivory-100 text-charcoal-700 hover:bg-ivory-200"
              aria-label="Open Operations Menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-forest-950 bg-ivory-200 px-3 py-1 rounded-full border border-ivory-300 truncate max-w-[200px] sm:max-w-none">
              The Grand Haven Estate
            </span>
            <span className="text-xs text-charcoal-500 hidden sm:inline">
              Live Operations
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-700">
            <Link
              to="/"
              className="text-terracotta-600 hover:text-terracotta-700 font-bold flex items-center gap-1"
            >
              <span className="hidden sm:inline">Switch to Guest View</span>
              <span className="sm:hidden">Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Outlet with bottom padding on mobile for the quick bar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 bg-ivory-100">
          <Outlet />
        </main>

        {/* Mobile Bottom Quick Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-md border-t border-forest-800 text-ivory-200 flex items-center justify-around py-2 px-1 shadow-editorial">
          <Link
            to="/app/overview"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              location.pathname === '/app/overview' ? 'text-mango-300' : 'text-forest-300/80'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <Link
            to="/app/pos"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              location.pathname === '/app/pos' ? 'text-mango-300' : 'text-forest-300/80'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>POS</span>
          </Link>
          <Link
            to="/app/kitchen"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              location.pathname === '/app/kitchen' ? 'text-mango-300' : 'text-forest-300/80'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>KDS</span>
          </Link>
          <Link
            to="/hotel/overview"
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              location.pathname === '/hotel/overview' ? 'text-mango-300' : 'text-forest-300/80'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Hotel</span>
          </Link>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold text-forest-300/80"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
