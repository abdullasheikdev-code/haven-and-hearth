import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { ShoppingBag, ArrowRight, UtensilsCrossed, Clock } from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get<any[]>('/orders/customer');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100 py-12 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Account Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            Dining &amp; Room Service History
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            All your placed food and beverage orders across Haven &amp; Hearth estate restaurants.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-ivory-200 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-ivory-300 text-center">
            <ShoppingBag className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-charcoal-800">No Past Orders Found</h3>
            <p className="text-xs text-charcoal-500 mt-1">Explore our restaurants to order artisanal dishes.</p>
            <Link
              to="/restaurants"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-forest-800 text-ivory-50 rounded-xl text-xs font-bold"
            >
              <span>Explore Menus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-forest-900">{order.orderNumber}</span>
                    <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'PREPARING' ? 'warning' : 'active'}>
                      {order.status}
                    </Badge>
                    <span className="text-[11px] text-charcoal-400">
                      {order.orderType === 'ROOM_SERVICE' ? `Suite ${order.roomNumber}` : order.orderType}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-700">
                    {order.items?.map((i: any) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-charcoal-400">
                    Placed on {new Date(order.placedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-ivory-200">
                  <span className="font-serif text-lg font-bold text-charcoal-900">
                    {formatCurrency(order.total)}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 text-xs font-bold transition-colors"
                  >
                    View Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
