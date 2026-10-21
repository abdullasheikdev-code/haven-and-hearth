import { UserRoles, OrderStatuses, OrderTypes, TableStatuses, BookingStatuses } from '@haven/shared';

export const MOCK_RESTAURANTS = [
  {
    _id: '6ad86f56dee187008f7ac911',
    name: "L'Étoile Brasserie",
    slug: 'letoile-brasserie',
    tagline: 'Refined French-Mediterranean culinary artistry & seasonal cellar pairings',
    description: "Perched amidst sunlight and warm limestone arches, L'Étoile Brasserie blends classical French culinary precision with the vibrant freshness of Mediterranean coastal produce. Featuring hand-rolled pasta, line-caught wild turbot, and heritage duck breast, each plate is accompanied by an award-winning biodynamic wine portfolio.",
    cuisine: ['French', 'Mediterranean', 'Fine Dining'],
    priceRange: '$$$$',
    rating: 4.9,
    reviewCount: 342,
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ],
    openingHours: { lunch: '11:30 AM – 3:00 PM', dinner: '5:30 PM – 11:00 PM' },
    features: ['Sommelier Pairings', 'Chef’s Tasting Table', 'Private Dining Room', 'Garden Terrace'],
  },
  {
    _id: '6ad86f56dee187008f7ac912',
    name: 'Aura Hearthfire & Raw Bar',
    slug: 'aura-hearthfire',
    tagline: 'Primitive open flame gastronomy & pristine coastal seafood',
    description: 'Centered on an open wood-burning hearth fed by white oak and cherry embers, Aura brings smoky depth to coastal oysters, Maine lobsters, 45-day dry-aged Tomahawk ribeyes, and charred heritage garden roots. Unpretentious elegance meets primal warmth.',
    cuisine: ['Coastal', 'Wood-Fired Grill', 'Seafood', 'Contemporary'],
    priceRange: '$$$',
    rating: 4.8,
    reviewCount: 288,
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    ],
    openingHours: { lunch: '12:00 PM – 3:30 PM', dinner: '5:00 PM – 11:30 PM' },
    features: ['Live Open Flame', 'Raw Oyster Bar', 'Craft Mezcal Library', 'Late Night Lounge'],
  },
];

export const MOCK_HOTELS = [
  {
    _id: '6ad86f56dee187008f7ac920',
    name: 'The Sovereign Estate & Residences',
    slug: 'sovereign-estate',
    tagline: 'An urban sanctuary of classical limestone elegance and intuitive hospitality',
    description: 'Rising discreetly above Mercer Street, The Sovereign Estate combines quiet luxury, bespoke brass architecture, and personalized concierge services.',
    starRating: 5,
    rating: 4.96,
    reviewCount: 184,
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Artisanal In-Room Dining', 'Heated Botanical Pool', 'Sommelier Cellar', 'Private Valet'],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
  },
];

export const MOCK_MENU_ITEMS = [
  {
    _id: '6ad86f56dee187008f7ac931',
    restaurantId: '6ad86f56dee187008f7ac911',
    name: 'Pan-Seared Hudson Valley Duck Breast',
    category: 'Mains',
    price: 48,
    description: 'Confit cherry jus, charred baby fennel, parsnip velvet, lavender glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1514944298352-f4e9184b5530?auto=format&fit=crop&w=600&q=80',
    dietaryTags: ['Gluten-Free'],
    isAvailable: true,
  },
  {
    _id: '6ad86f56dee187008f7ac932',
    restaurantId: '6ad86f56dee187008f7ac911',
    name: 'Wood-Fired Wild Mediterranean Turbot',
    category: 'Mains',
    price: 54,
    description: 'Saffron beurre blanc, sea beans, preserved Meyer lemon, smoked olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    dietaryTags: ['Gluten-Free'],
    isAvailable: true,
  },
  {
    _id: '6ad86f56dee187008f7ac933',
    restaurantId: '6ad86f56dee187008f7ac911',
    name: 'Hand-Rolled Black Truffle Agnolotti',
    category: 'Mains',
    price: 42,
    description: 'Périgord winter truffle, aged Parmigiano Reggiano fonduta, hazelnut brown butter.',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    dietaryTags: ['Vegetarian'],
    isAvailable: true,
  },
  {
    _id: '6ad86f56dee187008f7ac934',
    restaurantId: '6ad86f56dee187008f7ac911',
    name: 'Hokkaido Scallop Crudo',
    category: 'Raw Bar',
    price: 28,
    description: 'Finger lime pearls, white soy ponzu, fermented chili oil, micro coriander.',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    dietaryTags: ['Gluten-Free'],
    isAvailable: true,
  },
  {
    _id: '6ad86f56dee187008f7ac935',
    restaurantId: '6ad86f56dee187008f7ac911',
    name: 'Valrhona Grand Cru Soufflé',
    category: 'Desserts',
    price: 22,
    description: '70% Guanaja dark chocolate, Tahitian vanilla bean anglaise, gold leaf.',
    imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
    dietaryTags: ['Vegetarian'],
    isAvailable: true,
  },
  {
    _id: '6ad86f56dee187008f7ac936',
    restaurantId: '6ad86f56dee187008f7ac911',
    name: 'Smoked Rosemary Mezcalita',
    category: 'Cocktails',
    price: 21,
    description: 'Artisanal mezcal, charred blood orange, organic agave, smoked rosemary sprig.',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    isAvailable: true,
  },
];

