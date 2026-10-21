import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Star, MapPin, Clock, Search, Filter, Utensils } from 'lucide-react';

export const RestaurantDiscoveryPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await api.get<any[]>('/restaurants');
        setRestaurants(data || []);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const cuisines = ['All', 'French', 'Mediterranean', 'Coastal', 'Wood-Fired Grill', 'Seafood'];

  const filtered = restaurants.filter((res) => {
    const matchCuisine = selectedCuisine === 'All' || res.cuisine.includes(selectedCuisine);
    const matchSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.cuisine.some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCuisine && matchSearch;
  });

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Estate Gastronomy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-1">
            Artisanal Dining &amp; Culinary Bars
          </h1>
          <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
            Explore refined culinary destinations, wood-fired seasonal tastings, and private dining rooms.
            Book a table in advance or order hand-crafted specialties directly.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-ivory-300 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCuisine === c
                    ? 'bg-forest-800 text-ivory-50 shadow-sm'
                    : 'bg-ivory-200 text-charcoal-700 hover:bg-ivory-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search dishes or culinary styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-charcoal-800 focus:outline-none focus:border-forest-600"
            />
          </div>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-ivory-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-ivory-300">
            <Utensils className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-charcoal-800">No restaurants match your filters</h3>
            <p className="text-xs text-charcoal-500 mt-1">Try resetting the cuisine chip or searching for a different keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((restaurant) => (
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
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-forest-900 shadow-sm">
                    {restaurant.priceRange} • {restaurant.cuisine.join(', ')}
                  </div>
                  <div className="absolute top-4 right-4 bg-forest-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-mango-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                      {restaurant.name}
                    </h2>
                    <p className="text-xs text-charcoal-500 mt-1 italic">{restaurant.tagline}</p>
                    <p className="text-xs text-charcoal-600 mt-3 line-clamp-3 leading-relaxed">
                      {restaurant.description}
                    </p>

                    {/* Features tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {restaurant.features?.map((f: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-ivory-200 text-[11px] font-medium text-charcoal-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-ivory-200 flex items-center justify-between">
                    <div className="text-xs text-charcoal-500">
                      <span className="block font-semibold text-charcoal-800">Dinner Service:</span>
                      <span>{restaurant.openingHours.dinner}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/restaurants/${restaurant.slug}`}
                        className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 text-xs font-bold transition-colors"
                      >
                        Explore Menu
                      </Link>
                      <Link
                        to={`/restaurants/${restaurant.slug}?tab=reservations`}
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
        )}
      </div>
    </div>
  );
};
