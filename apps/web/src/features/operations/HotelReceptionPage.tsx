import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { BookingStatuses } from '@haven/shared';
import {
  BedDouble,
  UserCheck,
  LogOut,
  Receipt,
  Search,
  Calendar,
  CheckCircle,
  X,
  CreditCard,
} from 'lucide-react';

export const HotelReceptionPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolioBooking, setSelectedFolioBooking] = useState<any>(null);

  const fetchBookings = async () => {
    try {
      const data = await api.get<any[]>('/hotels/bookings');
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCheckIn = async (bookingId: string) => {
    try {
      await api.patch(`/hotels/bookings/${bookingId}/checkin`);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to check in guest');
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    try {
      await api.patch(`/hotels/bookings/${bookingId}/checkout`);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to check out guest');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Front Desk Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Arrivals &amp; Guest Folios
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Check-in arrivals, process departures, and inspect guest folios with room service charges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-forest-800 text-ivory-50 text-xs font-bold shadow-soft">
            {bookings.filter((b) => b.status === BookingStatuses.CHECKED_IN).length} In-House Guests
          </span>
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 border-b border-ivory-200 text-charcoal-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Booking Ref</th>
                <th className="py-4 px-6">Guest Name</th>
                <th className="py-4 px-6">Suite &amp; Room</th>
                <th className="py-4 px-6">Dates</th>
                <th className="py-4 px-6">Folio Balance</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {bookings.map((booking) => {
                const isCheckedIn = booking.status === BookingStatuses.CHECKED_IN;
                const isConfirmed = booking.status === BookingStatuses.CONFIRMED;

                return (
                  <tr key={booking._id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-forest-900">
                      {booking.bookingNumber}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-charcoal-900 block">{booking.guestName}</span>
                      <span className="text-[11px] text-charcoal-400">{booking.guestEmail}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-charcoal-800 block">
                        {booking.roomTypeId?.name || 'Suite'}
                      </span>
                      <span className="text-[11px] font-bold text-terracotta-600">
                        Room {booking.roomNumber || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-charcoal-600">
                      <span>{booking.checkInDate}</span>
                      <span className="mx-1">→</span>
                      <span>{booking.checkOutDate}</span>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-forest-900">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          isCheckedIn
                            ? 'bg-emerald-100 text-emerald-800'
                            : isConfirmed
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-ivory-300 text-charcoal-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedFolioBooking(booking)}
                        className="px-3 py-1.5 rounded-lg bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 font-bold text-[11px] transition-colors"
                      >
                        Folio ({booking.folioCharges?.length || 0})
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCheckIn(booking._id)}
                          className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-ivory-50 font-bold text-[11px] transition-colors"
                        >
                          Check In
                        </button>
                      )}

                      {isCheckedIn && (
                        <button
                          onClick={() => handleCheckOut(booking._id)}
                          className="px-3 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-[11px] transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Folio Modal */}
      {selectedFolioBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-editorial border border-ivory-300 animate-in zoom-in-95 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                  Guest Folio #{selectedFolioBooking.bookingNumber}
                </span>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  {selectedFolioBooking.guestName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFolioBooking(null)}
                className="p-1 rounded-full text-charcoal-400 hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto divide-y divide-ivory-200 text-xs">
              {selectedFolioBooking.folioCharges?.map((charge: any, idx: number) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-charcoal-900 block">{charge.description}</span>
                    <span className="text-[10px] text-charcoal-500 font-mono">
                      {charge.type} • {new Date(charge.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-forest-900">
                    {formatCurrency(charge.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-ivory-200 flex items-center justify-between">
              <span className="font-serif text-base font-bold text-charcoal-900">Total Billed Folio:</span>
              <span className="font-serif text-2xl font-bold text-forest-900">
                {formatCurrency(selectedFolioBooking.totalAmount)}
              </span>
            </div>

            <button
              onClick={() => setSelectedFolioBooking(null)}
              className="mt-6 w-full py-3 rounded-xl bg-forest-800 text-ivory-50 text-xs font-bold uppercase tracking-wider"
            >
              Close Folio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