export const MOCK_TABLES = [
  { _id: 't1', tableNumber: '1', capacity: 2, floorZone: 'Main Dining Room', status: TableStatuses.AVAILABLE },
  { _id: 't2', tableNumber: '2', capacity: 4, floorZone: 'Main Dining Room', status: TableStatuses.OCCUPIED },
  { _id: 't3', tableNumber: '3', capacity: 4, floorZone: 'Main Dining Room', status: TableStatuses.AVAILABLE },
  { _id: 't4', tableNumber: '4', capacity: 6, floorZone: 'Main Dining Room', status: TableStatuses.RESERVED },
  { _id: 't5', tableNumber: '11', capacity: 2, floorZone: 'Garden Terrace', status: TableStatuses.AVAILABLE },
  { _id: 't6', tableNumber: '12', capacity: 4, floorZone: 'Garden Terrace', status: TableStatuses.AVAILABLE },
  { _id: 't7', tableNumber: '21', capacity: 8, floorZone: 'Private Dining Cellar', status: TableStatuses.AVAILABLE },
];

export const MOCK_ROOM_TYPES = [
  {
    _id: 'rt1',
    hotelId: '6ad86f56dee187008f7ac920',
    name: 'Sovereign Terrace Suite',
    description: 'Expansive private terrace overlooking Mercer courtyard, marble bath, king hearth bed.',
    basePricePerNight: 495,
    maxOccupancy: 2,
    images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Terrace', 'Fireplace', 'Marble Soaking Tub', 'In-Room Wine Cellar'],
  },
  {
    _id: 'rt2',
    hotelId: '6ad86f56dee187008f7ac920',
    name: 'The Mercer Grand Penthouse',
    description: 'Duplex penthouse with 360-degree city skyline vistas, full chef kitchen, and dedicated butler.',
    basePricePerNight: 1250,
    maxOccupancy: 4,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Private Elevator', 'Chef Kitchen', '360 City View', 'Dedicated Butler'],
  },
];

export const MOCK_ROOMS = [
  { _id: 'rm1', roomNumber: '201', floor: 2, housekeepingStatus: 'CLEAN', status: 'AVAILABLE', roomTypeId: MOCK_ROOM_TYPES[0] },
  { _id: 'rm2', roomNumber: '202', floor: 2, housekeepingStatus: 'DIRTY', status: 'DIRTY', roomTypeId: MOCK_ROOM_TYPES[0] },
  { _id: 'rm3', roomNumber: '301', floor: 3, housekeepingStatus: 'IN_PROGRESS', status: 'OCCUPIED', roomTypeId: MOCK_ROOM_TYPES[1] },
  { _id: 'rm4', roomNumber: '302', floor: 3, housekeepingStatus: 'INSPECTED', status: 'AVAILABLE', roomTypeId: MOCK_ROOM_TYPES[1] },
  { _id: 'rm5', roomNumber: '401', floor: 4, housekeepingStatus: 'CLEAN', status: 'AVAILABLE', roomTypeId: MOCK_ROOM_TYPES[0] },
];

