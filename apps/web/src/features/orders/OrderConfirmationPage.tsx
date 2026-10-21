import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import { formatCurrency } from '../../lib/utils';
import { OrderStatuses } from '@haven/shared';
import {
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  ChefHat,
  ShoppingBag,
  BellRing,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Listen for live real-time status updates via Socket.IO!
    const socket = getSocket();
    const handleOrderUpdate = (updatedOrder: any) => {
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
      }
    };

    socket.on('order_updated', handleOrderUpdate);

    return () => {
      socket.off('order_updated', handleOrderUpdate);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center text-center p-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Order Not Found</h2>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { status: OrderStatuses.PENDING, label: 'Order Transmitted', icon: Clock },
    { status: OrderStatuses.ACCEPTED, label: 'Kitchen Accepted', icon: UtensilsCrossed },
    { status: OrderStatuses.PREPARING, label: 'Firing on Hearth', icon: ChefHat },
    { status: OrderStatuses.READY, label: 'Ready for Service', icon: BellRing },
    { status: OrderStatuses.COMPLETED, label: 'Served & Enjoyed', icon: CheckCircle2 },
  ];

  const statusOrder = [
    OrderStatuses.PENDING,
    OrderStatuses.ACCEPTED,
    OrderStatuses.PREPARING,
    OrderStatuses.READY,
    OrderStatuses.COMPLETED,
  ];

  const currentStepIndex = statusOrder.indexOf(order.status);

  return (
    <div className="min-h-screen bg-ivory-100 py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </Link>

        {/* Live Status Header */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-ivory-300 shadow-editorial mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-forest-800 text-mango-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>

          <span className="px-3 py-1 rounded-full bg-forest-50 text-forest-800 border border-forest-200 text-xs font-bold uppercase tracking-wider">
            Order Ref: {order.orderNumber}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-3">
            {order.status === OrderStatuses.READY
              ? 'Your Order is Plated & Ready!'
              : order.status === OrderStatuses.PREPARING
              ? 'Our Brigade is Crafting Your Meal'
              : 'Kitchen Ticket Transmitted'}
          </h1>

          <p className="text-xs text-charcoal-500 mt-2 max-w-lg mx-auto">
            {order.orderType === 'ROOM_SERVICE'
              ? `Expediting to Suite ${order.roomNumber}`
              : order.orderType === 'DINE_IN'
              ? `Assigned to Table ${order.tableNumber || 'Seated'}`
              : 'Preparing for pickup/delivery'}
          </p>

          {/* Real-time Order Progress Steps */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={s.status} className="flex flex-col items-center text-center group">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-terracotta-500 text-white shadow-md scale-110'
                          : isPassed
                          ? 'bg-forest-800 text-ivory-50'
                          : 'bg-ivory-200 text-charcoal-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold mt-2 leading-tight ${
                        isPassed ? 'text-charcoal-900' : 'text-charcoal-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Receipt Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-soft">
          <h2 className="font-serif text-xl font-bold text-charcoal-900 pb-4 border-b border-ivory-200">
            Order Receipt &amp; Summary
          </h2>

          <div className="py-4 space-y-4 divide-y divide-ivory-200">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-charcoal-900">{item.name}</span>
                  <span className="text-charcoal-500 ml-2">× {item.quantity}</span>
                  {item.notes && <p className="text-[11px] text-charcoal-400 italic">"{item.notes}"</p>}
                </div>
                <span className="font-semibold text-charcoal-800">{formatCurrency(item.itemTotal)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-ivory-200 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Hospitality Tax:</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            {order.serviceCharge > 0 && (
              <div className="flex justify-between text-charcoal-600">
                <span>Service Gratuity:</span>
                <span>{formatCurrency(order.serviceCharge)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-ivory-200 flex justify-between text-sm font-bold text-forest-950">
              <span>Total Paid ({order.paymentMethod}):</span>
              <span className="font-serif text-lg text-forest-900">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
