import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { HotelLuggageIllustration } from '../../components/illustrations/HotelLuggageIllustration';
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Check,
  BedDouble,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  X,
} from 'lucide-react';

export const HotelDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState<any>(null);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Availability Search Dates
  const [checkInDate, setCheckInDate] = useState('2026-10-23');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-26');
  const [guestsCount, setGuestsCount] = useState(2);
  const [availabilityResults, setAvailabilityResults] = useState<any[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Selected Room Type for Booking
  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [guestName, setGuestName] = useState(user?.name || 'Elena Vance');
  const [guestEmail, setGuestEmail] = useState(user?.email || 'elena.vance@example.com');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (212) 555-0199');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await api.get<any>(`/hotels/${slug}`);
        setHotel(data.hotel);
        setRoomTypes(data.roomTypes || []);
      } catch (err) {
        console.error('Failed to load hotel:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [slug]);

  // Query live room availability whenever dates change
  useEffect(() => {
    if (hotel) {
      const checkAvailability = async () => {
        try {
          setAvailabilityLoading(true);
          const data = await api.get<any[]>(
            `/hotels/availability?hotelId=${hotel._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guests=${guestsCount}`
          );
          setAvailabilityResults(data || []);
        } catch (err) {
          console.error('Failed to query room availability:', err);
        } finally {
          setAvailabilityLoading(false);
        }
      };
      checkAvailability();
    }
  }, [hotel, checkInDate, checkOutDate, guestsCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center text-center p-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Hotel Not Found</h2>
          <button
            onClick={() => navigate('/hotels')}
            className="mt-4 px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomType) return;

    try {
      setBookingInProgress(true);
      const res = await api.post('/hotels/bookings', {
        hotelId: hotel._id,
        roomTypeId: selectedRoomType._id,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        numberOfGuests: Number(guestsCount),
        specialRequests,
      });

      setConfirmedBooking(res);
      setSelectedRoomType(null);
    } catch (err: any) {
      alert(err.message || 'Failed to complete room reservation.');
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 pb-24 text-left">
      {/* Hotel Hero Banner */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          src={hotel.coverImage}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/40 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-forest-900 text-mango-300 text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>5-Star Luxury Boutique</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold">{hotel.name}</h1>
          <p className="text-sm sm:text-base text-ivory-200 mt-2 max-w-2xl font-light italic">
            "{hotel.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-ivory-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
              <span>428 Mercer Street, New York, NY 10013</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Check-in: {hotel.checkInTime} • Check-out: {hotel.checkOutTime}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Availability Search Bar Widget */}
        <div className="bg-white p-6 rounded-3xl shadow-editorial border border-ivory-300 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                Check-In Date
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-ivory-100 border border-ivory-300">
                <Calendar className="w-4 h-4 text-forest-700 shrink-0" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-charcoal-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                Check-Out Date
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-ivory-100 border border-ivory-300">
                <Calendar className="w-4 h-4 text-forest-700 shrink-0" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-charcoal-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                Number of Guests
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-ivory-100 border border-ivory-300">
                <Users className="w-4 h-4 text-forest-700 shrink-0" />
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-semibold text-charcoal-900 focus:outline-none"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-charcoal-500 block mb-1">
                {availabilityLoading ? 'Querying live inventory...' : 'Server-verified inventory active'}
              </span>
              <div className="text-xs font-bold text-forest-800 bg-forest-50 border border-forest-200 py-2.5 px-4 rounded-xl text-center">
                Instant Confirmation
              </div>
            </div>
          </div>
        </div>

        {/* Confirmed Booking Banner */}
        {confirmedBooking && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-12 animate-in zoom-in-95 text-center">
            <HotelLuggageIllustration className="w-36 h-36 mx-auto mb-3" />
            <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold uppercase">
              Stay Confirmed
            </span>
            <h2 className="font-serif text-3xl font-bold text-emerald-950 mt-2">
              Your Suite Reservation is Booked
            </h2>
            <p className="text-xs text-emerald-800 mt-1">
              Confirmation Ref: <span className="font-mono font-bold">{confirmedBooking.bookingNumber}</span> • Room {confirmedBooking.roomNumber}
            </p>

            <div className="my-6 p-4 rounded-2xl bg-white border border-emerald-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Guest Name:</span>
                <span className="font-semibold text-charcoal-900">{confirmedBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Dates:</span>
                <span className="font-semibold text-charcoal-900">
                  {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.numberOfNights} nights)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Total Billed:</span>
                <span className="font-bold text-forest-800">{formatCurrency(confirmedBooking.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/account/bookings')}
                className="px-5 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-bold"
              >
                View in Account
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-white text-charcoal-800 text-xs font-bold border border-emerald-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Available Room Types Grid */}
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              Suites &amp; Accommodations
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              All suites include dedicated butler access, 24/7 in-room dining, and priority seating at L'Étoile Brasserie.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {availabilityResults.map((result) => {
              const rt = result.roomType;
              return (
                <div
                  key={rt._id}
                  className="bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-soft hover:shadow-editorial transition-all flex flex-col justify-between"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={rt.images?.[0] || hotel.coverImage}
                      alt={rt.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-forest-950/80 backdrop-blur-sm text-ivory-100 text-xs px-3 py-1 rounded-lg">
                      {rt.sizeSqFt} sq ft • {rt.bedConfig}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                          Up to {rt.maxGuests} Guests
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {result.availableCount} rooms left
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-charcoal-900 mt-1">
                        {rt.name}
                      </h3>
                      <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                        {rt.description}
                      </p>

                      <div className="mt-4 space-y-1.5">
                        {rt.amenities?.map((amenity: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-charcoal-700">
                            <Check className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-ivory-200 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-forest-900">
                          {formatCurrency(rt.basePricePerNight)}
                        </span>
                        <span className="text-xs text-charcoal-500"> / night</span>
                      </div>

                      <button
                        onClick={() => setSelectedRoomType(rt)}
                        disabled={!result.isAvailable}
                        className="px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
                      >
                        {result.isAvailable ? 'Book Suite' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Form Dialog Modal */}
      {selectedRoomType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-editorial border border-ivory-300 animate-in fade-in zoom-in-95 text-left p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600">
                  Confirm Stay
                </span>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  {selectedRoomType.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRoomType(null)}
                className="p-1 rounded-full text-charcoal-400 hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="mt-4 space-y-4">
              <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Stay Duration:</span>
                  <span className="font-semibold text-charcoal-800">
                    {checkInDate} to {checkOutDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Nightly Rate:</span>
                  <span className="font-semibold text-charcoal-800">
                    {formatCurrency(selectedRoomType.basePricePerNight)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Estimated Total (with 12% tax):</span>
                  <span className="font-bold text-forest-800">
                    {formatCurrency(selectedRoomType.basePricePerNight * 3 * 1.12)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                  Special In-Suite Requests
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Feather-free pillows, late check-in, champagne on arrival..."
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={bookingInProgress}
                className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                {bookingInProgress ? 'Securing Suite...' : 'Confirm Stay Reservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
