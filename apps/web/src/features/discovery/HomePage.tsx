import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { ChefIllustration } from '../../components/illustrations/ChefIllustration';
import { RoomServiceIllustration } from '../../components/illustrations/RoomServiceIllustration';
import {
  Search,
  Calendar,
  Users,
  UtensilsCrossed,
  BedDouble,
  ArrowRight,
  Star,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [activeTab, setActiveTab] = useState<'dining' | 'stays'>('dining');
  const [searchDate, setSearchDate] = useState('2026-10-22');
  const [partySize, setPartySize] = useState('2 Guests');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resList, hotelList] = await Promise.all([
          api.get<any[]>('/restaurants'),
          api.get<any[]>('/hotels'),
        ]);
        setRestaurants(resList || []);
        setHotels(hotelList || []);
      } catch (err) {
        console.error('Failed to load discovery data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'dining') {
      navigate('/restaurants');
    } else {
      navigate('/hotels');
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-200/60 text-forest-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-mango-500" />
                <span>The Sovereign Hospitality Collection • Manhattan Estate</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-charcoal-900 tracking-tight leading-[1.08]">
                Where Culinary Heritage Meets Restful{' '}
                <span className="italic font-normal text-terracotta-500">Sanctuary</span>.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-600 max-w-xl font-normal leading-relaxed">
                Discover Michelin-inspired dining, open-flame gastronomy, and intimate boutique residences.
                Seamlessly reserve tables, book suites, and enjoy 24/7 artisanal room service — all united within one platform.
              </p>

              {/* Integrated Search Box */}
              <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-editorial border border-ivory-300/80 max-w-xl">
                {/* Search Type Tabs */}
                <div className="flex gap-2 p-1 bg-ivory-200 rounded-2xl w-fit mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dining')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'dining'
                        ? 'bg-white text-forest-900 shadow-sm'
                        : 'text-charcoal-500 hover:text-charcoal-800'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Table Reservation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stays')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'stays'
                        ? 'bg-white text-forest-900 shadow-sm'
                        : 'text-charcoal-500 hover:text-charcoal-800'
                    }`}
                  >
                    <BedDouble className="w-3.5 h-3.5 text-forest-700" />
                    <span>Boutique Stays</span>
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-ivory-100 border border-ivory-300">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                      Destination / Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-forest-700 shrink-0" />
                      <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-charcoal-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-ivory-100 border border-ivory-300">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                      Party Size
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-forest-700 shrink-0" />
                      <select
                        value={partySize}
                        onChange={(e) => setPartySize(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-charcoal-800 focus:outline-none"
                      >
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>4 Guests</option>
                        <option>6 Guests</option>
                        <option>8+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold tracking-wide uppercase shadow-md transition-all group"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex items-center gap-6 pt-2 text-xs text-charcoal-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  Instant Live Confirmation
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-forest-700" />
                  Free 48h Modification
                </span>
              </div>
            </div>

            {/* Right Editorial Composite Images */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Luxury Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-editorial border-4 border-white aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                    alt="L'Étoile Brasserie Fine Dining Ambiance"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <span className="px-2.5 py-1 rounded-full bg-terracotta-500 text-[10px] font-bold uppercase tracking-wider">
                      Flagship Brasserie
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-2">L'Étoile Brasserie</h3>
                    <p className="text-xs text-ivory-200 mt-1">428 Mercer Street, New York • French-Mediterranean</p>
                  </div>
                </div>

                {/* Overlapping Floating Hotel Suite Card */}
                <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-editorial border border-ivory-300 max-w-xs hidden sm:block text-left animate-in fade-in slide-in-from-bottom-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=300&q=80"
                      alt="Haven Sovereign Suite"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-mango-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-charcoal-900">4.95</span>
                        <span className="text-charcoal-400">(Boutique Stay)</span>
                      </div>
                      <h4 className="font-serif text-xs font-bold text-charcoal-900 mt-0.5">Haven Sovereign Suite</h4>
                      <p className="text-[11px] font-semibold text-terracotta-600 mt-0.5">$495 / night</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dining Experiences Section */}
      <section className="py-20 bg-ivory-200/60 border-t border-ivory-300/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
                Signature Gastronomy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1.5">
                Destinations of Exceptional Taste
              </h2>
            </div>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-terracotta-600 transition-colors mt-4 md:mt-0"
            >
              <span>Explore All Menus &amp; Tables</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-soft hover:shadow-editorial transition-all group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-forest-900 shadow-sm">
                    {restaurant.priceRange} • {restaurant.cuisine.join(', ')}
                  </div>
                  <div className="absolute top-4 right-4 bg-forest-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-mango-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-charcoal-500 mt-1 italic">{restaurant.tagline}</p>
                    <p className="text-xs text-charcoal-600 mt-3 line-clamp-3 leading-relaxed">
                      {restaurant.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-ivory-200 flex items-center justify-between">
                    <div className="text-xs text-charcoal-500">
                      <span className="block font-semibold text-charcoal-800">Dinner Hours:</span>
                      <span>{restaurant.openingHours.dinner}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/restaurants/${restaurant.slug}`}
                        className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 text-xs font-bold transition-colors"
                      >
                        View Menu
                      </Link>
                      <Link
                        to={`/restaurants/${restaurant.slug}?book=true`}
                        className="px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        Book Table
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boutique Stays Section */}
      <section className="py-20 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
                Bespoke Residences
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1.5">
                The Grand Haven Hotel &amp; Suites
              </h2>
            </div>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-terracotta-600 transition-colors mt-4 md:mt-0"
            >
              <span>View All Suites &amp; Availability</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-soft grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-6 relative h-72 lg:h-auto">
                <img
                  src={hotel.coverImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-forest-900 text-mango-200 px-3 py-1 rounded-full text-xs font-bold">
                  ★★★★★ Boutique Luxury
                </div>
              </div>

              <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-charcoal-900">{hotel.name}</h3>
                  <p className="text-xs text-charcoal-500 mt-1">{hotel.tagline}</p>
                  <p className="text-xs sm:text-sm text-charcoal-600 mt-4 leading-relaxed">
                    {hotel.description}
                  </p>

                  {/* Amenities grid */}
                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
                      Estate Inclusions
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-700">
                      {hotel.amenities.slice(0, 4).map((a: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-ivory-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-charcoal-500 block">From</span>
                    <span className="font-serif text-2xl font-bold text-forest-900">$360</span>
                    <span className="text-xs text-charcoal-500"> / night</span>
                  </div>

                  <Link
                    to={`/hotels/${hotel.slug}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold tracking-wide uppercase shadow-sm transition-colors text-center"
                  >
                    Check Stay Dates
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connected Hospitality Value Banner */}
      <section className="py-16 bg-forest-900 text-ivory-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60 flex items-start gap-4">
              <ChefIllustration className="w-16 h-16 shrink-0" />
              <div>
                <h4 className="font-serif text-base font-bold text-ivory-50">Michelin Craft Kitchens</h4>
                <p className="text-xs text-forest-200 mt-1 leading-relaxed">
                  Real-time ticket updates flow directly from online orders to the culinary brigade's kitchen displays.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60 flex items-start gap-4">
              <RoomServiceIllustration className="w-16 h-16 shrink-0" />
              <div>
                <h4 className="font-serif text-base font-bold text-ivory-50">In-Room Dining to Suite</h4>
                <p className="text-xs text-forest-200 mt-1 leading-relaxed">
                  Guests can charge artisanal wood-fired dishes and cocktails directly to their hotel room folio.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-terracotta-500/20 border border-terracotta-400/40 flex items-center justify-center shrink-0 text-terracotta-400 font-serif font-bold text-2xl">
                POS
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-ivory-50">Unified Operations POS</h4>
                <p className="text-xs text-forest-200 mt-1 leading-relaxed">
                  Cashiers, receptionists, and managers operate on real MongoDB aggregations and instant live synchrony.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
