import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { STAFF_ROLES } from '@haven/shared';
import {
  ShoppingBag,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Compass,
  UtensilsCrossed,
  BedDouble,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isStaff = user && STAFF_ROLES.includes(user.role);

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/95 backdrop-blur-md border-b border-ivory-300/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-ivory-50 shadow-soft group-hover:bg-forest-900 transition-colors">
              <span className="font-serif text-xl font-bold tracking-tighter text-mango-200">H</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl font-bold text-charcoal-900 tracking-tight leading-none">
                Haven <span className="text-terracotta-500">&amp;</span> Hearth
              </span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 font-semibold mt-0.5">
                Hospitality Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/restaurants"
              className="text-sm font-medium text-charcoal-700 hover:text-terracotta-600 transition-colors flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-forest-700" />
              <span>Dining &amp; Bars</span>
            </Link>
            <Link
              to="/hotels"
              className="text-sm font-medium text-charcoal-700 hover:text-terracotta-600 transition-colors flex items-center gap-1.5"
            >
              <BedDouble className="w-4 h-4 text-forest-700" />
              <span>Boutique Stays</span>
            </Link>
            <Link
              to="/restaurants/letoile-brasserie"
              className="text-sm font-medium text-charcoal-700 hover:text-terracotta-600 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-forest-700" />
              <span>Curated Tasting</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* If staff role, link to operations workspace */}
            {isStaff && (
              <Link
                to="/app/overview"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold hover:bg-forest-100 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-forest-700" />
                <span>Operations Hub</span>
              </Link>
            )}

            {/* Shopping Cart Pill */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-ivory-200 text-charcoal-800 transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-terracotta-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-ivory-400 bg-white hover:border-charcoal-300 transition-colors"
                >
                  <span className="text-xs font-semibold text-charcoal-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-forest-800 text-ivory-100 text-xs font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-editorial border border-charcoal-100 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-charcoal-100">
                      <p className="text-xs font-bold text-charcoal-900">{user.name}</p>
                      <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-ivory-200 text-[10px] font-bold text-forest-800 rounded">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {isStaff && (
                        <Link
                          to="/app/overview"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-ivory-100 rounded-lg"
                        >
                          <LayoutDashboard className="w-4 h-4 text-forest-700" />
                          <span>Staff Operations</span>
                        </Link>
                      )}
                      <Link
                        to="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-ivory-100 rounded-lg"
                      >
                        <ShoppingBag className="w-4 h-4 text-forest-700" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/account/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-ivory-100 rounded-lg"
                      >
                        <BedDouble className="w-4 h-4 text-forest-700" />
                        <span>My Stays &amp; Tables</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-charcoal-100">
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-forest-800 text-ivory-50 text-xs font-semibold hover:bg-forest-900 transition-colors shadow-soft"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-charcoal-700 hover:bg-ivory-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ivory-300 bg-ivory-100 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-ivory-200"
          >
            Dining &amp; Bars
          </Link>
          <Link
            to="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-ivory-200"
          >
            Boutique Stays
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-ivory-200"
          >
            Cart ({itemCount})
          </Link>
          {isStaff && (
            <Link
              to="/app/overview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-forest-800 bg-forest-50"
            >
              Operations Hub
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
