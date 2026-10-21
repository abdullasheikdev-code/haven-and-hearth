import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { BedDouble, Calendar, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const CustomerBookingsPage: React.FC = () => {
  const [hotelBookings, setHotelBookings] = useState<any[]>([]);
  const [tableReservations, setTableReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, reservations] = await Promise.all([
          api.get<any[]>('/hotels/customer/bookings'),
          api.get<any[]>('/reservations/customer'),
        ]);
        setHotelBookings(bookings || []);
        setTableReservations(reservations || []);
      } catch (err) {
        console.error('Failed to load customer bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100 py-12 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Account Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            My Stays &amp; Table Reservations
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Manage your boutique hotel suite stays and dining reservations across the estate.
          </p>
        </div>

        {/* Section 1: Boutique Hotel Stays */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-forest-800" />
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Hotel Suite Stays</h2>
          </div>

          {hotelBookings.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-ivory-300 text-center text-xs text-charcoal-500">
              No hotel stay reservations found.
            </div>
          ) : (
            <div className="space-y-4">
              {hotelBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-forest-900">{b.bookingNumber}</span>
                      <Badge variant={b.status === 'CHECKED_IN' ? 'success' : 'active'}>
                        {b.status}
                      </Badge>
                      <span className="text-xs text-charcoal-600 font-medium">Room {b.roomNumber}</span>
                    </div>
                    <p className="font-serif text-base font-bold text-charcoal-900">
                      {b.roomTypeId?.name || 'Suite'}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {b.checkInDate} to {b.checkOutDate} ({b.numberOfNights} nights) • {b.numberOfGuests} Guests
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-forest-900">
                      {formatCurrency(b.totalAmount)}
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-semibold">
                      {b.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Table Reservations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-terracotta-600" />
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Dining Table Bookings</h2>
          </div>

          {tableReservations.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-ivory-300 text-center text-xs text-charcoal-500">
              No restaurant table reservations found.
            </div>
          ) : (
            <div className="space-y-4">
              {tableReservations.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-forest-900">{r.reservationNumber}</span>
                      <Badge variant={r.status === 'CONFIRMED' ? 'success' : 'neutral'}>
                        {r.status}
                      </Badge>
                      {r.tableNumber && (
                        <span className="text-xs font-semibold text-terracotta-600">Table {r.tableNumber}</span>
                      )}
                    </div>
                    <p className="font-serif text-base font-bold text-charcoal-900">
                      {r.restaurantId?.name || "L'Étoile Brasserie"}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {r.reservationDate} at {r.timeSlot} • {r.partySize} Guests
                    </p>
                    {r.specialRequests && (
                      <p className="text-[11px] text-charcoal-400 italic">"{r.specialRequests}"</p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-forest-800 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200">
                      Reserved Seating
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
