import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRoles } from '@haven/shared';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<string>(UserRoles.CUSTOMER);
  const [organizationName, setOrganizationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await register({
        name,
        email,
        password,
        phone,
        role,
        organizationName: role === UserRoles.RESTAURANT_OWNER ? organizationName : undefined,
      });
      navigate(role === UserRoles.CUSTOMER ? '/' : '/app/overview');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex text-left font-sans">
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
            Create an Account
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Join the Haven &amp; Hearth collective as a guest or create an enterprise staff profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Vance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. elena@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (212) 555-0199"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Role / Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
            >
              <option value={UserRoles.CUSTOMER}>Guest / Dining Customer Account</option>
              <option value={UserRoles.RESTAURANT_OWNER}>Hospitality Group Owner / GM</option>
              <option value={UserRoles.CASHIER}>POS Cashier / Waiter</option>
              <option value={UserRoles.KITCHEN_STAFF}>Kitchen Chef / Brigade Cook</option>
              <option value={UserRoles.HOTEL_RECEPTIONIST}>Hotel Receptionist / Front Desk</option>
              <option value={UserRoles.HOUSEKEEPING_STAFF}>Housekeeping Specialist</option>
            </select>
          </div>

          {role === UserRoles.RESTAURANT_OWNER && (
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Hospitality Business Name
              </label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. St. Claire Culinary Estate"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-6 text-xs text-charcoal-500 text-center">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-forest-800 hover:text-terracotta-600">
            Sign In
          </Link>
        </p>
      </div>

      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
          alt="Haven & Hearth Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-100 via-transparent to-black/40" />
      </div>
    </div>
  );
};
