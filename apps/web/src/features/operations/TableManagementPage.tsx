import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { TableStatuses } from '@haven/shared';
import {
  Grid,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Utensils,
  Plus,
} from 'lucide-react';

export const TableManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    try {
      const branchId = user?.branchId;
      const data = await api.get<any>(`/pos/context?branchId=${branchId}`);
      setTables(data.tables || []);
    } catch (err) {
      console.error('Failed to load tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [user]);

  const updateTableStatus = async (tableId: string, status: string) => {
    try {
      // Direct optimistic update
      setTables((prev) =>
        prev.map((t) => (t._id === tableId ? { ...t, status } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const zones = Array.from(new Set(tables.map((t) => t.floorZone || 'Main Dining Room')));

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Host &amp; Floor Operations
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Visual Dining Floor Plan
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time table seating states, capacity, and current active order tickets.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Available</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Occupied</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Reserved</span>
          </span>
        </div>
      </div>

      {/* Tables Floor Zones */}
      {zones.map((zone) => {
        const zoneTables = tables.filter((t) => (t.floorZone || 'Main Dining Room') === zone);
        return (
          <div key={zone} className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">{zone}</h2>
              <span className="text-xs font-semibold text-charcoal-500">
                {zoneTables.length} Tables
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {zoneTables.map((table) => {
                const isOccupied = table.status === TableStatuses.OCCUPIED;
                const isReserved = table.status === TableStatuses.RESERVED;
                const isAvailable = table.status === TableStatuses.AVAILABLE;

                return (
                  <div
                    key={table._id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isOccupied
                        ? 'bg-red-50/80 border-red-200 shadow-sm'
                        : isReserved
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-emerald-50/60 border-emerald-200 hover:shadow-soft'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-lg text-charcoal-900">
                          {table.tableNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-charcoal-200 text-charcoal-700">
                          {table.capacity}p
                        </span>
                      </div>

                      <span
                        className={`inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-bold ${
                          isOccupied
                            ? 'bg-red-200 text-red-900'
                            : isReserved
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        {table.status}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-charcoal-200/40 flex items-center justify-between gap-1">
                      {isOccupied ? (
                        <button
                          onClick={() => updateTableStatus(table._id, TableStatuses.AVAILABLE)}
                          className="w-full py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-[11px] font-bold hover:bg-red-100 transition-colors"
                        >
                          Clear &amp; Reset
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTableStatus(table._id, TableStatuses.OCCUPIED)}
                          className="w-full py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
                        >
                          Seat Guests
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
