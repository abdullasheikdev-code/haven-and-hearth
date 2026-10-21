import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, UserRoles } from '@haven/shared';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchRoleDemo } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (role: UserRole) => {
    try {
      setLoading(true);
      await switchRoleDemo(role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex text-left font-sans">
      {/* Left Form Column */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 max-w-xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-mango-200 font-serif font-bold text-sm">
              H
            </div>
            <span className="font-serif text-xl font-bold text-charcoal-900">
              Haven <span className="text-terracotta-500">&amp;</span> Hearth
            </span>
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Welcome Back
          </h1>
          <p className="text-xs text-charcoal-500 mt-2">
            Sign in to access your guest reservations, room stays, or staff operations.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. elena.vance@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-charcoal-700">Password</label>
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Quick Demo Switcher */}
        <div className="mt-8 pt-6 border-t border-ivory-300">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-700 mb-3">
            <Sparkles className="w-4 h-4 text-mango-500" />
            <span>1-Click Live Persona Logins:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { role: UserRoles.CUSTOMER, label: 'Customer' },
              { role: UserRoles.RESTAURANT_OWNER, label: 'Owner / GM' },
              { role: UserRoles.CASHIER, label: 'POS Cashier' },
              { role: UserRoles.KITCHEN_STAFF, label: 'Kitchen Chef' },
              { role: UserRoles.HOTEL_RECEPTIONIST, label: 'Hotel Desk' },
              { role: UserRoles.HOUSEKEEPING_STAFF, label: 'Housekeeper' },
            ].map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => handleDemoFill(d.role)}
                className="p-2 rounded-lg bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 text-[11px] font-bold transition-colors text-center"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-charcoal-500 text-center">
          New guest?{' '}
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