export const MOCK_ORDERS = [
  {
    _id: 'ord-101',
    orderNumber: 'ORD-7291',
    orderType: OrderTypes.DINE_IN,
    tableNumber: '2',
    status: OrderStatuses.PREPARING,
    restaurantId: { name: "L'Étoile Brasserie" },
    customerName: 'Elena Vance',
    items: [
      { name: 'Pan-Seared Hudson Valley Duck Breast', quantity: 2, price: 48 },
      { name: 'Hand-Rolled Black Truffle Agnolotti', quantity: 1, price: 42 },
      { name: 'Smoked Rosemary Mezcalita', quantity: 2, price: 21 },
    ],
    total: 195.97,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'ord-102',
    orderNumber: 'ORD-7292',
    orderType: OrderTypes.ROOM_SERVICE,
    roomNumber: '402',
    status: OrderStatuses.PENDING,
    restaurantId: { name: "L'Étoile Brasserie" },
    customerName: 'Elena Vance',
    items: [
      { name: 'Wood-Fired Wild Mediterranean Turbot', quantity: 1, price: 54 },
      { name: 'Valrhona Grand Cru Soufflé', quantity: 2, price: 22 },
    ],
    total: 106.37,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_INGREDIENTS = [
  { _id: 'ing1', name: 'Hudson Valley Heritage Duck Breast', sku: 'ING-DUCK-01', currentStock: 24, minimumThreshold: 10, unit: 'kg', costPerUnit: 18.5, supplier: 'Hudson Farmstead' },
  { _id: 'ing2', name: 'Fresh Périgord Winter Truffles', sku: 'ING-TRUF-02', currentStock: 1.2, minimumThreshold: 1.5, unit: 'kg', costPerUnit: 450, supplier: 'Provence Imports' },
  { _id: 'ing3', name: 'Wild Line-Caught Turbot Fillet', sku: 'ING-TURB-03', currentStock: 16, minimumThreshold: 8, unit: 'kg', costPerUnit: 28, supplier: 'Montauk Coastal Seafood' },
  { _id: 'ing4', name: 'Valrhona 70% Guanaja Chocolate', sku: 'ING-CHOC-04', currentStock: 35, minimumThreshold: 12, unit: 'kg', costPerUnit: 14.5, supplier: 'Valrhona Americas' },
];

export const MOCK_BOOKINGS = [
  {
    _id: 'bk1',
    bookingNumber: 'BK-5012',
    guestName: 'Elena Vance',
    guestEmail: 'elena.vance@example.com',
    roomTypeId: { name: 'Sovereign Terrace Suite' },
    roomNumber: '402',
    checkInDate: '2026-10-22',
    checkOutDate: '2026-10-25',
    totalAmount: 1485,
    status: BookingStatuses.CHECKED_IN,
  },
  {
    _id: 'bk2',
    bookingNumber: 'BK-5013',
    guestName: 'Marcus Sterling',
    guestEmail: 'm.sterling@example.com',
    roomTypeId: { name: 'The Mercer Grand Penthouse' },
    roomNumber: 'PH-1',
    checkInDate: '2026-10-24',
    checkOutDate: '2026-10-28',
    totalAmount: 5000,
    status: BookingStatuses.CONFIRMED,
  },
];

export const MOCK_CUSTOMER_RESERVATIONS = [
  {
    _id: 'res-101',
    reservationNumber: 'RES-8421',
    restaurantId: { name: "L'Étoile Brasserie" },
    reservationDate: '2026-10-23',
    timeSlot: '19:30',
    partySize: 4,
    status: 'CONFIRMED',
  },
  {
    _id: 'res-102',
    reservationNumber: 'RES-8422',
    restaurantId: { name: 'Aura Hearthfire & Raw Bar' },
    reservationDate: '2026-10-25',
    timeSlot: '20:00',
    partySize: 2,
    status: 'CONFIRMED',
  },
];

export const MOCK_REPORTS = {
  sales: { totalSales: 48920, orderCount: 312, averageOrderValue: 156.79 },
  hotel: { totalRevenue: 98400, bookingCount: 42, occupancyRate: 85.5, totalRooms: 20, occupiedRooms: 17 },
  inventory: { inventoryValuation: 24850, lowStockAlerts: 1 },
  channelSales: {
    DINE_IN: { total: 28400, count: 180 },
    ROOM_SERVICE: { total: 12500, count: 85 },
    TAKEAWAY: { total: 8020, count: 47 },
  },
};
