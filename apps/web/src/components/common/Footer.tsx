import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-ivory-300 pt-16 pb-12 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-forest-900/80">
          {/* Brand Philosophy */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-mango-300 font-serif font-bold text-lg">
                H
              </div>
              <span className="font-serif text-xl font-bold text-ivory-50 tracking-tight">
                Haven <span className="text-terracotta-500">&amp;</span> Hearth
              </span>
            </div>
            <p className="text-xs text-forest-200/80 leading-relaxed">
              An interconnected hospitality destination uniting Michelin-caliber culinary craftsmanship, boutique sanctuary stays, and high-velocity operations technology.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-mango-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Spectrum MERN Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-ivory-100 uppercase">Hospitality</h4>
            <ul className="space-y-2 text-xs text-forest-200/70">
              <li>
                <Link to="/restaurants" className="hover:text-ivory-50 transition-colors">
                  Artisanal Restaurants &amp; Bars
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-ivory-50 transition-colors">
                  The Grand Haven Boutique Hotel
                </Link>
              </li>
              <li>
                <Link to="/restaurants/letoile-brasserie" className="hover:text-ivory-50 transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link to="/hotels/the-grand-haven-hotel" className="hover:text-ivory-50 transition-colors">
                  In-Suite Experiences &amp; Stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-ivory-100 uppercase">Operations Engine</h4>
            <ul className="space-y-2 text-xs text-forest-200/70">
              <li>
                <Link to="/app/overview" className="hover:text-ivory-50 transition-colors">
                  Owner Executive Dashboard
                </Link>
              </li>
              <li>
                <Link to="/app/pos" className="hover:text-ivory-50 transition-colors">
                  High-Speed POS Terminal
                </Link>
              </li>
              <li>
                <Link to="/app/kitchen" className="hover:text-ivory-50 transition-colors">
                  Live Kitchen Display (KDS)
                </Link>
              </li>
              <li>
                <Link to="/hotel/overview" className="hover:text-ivory-50 transition-colors">
                  Front Desk &amp; Folio System
                </Link>
              </li>
              <li>
                <Link to="/hotel/housekeeping" className="hover:text-ivory-50 transition-colors">
                  Housekeeping Operations
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-ivory-100 uppercase">Estate Concierge</h4>
            <div className="space-y-2.5 text-xs text-forest-200/70">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                <span>428 Mercer Street, New York, NY 10013</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-terracotta-400" />
                <span>+1 (212) 555-0182</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-terracotta-400" />
                <span>concierge@havenandhearth.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-forest-200/60">
          <p>© {new Date().getFullYear()} Haven &amp; Hearth Hospitality Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Powered by MongoDB, Express, React &amp; Node.js</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
