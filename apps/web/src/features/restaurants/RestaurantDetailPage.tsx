import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { ReservationSuccessIllustration } from '../../components/illustrations/ReservationSuccessIllustration';
import {
  Star,
  MapPin,
  Clock,
  UtensilsCrossed,
  Calendar,
  Users,
  Plus,
  Minus,
  CheckCircle,
  X,
  Sparkles,
  ShoppingBag,
  Info,
} from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'menu' | 'reservations'
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations'>(
    searchParams.get('tab') === 'reservations' || searchParams.get('book') === 'true'
      ? 'reservations'
      : 'menu'
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Item Customization Modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, { optionName: string; price: number }>>({});
  const [itemNotes, setItemNotes] = useState('');

  // Table Reservation State
  const [resDate, setResDate] = useState('2026-10-22');
  const [resPartySize, setResPartySize] = useState(2);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Booking Form State
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (212) 555-0199');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await api.get<any>(`/restaurants/${slug}`);
        setRestaurant(data.restaurant);
        setMenuItems(data.menuItems || []);
        setTables(data.tables || []);
      } catch (err) {
        console.error('Failed to load restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  // Query table slot availability when date or party size changes
  useEffect(() => {
    if (restaurant && activeTab === 'reservations') {
      const fetchSlots = async () => {
        try {
          setSlotsLoading(true);
          const data = await api.get<any>(
            `/reservations/availability?restaurantId=${restaurant._id}&date=${resDate}&partySize=${resPartySize}`
          );
          setAvailableSlots(data.slots || []);
          if (data.slots && data.slots.length > 0) {
            const firstAvailable = data.slots.find((s: any) => s.available);
            setSelectedSlot(firstAvailable ? firstAvailable.timeSlot : null);
          }
        } catch (err) {
          console.error('Failed to check slots:', err);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchSlots();
    }
  }, [restaurant, activeTab, resDate, resPartySize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center text-center p-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Restaurant Not Found</h2>
          <button
            onClick={() => navigate('/restaurants')}
            className="mt-4 px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(menuItems.map((m) => m.category)))];
  const filteredItems = menuItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleOpenItemModal = (item: any) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setItemNotes('');
    const defaultMods: Record<string, { optionName: string; price: number }> = {};
    if (item.modifiers) {
      for (const mod of item.modifiers) {
        if (mod.options.length > 0) {
          defaultMods[mod.name] = {
            optionName: mod.options[0].name,
            price: mod.options[0].price,
          };
        }
      }
    }
    setSelectedModifiers(defaultMods);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    let unitPrice = selectedItem.price;
    const modifiersList = Object.entries(selectedModifiers).map(([modifierName, opt]) => {
      unitPrice += opt.price;
      return {
        modifierName,
        optionName: opt.optionName,
        price: opt.price,
      };
    });

    addItem(
      {
        menuItemId: selectedItem._id,
        name: selectedItem.name,
        price: unitPrice,
        quantity: itemQuantity,
        notes: itemNotes,
        imageUrl: selectedItem.imageUrl,
        selectedModifiers: modifiersList,
      },
      restaurant._id,
      restaurant.name
    );

    setSelectedItem(null);
  };

  const handleReserveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select an available dining time slot.');
      return;
    }

    try {
      setSubmittingBooking(true);
      const res = await api.post('/reservations', {
        restaurantId: restaurant._id,
        customerName: guestName,
        customerEmail: guestEmail,
        customerPhone: guestPhone,
        partySize: Number(resPartySize),
        reservationDate: resDate,
        timeSlot: selectedSlot,
        specialRequests,
      });

      setConfirmedReservation(res);
    } catch (err: any) {
      alert(err.message || 'Failed to confirm table booking.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 pb-24">
      {/* Editorial Restaurant Hero Banner */}
      <div className="relative h-96 lg:h-[450px] w-full overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/40 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-left">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-terracotta-500 text-xs font-bold tracking-wide uppercase">
              {restaurant.priceRange} • {restaurant.cuisine.join(', ')}
            </span>
            <span className="px-3 py-1 rounded-full bg-forest-800/80 backdrop-blur-sm text-xs font-bold text-mango-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{restaurant.rating} ({restaurant.reviewCount} Reviews)</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {restaurant.name}
          </h1>
          <p className="text-sm sm:text-base text-ivory-200 mt-2 max-w-2xl font-light italic">
            "{restaurant.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-ivory-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
              <span>428 Mercer Street, New York, NY</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Dinner: {restaurant.openingHours.dinner}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-left">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-ivory-300 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-forest-800 text-ivory-50 shadow-soft'
                : 'text-charcoal-600 hover:bg-ivory-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-mango-400" />
            <span>A La Carte Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif text-sm font-bold transition-all ${
              activeTab === 'reservations'
                ? 'bg-terracotta-500 text-white shadow-soft'
                : 'text-charcoal-600 hover:bg-ivory-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve a Table</span>
          </button>
        </div>

        {/* TAB 1: MENU & FOOD ORDERING */}
        {activeTab === 'menu' && (
          <div>
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-charcoal-900 text-ivory-100 shadow-sm'
                      : 'bg-white border border-ivory-300 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-soft hover:shadow-editorial transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 right-3 bg-forest-950/80 backdrop-blur-sm text-ivory-100 font-serif font-bold text-sm px-3 py-1 rounded-lg">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                          {item.category}
                        </span>
                        {item.isGlutenFree && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            GF
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-1 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-charcoal-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between">
                      <span className="text-[11px] text-charcoal-400">
                        {item.preparationTimeMinutes} min prep
                      </span>
                      <button
                        onClick={() => handleOpenItemModal(item)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TABLE RESERVATION */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft p-6 sm:p-10 max-w-4xl mx-auto">
            {confirmedReservation ? (
              <div className="text-center py-8 animate-in fade-in zoom-in-95">
                <ReservationSuccessIllustration className="w-40 h-40 mx-auto mb-4" />
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                  Reservation Confirmed
                </span>
                <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-2">
                  Table Booked at {restaurant.name}
                </h2>
                <p className="text-xs text-charcoal-600 mt-1">
                  We look forward to welcoming you. A confirmation has been recorded in your account.
                </p>

                <div className="my-6 p-4 rounded-2xl bg-ivory-100 border border-ivory-300 max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Reservation Ref:</span>
                    <span className="font-mono font-bold text-forest-800">{confirmedReservation.reservationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Guest Name:</span>
                    <span className="font-semibold text-charcoal-800">{confirmedReservation.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Date &amp; Time:</span>
                    <span className="font-semibold text-charcoal-800">
                      {confirmedReservation.reservationDate} at {confirmedReservation.timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Party Size:</span>
                    <span className="font-semibold text-charcoal-800">{confirmedReservation.partySize} Guests</span>
                  </div>
                  {confirmedReservation.tableNumber && (
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Assigned Table:</span>
                      <span className="font-semibold text-terracotta-600">{confirmedReservation.tableNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setConfirmedReservation(null);
                      setActiveTab('menu');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-forest-800 text-ivory-50 text-xs font-bold"
                  >
                    Explore Food Menu
                  </button>
                  <button
                    onClick={() => navigate('/account/bookings')}
                    className="px-5 py-2.5 rounded-xl bg-ivory-200 text-charcoal-800 text-xs font-bold"
                  >
                    View in Account
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReserveTable} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                    Reserve a Dining Table
                  </h2>
                  <p className="text-xs text-charcoal-500 mt-1">
                    Select your desired date, party size, and verified seating time.
                  </p>
                </div>

                {/* Date & Guests Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-ivory-100 border border-ivory-300">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                      Dining Date
                    </label>
                    <input
                      type="date"
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-charcoal-900 focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-ivory-100 border border-ivory-300">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                      Party Size
                    </label>
                    <select
                      value={resPartySize}
                      onChange={(e) => setResPartySize(Number(e.target.value))}
                      className="w-full bg-transparent text-sm font-semibold text-charcoal-900 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Available Time Slots */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                    Available Seating Times for {resDate}
                  </label>
                  {slotsLoading ? (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-20 rounded-xl bg-ivory-200 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.timeSlot}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.timeSlot)}
                          className={`p-2.5 rounded-xl text-center border transition-all ${
                            !slot.available
                              ? 'bg-ivory-200 border-ivory-300 text-charcoal-400 opacity-50 cursor-not-allowed line-through'
                              : selectedSlot === slot.timeSlot
                              ? 'bg-terracotta-500 border-terracotta-600 text-white font-bold shadow-sm'
                              : 'bg-white border-ivory-300 text-charcoal-800 hover:border-forest-600 font-semibold'
                          }`}
                        >
                          <span className="block text-xs">{slot.timeSlot}</span>
                          <span className="block text-[10px] opacity-80">
                            {slot.available ? `${slot.remainingTables} left` : 'Full'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Guest Contact Details */}
                <div className="pt-4 border-t border-ivory-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Elena Vance"
                      className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none focus:border-forest-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. elena@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none focus:border-forest-700"
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
                      placeholder="+1 (555) 019-2831"
                      className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none focus:border-forest-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Window table, anniversary celebration, allergy notes..."
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none focus:border-forest-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingBooking || !selectedSlot}
                  className="w-full py-4 rounded-2xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider shadow-editorial transition-all"
                >
                  {submittingBooking ? 'Securing Table...' : `Confirm Reservation for ${resPartySize} Guests`}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Item Customization & Add to Cart Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-editorial border border-ivory-300 animate-in fade-in zoom-in-95 text-left">
            <div className="relative h-48">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-charcoal-900">
                    {selectedItem.name}
                  </h3>
                  <span className="font-serif text-lg font-bold text-forest-800">
                    {formatCurrency(selectedItem.price)}
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-1">{selectedItem.description}</p>
              </div>

              {/* Modifiers */}
              {selectedItem.modifiers?.map((mod: any) => (
                <div key={mod.name} className="pt-3 border-t border-ivory-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                    {mod.name}
                  </h4>
                  <div className="space-y-1.5">
                    {mod.options.map((opt: any) => {
                      const isSelected = selectedModifiers[mod.name]?.optionName === opt.name;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() =>
                            setSelectedModifiers((prev) => ({
                              ...prev,
                              [mod.name]: { optionName: opt.name, price: opt.price },
                            }))
                          }
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                            isSelected
                              ? 'bg-ivory-200 border-forest-700 font-bold text-forest-900'
                              : 'border-ivory-300 text-charcoal-700 hover:bg-ivory-100'
                          }`}
                        >
                          <span>{opt.name}</span>
                          <span>{opt.price > 0 ? `+${formatCurrency(opt.price)}` : 'Included'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              <div className="pt-3 border-t border-ivory-200">
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Kitchen Notes / Dietary Requests
                </label>
                <input
                  type="text"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder="e.g. Extra sauce on side, dressing separate..."
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-xs focus:outline-none"
                />
              </div>

              {/* Quantity Picker & Add Button */}
              <div className="pt-4 border-t border-ivory-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-ivory-200 p-1.5 rounded-xl">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-charcoal-800 shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-charcoal-800 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Cart •{' '}
                    {formatCurrency(
                      (selectedItem.price +
                        Object.values(selectedModifiers).reduce((s, m) => s + m.price, 0)) *
                        itemQuantity
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
