import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { PaymentMethods } from '@haven/shared';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
  BedDouble,
  Printer,
  X,
  CheckCircle,
  Percent,
} from 'lucide-react';

export const PosTerminalPage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Active POS Order Bill State
  const [cart, setCart] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('Walk-in Counter');
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(PaymentMethods.CASH);
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  useEffect(() => {
    const fetchPosData = async () => {
      try {
        const branchId = user?.branchId;
        const data = await api.get<any>(`/pos/context?branchId=${branchId}`);
        setCategories(['All', ...(data.categories || [])]);
        setMenuItems(data.menuItems || []);
        setTables(data.tables || []);
      } catch (err) {
        console.error('Failed to load POS context:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosData();
  }, [user]);

  const filteredItems = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (item: any) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === item._id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        next[idx].itemTotal = next[idx].price * next[idx].quantity;
        return next;
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          itemTotal: item.price,
        },
      ];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      next[index].itemTotal = next[index].price * quantity;
      return next;
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const taxable = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxable * 0.085 * 100) / 100;
  const serviceCharge = selectedTable !== 'Walk-in Counter' ? Math.round(taxable * 0.05 * 100) / 100 : 0;
  const total = Math.round((taxable + tax + serviceCharge) * 100) / 100;

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      const res = await api.post<any>('/pos/checkout', {
        branchId: user?.branchId,
        tableNumber: selectedTable !== 'Walk-in Counter' ? selectedTable : undefined,
        customerName,
        items: cart,
        discountPercent,
        paymentMethod,
        amountTendered: Number(amountTendered) || total,
      });

      setReceiptData(res.receipt);
      setCart([]);
      setDiscountPercent(0);
      setCheckoutModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to process POS checkout');
    } finally {
      setSubmitting(false);
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
    <div className="min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 text-left relative">
      {/* Mobile Floating Bill Trigger */}
      {cart.length > 0 && (
        <a
          href="#pos-bill"
          className="lg:hidden fixed bottom-20 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest-900 text-ivory-50 shadow-editorial border border-forest-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-2"
        >
          <Receipt className="w-4 h-4 text-mango-300" />
          <span>Ticket ({cart.length} • {formatCurrency(total)})</span>
        </a>
      )}

      {/* Left Column: Menu Items Catalog */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-ivory-300 shadow-soft overflow-hidden min-h-[400px]">
        {/* Category bar & Search */}
        <div className="p-4 border-b border-ivory-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-forest-800 text-ivory-50 shadow-sm'
                    : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <button
              key={item._id}
              onClick={() => addToCart(item)}
              className="p-3 rounded-2xl border border-ivory-300 hover:border-forest-600 hover:shadow-soft bg-ivory-50 text-left transition-all flex flex-col justify-between group active:scale-95"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 block">
                  {item.category}
                </span>
                <h4 className="font-serif text-sm font-bold text-charcoal-900 group-hover:text-forest-900 line-clamp-2 mt-0.5">
                  {item.name}
                </h4>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-ivory-200">
                <span className="font-mono font-bold text-xs text-forest-900">
                  {formatCurrency(item.price)}
                </span>
                <span className="w-6 h-6 rounded-lg bg-forest-800 text-ivory-100 flex items-center justify-center text-xs font-bold shadow-sm">
                  +
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Active Bill & Checkout Register */}
      <div id="pos-bill" className="w-full lg:w-96 flex flex-col bg-white rounded-3xl border border-ivory-300 shadow-editorial overflow-hidden scroll-mt-20">
        {/* Bill Header */}
        <div className="p-4 border-b border-ivory-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-base font-bold text-charcoal-900">Current Register Bill</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-[11px] font-bold text-red-600 hover:text-red-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Table / Location Selector */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-charcoal-500 uppercase">Seating</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full p-1.5 rounded-lg bg-ivory-100 border border-ivory-300 font-semibold text-charcoal-900 focus:outline-none text-xs"
              >
                <option value="Walk-in Counter">Walk-in Counter</option>
                {tables.map((t) => (
                  <option key={t._id} value={t.tableNumber}>
                    Table {t.tableNumber} ({t.capacity}p)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-charcoal-500 uppercase">Customer</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-1.5 rounded-lg bg-ivory-100 border border-ivory-300 font-semibold text-charcoal-900 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Cart Item Lines */}
        <div className="flex-1 p-4 overflow-y-auto divide-y divide-ivory-200">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-charcoal-400">
              <Receipt className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">Tap menu items to add to ticket</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div className="max-w-[160px]">
                  <p className="font-bold text-charcoal-900 leading-tight truncate">{item.name}</p>
                  <p className="text-[11px] text-charcoal-500">{formatCurrency(item.price)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-ivory-100 p-0.5 rounded-lg border border-ivory-300">
                    <button
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                      className="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-charcoal-700"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                      className="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-charcoal-700"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono font-bold w-14 text-right">
                    {formatCurrency(item.itemTotal)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Quick Discounts */}
        <div className="p-4 bg-ivory-50 border-t border-ivory-200 space-y-2 text-xs">
          {/* Quick discount chips */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] font-bold text-charcoal-500 uppercase mr-1">Discount:</span>
            {[0, 5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setDiscountPercent(pct)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  discountPercent === pct
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-ivory-200 text-charcoal-700 hover:bg-ivory-300'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex justify-between text-charcoal-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-charcoal-900">{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-terracotta-600 font-semibold">
              <span>Discount ({discountPercent}%):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-charcoal-600">
            <span>Tax (8.5%):</span>
            <span className="font-semibold text-charcoal-900">{formatCurrency(tax)}</span>
          </div>
          {serviceCharge > 0 && (
            <div className="flex justify-between text-charcoal-600">
              <span>Service Gratuity (5%):</span>
              <span className="font-semibold text-charcoal-900">{formatCurrency(serviceCharge)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-ivory-200 flex justify-between text-base font-bold text-charcoal-900">
            <span className="font-serif">Total Due:</span>
            <span className="font-serif text-lg text-forest-900">{formatCurrency(total)}</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => {
              setAmountTendered(total.toString());
              setCheckoutModalOpen(true);
            }}
            className="w-full py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            Pay &amp; Settle • {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* POS Checkout & Tender Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-editorial border border-ivory-300 animate-in zoom-in-95 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Process Settlement</h3>
              <button onClick={() => setCheckoutModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="mt-4 space-y-4">
              <div className="p-3 bg-ivory-100 rounded-xl text-center">
                <span className="text-[10px] font-bold text-charcoal-500 uppercase block">Total Due</span>
                <span className="font-serif text-3xl font-bold text-forest-900">{formatCurrency(total)}</span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: PaymentMethods.CASH, label: 'Cash', icon: Banknote },
                  { id: PaymentMethods.CARD, label: 'Card', icon: CreditCard },
                  { id: PaymentMethods.ROOM_CHARGE, label: 'Room', icon: BedDouble },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-forest-800 text-ivory-50 border-forest-800 shadow-sm'
                          : 'bg-ivory-100 border-ivory-300 text-charcoal-700 hover:bg-ivory-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cash tendered & change calculation */}
              {paymentMethod === PaymentMethods.CASH && (
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Amount Tendered ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-ivory-100 border border-ivory-300 text-sm font-bold text-charcoal-900 focus:outline-none"
                  />
                  {Number(amountTendered) > total && (
                    <p className="text-xs font-bold text-emerald-700 mt-1">
                      Change Due: {formatCurrency(Number(amountTendered) - total)}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                {submitting ? 'Recording Transaction...' : 'Complete & Print Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-editorial border border-ivory-300 animate-in zoom-in-95 text-left font-mono text-xs">
            <div className="text-center pb-4 border-b border-dashed border-charcoal-300 space-y-1">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 font-sans">
                Haven &amp; Hearth Brasserie
              </h3>
              <p className="text-[11px] text-charcoal-500 font-sans">428 Mercer Street, New York</p>
              <p className="text-[10px] text-charcoal-400">{receiptData.date}</p>
              <p className="text-xs font-bold text-charcoal-800 mt-2">
                Order #{receiptData.orderNumber} • {receiptData.tableNumber}
              </p>
            </div>

            <div className="py-4 space-y-1.5 divide-y divide-dashed divide-charcoal-200">
              {receiptData.items?.map((i: any, idx: number) => (
                <div key={idx} className="pt-1.5 first:pt-0 flex justify-between">
                  <span>{i.quantity}× {i.name}</span>
                  <span>{formatCurrency(i.itemTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dashed border-charcoal-300 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(receiptData.subtotal)}</span>
              </div>
              {receiptData.discount > 0 && (
                <div className="flex justify-between text-terracotta-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(receiptData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(receiptData.tax)}</span>
              </div>
              {receiptData.serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{formatCurrency(receiptData.serviceCharge)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-charcoal-300 font-sans">
                <span>TOTAL:</span>
                <span>{formatCurrency(receiptData.total)}</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] text-charcoal-600">
                <span>Tendered ({receiptData.paymentMethod}):</span>
                <span>{formatCurrency(receiptData.amountTendered)}</span>
              </div>
              {receiptData.changeDue > 0 && (
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Change:</span>
                  <span>{formatCurrency(receiptData.changeDue)}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-forest-800 text-ivory-50 font-sans text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setReceiptData(null)}
                className="px-4 py-2.5 rounded-xl bg-ivory-200 text-charcoal-800 font-sans text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
