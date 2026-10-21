import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../lib/socket';
import { OrderStatuses } from '@haven/shared';
import {
  ChefHat,
  Clock,
  CheckCircle,
  BellRing,
  Utensils,
  BedDouble,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const KitchenDisplayPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const branchId = user?.branchId;
      const data = await api.get<any[]>(`/orders/branch?branchId=${branchId}`);
      // Filter active non-completed orders
      const active = (data || []).filter(
        (o: any) => o.status !== OrderStatuses.COMPLETED && o.status !== OrderStatuses.CANCELLED
      );
      setOrders(active);
    } catch (err) {
      console.error('Failed to load kitchen tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = getSocket();
    if (user?.branchId) {
      socket.emit('join_kitchen', user.branchId);
    }

    const handleNewTicket = (newOrder: any) => {
      setOrders((prev) => [newOrder, ...prev]);
    };

    const handleOrderUpdated = (updatedOrder: any) => {
      setOrders((prev) => {
        if (updatedOrder.status === OrderStatuses.COMPLETED || updatedOrder.status === OrderStatuses.CANCELLED) {
          return prev.filter((o) => o._id !== updatedOrder._id);
        }
        return prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
      });
    };

    socket.on('new_ticket', handleNewTicket);
    socket.on('order_updated', handleOrderUpdated);

    return () => {
      socket.off('new_ticket', handleNewTicket);
      socket.off('order_updated', handleOrderUpdated);
    };
  }, [user]);

  const advanceStatus = async (orderId: string, nextStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order ticket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const newOrders = orders.filter((o) => o.status === OrderStatuses.PENDING);
  const prepOrders = orders.filter((o) => o.status === OrderStatuses.ACCEPTED || o.status === OrderStatuses.PREPARING);
  const readyOrders = orders.filter((o) => o.status === OrderStatuses.READY);

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Hearth Brigade KDS
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Live Kitchen Display System
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time ticket routing across white oak hearth, grill, and cold pantry stations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Socket Connected</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-ivory-200 text-charcoal-700 text-xs font-bold">
            {orders.length} Active Tickets
          </span>
        </div>
      </div>

      {/* 3 Ticket Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: New Tickets */}
        <div className="bg-ivory-200/70 p-4 rounded-3xl border border-ivory-300 flex flex-col min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h3 className="font-serif text-base font-bold text-charcoal-900">New Tickets</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {newOrders.length}
            </span>
          </div>

          <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
            {newOrders.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-charcoal-400">
                No new pending tickets
              </div>
            ) : (
              newOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-5 rounded-2xl border border-blue-200 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-blue-900">{order.orderNumber}</span>
                    {order.orderType === 'ROOM_SERVICE' ? (
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center gap-1">
                        <BedDouble className="w-3 h-3" />
                        <span>Suite {order.roomNumber}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-charcoal-600">
                        {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 py-2 border-y border-ivory-200 text-xs">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between font-semibold text-charcoal-900">
                        <span>{item.quantity}× {item.name}</span>
                        {item.notes && <span className="text-[11px] text-terracotta-600">({item.notes})</span>}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => advanceStatus(order._id, OrderStatuses.PREPARING)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Accept &amp; Fire Ticket
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="bg-ivory-200/70 p-4 rounded-3xl border border-ivory-300 flex flex-col min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="font-serif text-base font-bold text-charcoal-900">Firing on Hearth</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              {prepOrders.length}
            </span>
          </div>

          <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
            {prepOrders.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-charcoal-400">
                No active hearth prep
              </div>
            ) : (
              prepOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-5 rounded-2xl border border-amber-300 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-forest-900">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                      Preparing
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-charcoal-700">
                    {order.orderType === 'ROOM_SERVICE' ? `Room Service Suite ${order.roomNumber}` : `Table ${order.tableNumber || 'Walk-in'}`}
                  </p>

                  <div className="space-y-1.5 py-2 border-y border-ivory-200 text-xs">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between font-bold text-charcoal-900">
                        <span>{item.quantity}× {item.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => advanceStatus(order._id, OrderStatuses.READY)}
                    className="w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Mark Plated &amp; Ready
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Service */}
        <div className="bg-ivory-200/70 p-4 rounded-3xl border border-ivory-300 flex flex-col min-h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h3 className="font-serif text-base font-bold text-charcoal-900">Ready for Service</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {readyOrders.length}
            </span>
          </div>

          <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-charcoal-400">
                All ready tickets served
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-emerald-900">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Plated &amp; Expedited
                    </span>
                  </div>

                  <p className="text-xs font-bold text-forest-900">
                    Destination: {order.orderType === 'ROOM_SERVICE' ? `Room ${order.roomNumber}` : `Table ${order.tableNumber || 'Service'}`}
                  </p>

                  <div className="space-y-1.5 py-2 border-y border-ivory-200 text-xs">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between font-semibold text-charcoal-800">
                        <span>{item.quantity}× {item.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => advanceStatus(order._id, OrderStatuses.COMPLETED)}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Served &amp; Complete Ticket
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
