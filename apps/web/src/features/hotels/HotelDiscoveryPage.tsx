import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Star, MapPin, Calendar, BedDouble, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const HotelDiscoveryPage: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await api.get<any[]>('/hotels');
        setHotels(data || []);
      } catch (err) {
        console.error('Failed to load hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header Breadcrumb */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Intimate Residences
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-1">
            Boutique Hotels &amp; Suites
          </h1>
          <p className="text-sm text-charcoal-600 mt-2 max-w-2xl leading-relaxed">
            Quiet luxury, bespoke concierge service, and connected access to Michelin-level estate dining and 24/7 in-room dining services.
          </p>
        </div>

        {/* Hotels List */}
        {loading ? (
          <div className="h-96 rounded-3xl bg-ivory-200 animate-pulse" />
        ) : (
          <div className="space-y-12">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-soft grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-6 relative h-80 lg:h-auto overflow-hidden group">
                  <img
                    src={hotel.coverImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-forest-900/90 backdrop-blur-sm text-mango-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5-Star Luxury Sanctuary</span>
                  </div>
                </div>

                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-charcoal-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                      <span>Manhattan Flagship Estate</span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-charcoal-900">{hotel.name}</h2>
                    <p className="text-xs text-charcoal-500 mt-1 italic">{hotel.tagline}</p>
                    <p className="text-xs sm:text-sm text-charcoal-600 mt-4 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Amenities pills */}
                    <div className="mt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
                        Sanctuary Inclusions
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-700">
                        {hotel.amenities?.map((a: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest-700"></span>
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-ivory-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-charcoal-500 block">Starting From</span>
                      <span className="font-serif text-2xl font-bold text-forest-900">$360</span>
                      <span className="text-xs text-charcoal-500"> / night</span>
                    </div>

                    <Link
                      to={`/hotels/${hotel.slug}`}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-colors text-center"
                    >
                      Explore Room Types &amp; Dates
                    </Link>
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
