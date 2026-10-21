import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { OrderTypes, OrderType, PaymentMethods, PaymentMethod } from '@haven/shared';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  UtensilsCrossed,
  BedDouble,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    restaurantId,
    restaurantName,
    orderType,
    tableNumber,
    roomNumber,
    updateQuantity,
    removeItem,
    clearCart,
    setOrderType,
    setTableNumber,
    setRoomNumber,
    subtotal,
    tax,
    serviceCharge,
    total,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || 'Elena Vance');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'elena.vance@example.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (212) 555-0199');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethods.CARD);
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-ivory-200 flex items-center justify-center mx-auto mb-4 text-charcoal-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Your Cart is Empty</h2>
          <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
            Explore our curated Michelin-inspired menus or open-flame specialties to begin an artisanal dining experience.
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-forest-800 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-forest-900 transition-colors"
          >
            <span>Explore Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      setSubmitting(true);
      const res = await api.post<any>('/orders', {
        restaurantId,
        orderType,
        customerName,
        customerEmail,
        customerPhone,
        tableNumber: orderType === OrderTypes.DINE_IN ? tableNumber : undefined,
        roomNumber: orderType === OrderTypes.ROOM_SERVICE ? roomNumber : undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          notes: i.notes,
          selectedModifiers: i.selectedModifiers,
        })),
        paymentMethod,
        notes: orderNotes,
      });

      clearCart();
      navigate(`/orders/${res._id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Checkout &amp; Service
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Review Your Order
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Ordering from <span className="font-semibold text-charcoal-800">{restaurantName}</span>
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List & Order Type */}
          <div className="lg:col-span-7 space-y-6">
            {/* Order Type Selection Pills */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-3">
                Dining Experience / Order Type
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { type: OrderTypes.DINE_IN, label: 'Dine-In', icon: UtensilsCrossed },
                  { type: OrderTypes.ROOM_SERVICE, label: 'Room Service', icon: BedDouble },
                  { type: OrderTypes.TAKEAWAY, label: 'Takeaway', icon: ShoppingBag },
                  { type: OrderTypes.DELIVERY, label: 'Delivery', icon: ArrowRight },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = orderType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setOrderType(opt.type)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-forest-800 text-ivory-50 border-forest-800 shadow-sm'
                          : 'bg-ivory-100 text-charcoal-700 border-ivory-300 hover:bg-ivory-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Location Input */}
              {orderType === OrderTypes.DINE_IN && (
                <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300">
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Table Number (if seated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. T-103 or leave blank for host assignment"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-lg border border-ivory-300 text-xs text-charcoal-900 focus:outline-none"
                  />
                </div>
              )}

              {orderType === OrderTypes.ROOM_SERVICE && (
                <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300">
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Hotel Suite / Room Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 202, 401, PH-1"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-white px-3 py-2 rounded-lg border border-ivory-300 text-xs text-charcoal-900 focus:outline-none"
                  />
                  <p className="text-[10px] text-charcoal-500 mt-1">
                    Room service will be expedited directly to your suite and can be charged to your guest folio.
                  </p>
                </div>
              )}
            </div>

            {/* Cart Items Details List */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Selected Dishes ({items.length})
                </h3>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-ivory-200">
                {items.map((item, index) => (
                  <div key={index} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div>
                        <h4 className="font-serif text-sm font-bold text-charcoal-900 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-forest-800 mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                        {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                          <p className="text-[11px] text-charcoal-500">
                            {item.selectedModifiers.map((m) => `${m.modifierName}: ${m.optionName}`).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-charcoal-400 italic">"{item.notes}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-ivory-100 p-1 rounded-lg border border-ivory-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1 rounded bg-white text-charcoal-700 hover:bg-ivory-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1 rounded bg-white text-charcoal-700 hover:bg-ivory-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-charcoal-900 w-16 text-right">
                        {formatCurrency(item.itemTotal)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-charcoal-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions Input */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
              <label className="block text-xs font-bold text-charcoal-700 mb-2">
                Order Notes &amp; Kitchen Instructions
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special handling, allergy notes, or service preferences..."
                className="w-full p-3 rounded-xl bg-ivory-100 border border-ivory-300 text-xs text-charcoal-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Guest Details & Financial Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-editorial">
              <h3 className="font-serif text-xl font-bold text-charcoal-900 pb-4 border-b border-ivory-200">
                Payment &amp; Delivery
              </h3>

              {/* Guest Details */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t border-ivory-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethods.CARD)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === PaymentMethods.CARD
                        ? 'bg-ivory-200 border-forest-700 text-forest-900'
                        : 'border-ivory-300 text-charcoal-700 hover:bg-ivory-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-forest-700" />
                      <span>Credit Card / Digital Sandbox</span>
                    </span>
                    <span className="text-[10px] text-forest-700 bg-forest-50 px-2 py-0.5 rounded font-mono">
                      Test Mode
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethods.CASH)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === PaymentMethods.CASH
                        ? 'bg-ivory-200 border-forest-700 text-forest-900'
                        : 'border-ivory-300 text-charcoal-700 hover:bg-ivory-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-terracotta-500" />
                      <span>Cash at Counter / Delivery</span>
                    </span>
                  </button>

                  {orderType === OrderTypes.ROOM_SERVICE && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod(PaymentMethods.ROOM_CHARGE)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === PaymentMethods.ROOM_CHARGE
                          ? 'bg-ivory-200 border-forest-700 text-forest-900'
                          : 'border-ivory-300 text-charcoal-700 hover:bg-ivory-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-forest-700" />
                        <span>Charge to Room Folio</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Authoritative Price Calculation Breakdown */}
              <div className="mt-6 pt-4 border-t border-ivory-200 space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-600">
                  <span>Culinary Subtotal:</span>
                  <span className="font-semibold text-charcoal-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Hospitality Tax (8.5%):</span>
                  <span className="font-semibold text-charcoal-900">{formatCurrency(tax)}</span>
                </div>
                {serviceCharge > 0 && (
                  <div className="flex justify-between text-charcoal-600">
                    <span>Service Gratuity (5%):</span>
                    <span className="font-semibold text-charcoal-900">{formatCurrency(serviceCharge)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-ivory-200 flex justify-between text-sm font-bold text-forest-950">
                  <span className="font-serif text-base">Total Amount:</span>
                  <span className="font-serif text-xl text-forest-900">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-editorial transition-all"
              >
                {submitting ? 'Transmitting Ticket to Kitchen...' : `Place Order • ${formatCurrency(total)}`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-charcoal-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Live Kitchen Display Integration Active</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
