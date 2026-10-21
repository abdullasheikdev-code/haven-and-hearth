import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { HousekeepingStatuses, HousekeepingStatus } from '@haven/shared';
import {
  Brush,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const HousekeepingPage: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const fetchRooms = async () => {
    try {
      const data = await api.get<any[]>('/hotels/rooms');
      setRooms(data || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  const updateStatus = async (roomId: string, newStatus: HousekeepingStatus) => {
    try {
      await api.patch(`/hotels/rooms/${roomId}/housekeeping`, {
        housekeepingStatus: newStatus,
      });
      fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to update housekeeping status');
    }
  };

  const filteredRooms = rooms.filter(
    (r) => filterStatus === 'All' || r.housekeepingStatus === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Hotel Services &amp; Sanitations
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Housekeeping Management
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time room sanitization, inspection statuses, and turn-down assignments.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', HousekeepingStatuses.DIRTY, HousekeepingStatuses.IN_PROGRESS, HousekeepingStatuses.CLEAN, HousekeepingStatuses.INSPECTED].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-forest-800 text-ivory-50 shadow-sm'
                  : 'bg-white border border-ivory-300 text-charcoal-700 hover:bg-ivory-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          const isDirty = room.housekeepingStatus === HousekeepingStatuses.DIRTY;
          const isInProgress = room.housekeepingStatus === HousekeepingStatuses.IN_PROGRESS;
          const isClean = room.housekeepingStatus === HousekeepingStatuses.CLEAN;
          const isInspected = room.housekeepingStatus === HousekeepingStatuses.INSPECTED;

          return (
            <div
              key={room._id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between bg-white ${
                isDirty
                  ? 'border-red-300 shadow-sm'
                  : isInProgress
                  ? 'border-amber-300 shadow-sm'
                  : 'border-ivory-300 shadow-soft'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-charcoal-900">
                    Room {room.roomNumber}
                  </span>
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase">
                    Floor {room.floor}
                  </span>
                </div>

                <p className="text-xs text-charcoal-500 mt-0.5">{room.roomTypeId?.name}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isDirty
                        ? 'bg-red-100 text-red-800'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-800'
                        : isClean
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {room.housekeepingStatus}
                  </span>

                  <span className="text-[10px] text-charcoal-400 font-semibold">
                    {room.status === 'OCCUPIED' ? 'Guest In Room' : 'Vacant'}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="mt-6 pt-4 border-t border-ivory-200 flex flex-col gap-1.5">
                {isDirty && (
                  <button
                    onClick={() => updateStatus(room._id, HousekeepingStatuses.IN_PROGRESS)}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                  >
                    Start Cleaning
                  </button>
                )}

                {isInProgress && (
                  <button
                    onClick={() => updateStatus(room._id, HousekeepingStatuses.CLEAN)}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    Mark Clean
                  </button>
                )}

                {isClean && (
                  <button
                    onClick={() => updateStatus(room._id, HousekeepingStatuses.INSPECTED)}
                    className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors"
                  >
                    Supervisor Inspect
                  </button>
                )}

                {isInspected && (
                  <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-purple-800 bg-purple-50 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Inspected &amp; Pristine</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
