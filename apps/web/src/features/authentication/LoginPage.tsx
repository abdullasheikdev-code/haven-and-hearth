import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, UserRoles } from '@haven/shared';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Crown, Receipt, ChefHat, BedDouble, Brush, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchRoleDemo } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'guest' | 'staff'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      navigate(activeTab === 'staff' ? '/app/overview' : '/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = async (role: UserRole, targetPath: string) => {
    setError(null);
    try {
      setLoading(true);
      await switchRoleDemo(role);
      navigate(targetPath);
    } catch (err: any) {
      setError(err.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex text-left font-sans">
      {/* Left Form Column */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 max-w-xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-mango-200 font-serif font-bold text-sm">
              H
            </div>
            <span className="font-serif text-xl font-bold text-charcoal-900">
              Haven <span className="text-terracotta-500">&amp;</span> Hearth
            </span>
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Enterprise Sign In
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Access your guest reservations, boutique suite stays, or enterprise operations console.
          </p>
        </div>

        {/* Corporate Portal Tabs */}
        <div className="flex bg-ivory-200 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('guest');
              setError(null);
              setEmail('');
              setPassword('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guest'
                ? 'bg-white text-forest-900 shadow-sm'
                : 'text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            Guest &amp; Customer Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setError(null);
              setEmail('');
              setPassword('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'staff'
                ? 'bg-forest-900 text-ivory-50 shadow-sm'
                : 'text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            Staff &amp; Operations Portal
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              {activeTab === 'guest' ? 'Customer Email' : 'Enterprise Staff Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'guest' ? 'e.g. elena.vance@example.com' : 'e.g. owner@havenandhearth.com'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-charcoal-700">Password</label>
              <span className="text-[10px] text-charcoal-400">Demo: HavenDemo2026!</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            {loading ? 'Authenticating...' : `Sign In to ${activeTab === 'guest' ? 'Guest Sanctuary' : 'Operations Console'}`}
          </button>
        </form>

        {/* 1-Click Persona Shortcuts */}
        <div className="mt-6 pt-5 border-t border-ivory-300">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-700 mb-2.5">
            <Sparkles className="w-4 h-4 text-mango-500" />
            <span>Instant 1-Click Verification Logins:</span>
          </div>

          {activeTab === 'guest' ? (
            <button
              type="button"
              onClick={() => handleQuickPersona(UserRoles.CUSTOMER, '/')}
              className="w-full p-3 rounded-xl bg-white border border-ivory-300 hover:border-forest-600 hover:shadow-soft transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-charcoal-900 leading-tight">Elena Vance (Customer)</p>
                  <p className="text-[10px] text-charcoal-500">elena.vance@example.com</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { role: UserRoles.RESTAURANT_OWNER, name: 'Vivienne St. Claire', label: 'Owner & GM', icon: Crown, path: '/app/overview' },
                { role: UserRoles.CASHIER, name: 'Liam Sterling', label: 'POS Cashier', icon: Receipt, path: '/app/pos' },
                { role: UserRoles.KITCHEN_STAFF, name: 'Chef Antoine', label: 'Kitchen Chef', icon: ChefHat, path: '/app/kitchen' },
                { role: UserRoles.HOTEL_RECEPTIONIST, name: 'Camilla Rossi', label: 'Hotel Desk', icon: BedDouble, path: '/hotel/overview' },
                { role: UserRoles.HOUSEKEEPING_STAFF, name: 'Rosa Morales', label: 'Housekeeper', icon: Brush, path: '/hotel/housekeeping' },
                { role: UserRoles.PLATFORM_ADMIN, name: 'Julian M.', label: 'Platform Admin', icon: Shield, path: '/app/reports' },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickPersona(p.role, p.path)}
                    className="p-2 rounded-xl bg-white border border-ivory-300 hover:border-forest-600 hover:shadow-sm text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-forest-800">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{p.label}</span>
                    </div>
                    <p className="text-xs font-bold text-charcoal-900 leading-tight truncate">{p.name}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-charcoal-500 text-center">
          Need a new account?{' '}
          <Link to="/register" className="font-bold text-forest-800 hover:text-terracotta-600">
            Create an Account
          </Link>
        </p>
      </div>

      {/* Right Decorative Editorial Image */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
          alt="Haven & Hearth Luxury Ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-100 via-transparent to-black/40" />
      </div>
    </div>
  );
};
