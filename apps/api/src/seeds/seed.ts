import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Branch } from '../models/Branch';
import { Restaurant } from '../models/Restaurant';
import { MenuItem } from '../models/MenuItem';
import { Table } from '../models/Table';
import { TableReservation } from '../models/TableReservation';
import { Hotel } from '../models/Hotel';
import { RoomType } from '../models/RoomType';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';
import { Ingredient } from '../models/Ingredient';
import { Supplier } from '../models/Supplier';
import { Order } from '../models/Order';
import { UserRoles, OrderStatuses, OrderTypes, PaymentStatuses, TableStatuses, RoomStatuses, HousekeepingStatuses, BookingStatuses } from '@haven/shared';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', env.MONGO_URI);
    await mongoose.connect(env.MONGO_URI);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Branch.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      Table.deleteMany({}),
      TableReservation.deleteMany({}),
      Hotel.deleteMany({}),
      RoomType.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Ingredient.deleteMany({}),
      Supplier.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log('[Seed] Creating Organization & Flagship Branch...');
    const organization = await Organization.create({
      name: 'Haven & Hearth Hospitality Collection',
      slug: 'haven-and-hearth',
      legalName: 'Haven & Hearth Hospitality Group LLC',
      currency: 'USD',
      taxRate: 8.5,
      serviceChargeRate: 5.0,
      timezone: 'America/New_York',
      contactEmail: 'concierge@havenandhearth.com',
      contactPhone: '+1 (212) 555-0182',
    });

    const branch = await Branch.create({
      organizationId: organization._id,
      name: 'The Grand Haven Flagship Estate',
      slug: 'flagship-estate',
      address: {
        street: '428 Mercer Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10013',
        country: 'United States',
      },
      phone: '+1 (212) 555-0182',
      email: 'flagship@havenandhearth.com',
      hasRestaurant: true,
      hasHotel: true,
      businessHours: {
        open: '06:30',
        close: '23:30',
      },
    });

    console.log('[Seed] Creating Seed Users...');
    const defaultPassword = 'HavenDemo2026!';

    const admin = await User.create({
      name: 'Julian Montgomery',
      email: 'admin@havenandhearth.com',
      password: defaultPassword,
      role: UserRoles.PLATFORM_ADMIN,
      phone: '+1 (212) 555-0101',
      organizationId: organization._id,
      branchId: branch._id,
    });

    const owner = await User.create({
      name: 'Vivienne St. Claire',
      email: 'owner@havenandhearth.com',
      password: defaultPassword,
      role: UserRoles.RESTAURANT_OWNER,
      phone: '+1 (212) 555-0102',
      organizationId: organization._id,
      branchId: branch._id,
    });

    const cashier = await User.create({
      name: 'Liam Sterling',
      email: 'cashier@havenandhearth.com',
      password: defaultPassword,
      role: UserRoles.CASHIER,
      organizationId: organization._id,
      branchId: branch._id,
    });

    const kitchenStaff = await User.create({
      name: 'Chef Antoine Dubois',
      email: 'kitchen@havenandhearth.com',
      password: defaultPassword,
      role: UserRoles.KITCHEN_STAFF,
      organizationId: organization._id,
      branchId: branch._id,
    });

    const receptionist = await User.create({
      name: 'Camilla Rossi',
      email: 'reception@havenandhearth.com',
      password: defaultPassword,
      role: UserRoles.HOTEL_RECEPTIONIST,
      organizationId: organization._id,
      branchId: branch._id,
    });

    const housekeeping = await User.create({
      name: 'Rosa Morales',
      email: 'housekeeping@havenandhearth.com',
      password: defaultPassword,
      role: UserRoles.HOUSEKEEPING_STAFF,
      organizationId: organization._id,
      branchId: branch._id,
    });

    const customer = await User.create({
      name: 'Elena Vance',
      email: 'elena.vance@example.com',
      password: defaultPassword,
      role: UserRoles.CUSTOMER,
      phone: '+1 (212) 555-0199',
    });

    console.log('[Seed] Creating Luxury Restaurants...');
    const restaurant1 = await Restaurant.create({
      organizationId: organization._id,
      branchId: branch._id,
      name: "L'Étoile Brasserie",
      slug: 'letoile-brasserie',
      tagline: 'Refined French-Mediterranean culinary artistry & seasonal cellar pairings',
      description:
        "Perched amidst sunlight and warm limestone arches, L'Étoile Brasserie blends classical French culinary precision with the vibrant freshness of Mediterranean coastal produce. Featuring hand-rolled pasta, line-caught wild turbot, and heritage duck breast, each plate is accompanied by an award-winning biodynamic wine portfolio.",
      cuisine: ['French', 'Mediterranean', 'Fine Dining'],
      priceRange: '$$$$',
      rating: 4.9,
      reviewCount: 342,
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      ],
      openingHours: {
        lunch: '11:30 AM – 3:00 PM',
        dinner: '5:30 PM – 11:00 PM',
      },
      features: ['Sommelier Pairings', 'Chef’s Tasting Table', 'Private Dining Room', 'Garden Terrace'],
    });

    const restaurant2 = await Restaurant.create({
      organizationId: organization._id,
      branchId: branch._id,
      name: 'Aura Hearthfire & Raw Bar',
      slug: 'aura-hearthfire',
      tagline: 'Primitive open flame gastronomy & pristine coastal seafood',
      description:
        'Centered on an open wood-burning hearth fed by white oak and cherry embers, Aura brings smoky depth to coastal oysters, Maine lobsters, 45-day dry-aged Tomahawk ribeyes, and charred heritage garden roots. Unpretentious elegance meets primal warmth.',
      cuisine: ['Coastal', 'Wood-Fired Grill', 'Seafood', 'Contemporary'],
      priceRange: '$$$',
      rating: 4.8,
      reviewCount: 288,
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
      ],
      openingHours: {
        lunch: '12:00 PM – 3:30 PM',
        dinner: '5:00 PM – 11:30 PM',
      },
      features: ['Live Open Flame', 'Raw Oyster Bar', 'Craft Mezcal Library', 'Late Night Lounge'],
    });

    console.log('[Seed] Creating Artisanal Menu Items...');
    const menuItemsData = [
      // L'Étoile Brasserie Items
      {
        restaurantId: restaurant1._id,
        name: 'Pan-Seared Hudson Valley Duck Breast',
        slug: 'hudson-valley-duck-breast',
        category: 'Mains',
        description: 'Spiced honey glaze, parsnip mousseline, brandied cherries, charred baby leeks, and duck jus reduction.',
        price: 44.0,
        imageUrl: 'https://images.unsplash.com/photo-1514944298352-fae01f661008?auto=format&fit=crop&w=800&q=80',
        isVegetarian: false,
        isGlutenFree: true,
        preparationTimeMinutes: 22,
        calories: 680,
        allergens: ['Dairy'],
        modifiers: [
          {
            name: 'Preparation Temp',
            options: [
              { name: 'Medium Rare (Recommended)', price: 0 },
              { name: 'Medium', price: 0 },
            ],
          },
        ],
      },
      {
        restaurantId: restaurant1._id,
        name: 'Wild Turbot en Papillote',
        slug: 'wild-turbot-en-papillote',
        category: 'Mains',
        description: 'Mediterranean line-caught turbot baked with fennel pollen, caperberries, saffron broth, and baby heirloom potatoes.',
        price: 48.0,
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        isVegetarian: false,
        isGlutenFree: true,
        preparationTimeMinutes: 20,
        calories: 520,
        allergens: ['Fish'],
      },
      {
        restaurantId: restaurant1._id,
        name: 'Black Périgord Truffle Tagliolini',
        slug: 'black-truffle-tagliolini',
        category: 'Mains',
        description: 'House-extruded pasta ribbons swirled with 36-month Parmigiano-Reggiano butter and freshly shaved black winter truffles.',
        price: 38.0,
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281084?auto=format&fit=crop&w=800&q=80',
        isVegetarian: true,
        isGlutenFree: false,
        preparationTimeMinutes: 16,
        calories: 740,
        allergens: ['Gluten', 'Dairy', 'Eggs'],
      },
      {
        restaurantId: restaurant1._id,
        name: 'Artisanal Burrata di Bufala',
        slug: 'artisanal-burrata-di-bufala',
        category: 'Starters',
        description: 'Heirloom greenhouse tomatoes, Sicilian pistachios, smoked sea salt, cold-pressed olive oil, and aged balsamic glaze.',
        price: 22.0,
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
        isVegetarian: true,
        isGlutenFree: true,
        preparationTimeMinutes: 10,
        calories: 420,
        allergens: ['Dairy', 'Nuts'],
      },
      {
        restaurantId: restaurant1._id,
        name: 'Grand Marnier Soufflé',
        slug: 'grand-marnier-souffle',
        category: 'Desserts',
        description: 'Airy orange blossom soufflé served table-side with warm crème anglaise and candied citrus peel.',
        price: 18.0,
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        isVegetarian: true,
        isGlutenFree: false,
        preparationTimeMinutes: 25,
        calories: 380,
        allergens: ['Dairy', 'Eggs', 'Gluten'],
      },
      // Aura Hearthfire Items
      {
        restaurantId: restaurant2._id,
        name: '45-Day Dry-Aged Prime Ribeye (16 oz)',
        slug: 'dry-aged-prime-ribeye',
        category: 'Grill & Flame',
        description: 'Charred over white oak coals, finished with smoked bone marrow butter and roasted garlic confit.',
        price: 68.0,
        imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
        isVegetarian: false,
        isGlutenFree: true,
        preparationTimeMinutes: 25,
        calories: 950,
        modifiers: [
          {
            name: 'Doneness',
            options: [
              { name: 'Rare', price: 0 },
              { name: 'Medium Rare', price: 0 },
              { name: 'Medium', price: 0 },
              { name: 'Medium Well', price: 0 },
            ],
          },
          {
            name: 'Sauce Add-on',
            options: [
              { name: 'Chimichurri Verde', price: 3 },
              { name: 'Truffle Peppercorn Jus', price: 5 },
            ],
          },
        ],
      },
      {
        restaurantId: restaurant2._id,
        name: 'Fire-Roasted Pacific King Salmon',
        slug: 'fire-roasted-pacific-salmon',
        category: 'Grill & Flame',
        description: 'Cedar plank roasted salmon, charred broccolini, lemon-herb reduction, and smoked fleur de sel.',
        price: 42.0,
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
        isVegetarian: false,
        isGlutenFree: true,
        preparationTimeMinutes: 18,
        calories: 590,
        allergens: ['Fish'],
      },
      {
        restaurantId: restaurant2._id,
        name: 'Oysters on the Half Shell (Dozen)',
        slug: 'oysters-half-shell-dozen',
        category: 'Raw Bar',
        description: 'Chilled Maine Kumamoto and Island Creek oysters, champagne mignonette, grated horseradish, and lemon pearls.',
        price: 36.0,
        imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
        isVegetarian: false,
        isGlutenFree: true,
        preparationTimeMinutes: 8,
        calories: 140,
        allergens: ['Shellfish'],
      },
      {
        restaurantId: restaurant2._id,
        name: 'Smoked Bourbon Old Fashioned',
        slug: 'smoked-bourbon-old-fashioned',
        category: 'Cocktails',
        description: 'Kentucky small-batch bourbon, demerara, aromatic bitters, smoked table-side with flamed orange oils.',
        price: 20.0,
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        preparationTimeMinutes: 4,
        calories: 190,
      },
    ];

    await MenuItem.insertMany(menuItemsData);

    console.log('[Seed] Creating Dining Tables...');
    const tablesData = [
      { branchId: branch._id, tableNumber: 'T-101', capacity: 2, floorZone: 'Main Dining Room', status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-102', capacity: 2, floorZone: 'Main Dining Room', status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-103', capacity: 4, floorZone: 'Main Dining Room', status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-104', capacity: 4, floorZone: 'Main Dining Room', status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-201', capacity: 6, floorZone: 'Garden Terrace', status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-202', capacity: 6, floorZone: 'Garden Terrace', status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-301', capacity: 8, floorZone: "Chef's Alcove", status: TableStatuses.AVAILABLE },
      { branchId: branch._id, tableNumber: 'T-302', capacity: 10, floorZone: "Chef's Alcove", status: TableStatuses.AVAILABLE },
    ];
    await Table.insertMany(tablesData);

    console.log('[Seed] Creating Luxury Boutique Hotel & Room Types...');
    const hotel = await Hotel.create({
      organizationId: organization._id,
      branchId: branch._id,
      name: 'The Grand Haven Hotel & Residences',
      slug: 'the-grand-haven-hotel',
      tagline: 'An intimate sanctuary of modern quiet luxury in downtown Manhattan',
      description:
        'Offering bespoke hospitality, The Grand Haven combines historical brick architecture with minimalist walnut accents, cashmere textiles, private soaking baths, and 24/7 dedicated butler service. Guests enjoy priority access to all on-property dining reservations and in-suite sommelier dinners.',
      starRating: 5,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: [
        'Rooftop Thermal Infinity Pool',
        'In-Room Sommelier Tastings',
        'Dyson Supersonic Amenities',
        'Private Chauffeur Service',
        '24-Hour In-Room Dining',
        'Hydrotherapy Spa & Sauna',
      ],
      checkInTime: '15:00',
      checkOutTime: '12:00',
    });

    const roomType1 = await RoomType.create({
      hotelId: hotel._id,
      name: 'The Haven Sovereign King Suite',
      slug: 'haven-sovereign-king-suite',
      description: '650 sq ft of tranquil comfort, custom king featherbed, free-standing stone soaking tub, and a private balcony overlooking the private courtyard gardens.',
      basePricePerNight: 495.0,
      maxGuests: 2,
      bedConfig: '1 King Bed',
      sizeSqFt: 650,
      amenities: ['Private Balcony', 'Stone Soaking Tub', 'Aesop Bath Amenities', 'Curated Nespresso Bar', 'Bose Sound System'],
      images: [
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      ],
      totalRooms: 4,
    });

    const roomType2 = await RoomType.create({
      hotelId: hotel._id,
      name: 'The Hearthfire Deluxe Room',
      slug: 'hearthfire-deluxe-room',
      description: '480 sq ft room featuring an ambient fireplace, bespoke leather seating, rainfall steam shower, and floor-to-ceiling soundproof views.',
      basePricePerNight: 360.0,
      maxGuests: 2,
      bedConfig: '1 King Bed',
      sizeSqFt: 480,
      amenities: ['Ambient Fireplace', 'Rainfall Shower', 'Smart Climate Control', 'Ultra-fast Wi-Fi 6E'],
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      ],
      totalRooms: 6,
    });

    const roomType3 = await RoomType.create({
      hotelId: hotel._id,
      name: 'The Grand Haven Penthouse Villa',
      slug: 'grand-haven-penthouse-villa',
      description: '1,450 sq ft top-floor duplex with private cedar plunge pool, grand living salon, butler pantry, and unobstructed 360° skyline vistas.',
      basePricePerNight: 1250.0,
      maxGuests: 4,
      bedConfig: '2 King Beds',
      sizeSqFt: 1450,
      amenities: ['Private Plunge Pool', 'Dedicated Butler Service', 'Sub-Zero Wine Cellar', 'Private Elevator Access'],
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      ],
      totalRooms: 2,
    });

    console.log('[Seed] Creating Rooms & Inventory...');
    const roomsData = [
      { hotelId: hotel._id, roomTypeId: roomType1._id, roomNumber: '201', floor: 2, status: RoomStatuses.AVAILABLE, housekeepingStatus: HousekeepingStatuses.CLEAN },
      { hotelId: hotel._id, roomTypeId: roomType1._id, roomNumber: '202', floor: 2, status: RoomStatuses.OCCUPIED, housekeepingStatus: HousekeepingStatuses.CLEAN },
      { hotelId: hotel._id, roomTypeId: roomType1._id, roomNumber: '301', floor: 3, status: RoomStatuses.AVAILABLE, housekeepingStatus: HousekeepingStatuses.INSPECTED },
      { hotelId: hotel._id, roomTypeId: roomType1._id, roomNumber: '302', floor: 3, status: RoomStatuses.AVAILABLE, housekeepingStatus: HousekeepingStatuses.DIRTY },
      { hotelId: hotel._id, roomTypeId: roomType2._id, roomNumber: '401', floor: 4, status: RoomStatuses.AVAILABLE, housekeepingStatus: HousekeepingStatuses.CLEAN },
      { hotelId: hotel._id, roomTypeId: roomType2._id, roomNumber: '402', floor: 4, status: RoomStatuses.OCCUPIED, housekeepingStatus: HousekeepingStatuses.CLEAN },
      { hotelId: hotel._id, roomTypeId: roomType2._id, roomNumber: '403', floor: 4, status: RoomStatuses.AVAILABLE, housekeepingStatus: HousekeepingStatuses.CLEAN },
      { hotelId: hotel._id, roomTypeId: roomType3._id, roomNumber: 'PH-1', floor: 5, status: RoomStatuses.AVAILABLE, housekeepingStatus: HousekeepingStatuses.INSPECTED },
    ];
    await Room.insertMany(roomsData);

    console.log('[Seed] Creating Suppliers & Ingredients...');
    const supplier1 = await Supplier.create({
      organizationId: organization._id,
      branchId: branch._id,
      name: 'Hudson Valley Organic Produce',
      contactPerson: 'David Miller',
      email: 'orders@hudsonvalleyorganic.com',
      phone: '+1 (845) 555-0144',
      category: 'Farm Produce & Dairy',
    });

    const supplier2 = await Supplier.create({
      organizationId: organization._id,
      branchId: branch._id,
      name: 'Montauk Coastal Fishery',
      contactPerson: 'Capt. Thomas Reed',
      email: 'seafood@montaukfishery.com',
      phone: '+1 (631) 555-0189',
      category: 'Seafood & Shellfish',
    });

    const ingredientsData = [
      { organizationId: organization._id, branchId: branch._id, name: 'Hudson Valley Duck Breast', sku: 'ING-DUCK-01', unit: 'kg', currentStock: 28.5, minimumThreshold: 10, costPerUnit: 24.0, supplierId: supplier1._id },
      { organizationId: organization._id, branchId: branch._id, name: 'Wild Turbot Fillets', sku: 'ING-TURBOT-02', unit: 'kg', currentStock: 14.0, minimumThreshold: 6, costPerUnit: 32.0, supplierId: supplier2._id },
      { organizationId: organization._id, branchId: branch._id, name: 'Prime Dry-Aged Beef Ribeye', sku: 'ING-BEEF-03', unit: 'kg', currentStock: 35.0, minimumThreshold: 12, costPerUnit: 38.0 },
      { organizationId: organization._id, branchId: branch._id, name: 'Black Périgord Truffles', sku: 'ING-TRUFFLE-04', unit: 'g', currentStock: 180, minimumThreshold: 50, costPerUnit: 2.5 },
      { organizationId: organization._id, branchId: branch._id, name: 'Artisanal Burrata Cheese', sku: 'ING-BURRATA-05', unit: 'pcs', currentStock: 4, minimumThreshold: 8, costPerUnit: 5.5, supplierId: supplier1._id }, // Low stock!
      { organizationId: organization._id, branchId: branch._id, name: 'Island Creek Oysters', sku: 'ING-OYSTER-06', unit: 'pcs', currentStock: 120, minimumThreshold: 40, costPerUnit: 1.4, supplierId: supplier2._id },
    ];
    await Ingredient.insertMany(ingredientsData);

    console.log('[Seed] Creating Sample Bookings & Orders...');
    const booking1 = await Booking.create({
      bookingNumber: 'BKG-8491',
      hotelId: hotel._id,
      roomTypeId: roomType1._id,
      roomNumber: '202',
      customerId: customer._id,
      guestName: 'Elena Vance',
      guestEmail: 'elena.vance@example.com',
      guestPhone: '+1 (212) 555-0199',
      checkInDate: '2026-10-21',
      checkOutDate: '2026-10-24',
      numberOfGuests: 2,
      numberOfNights: 3,
      nightlyRate: 495.0,
      totalAmount: 1663.2,
      status: BookingStatuses.CHECKED_IN,
      paymentStatus: PaymentStatuses.COMPLETED,
      actualCheckIn: new Date(),
      folioCharges: [
        { description: 'The Haven Sovereign King Suite (3 nights)', amount: 1485.0, date: new Date(), type: 'ROOM' },
        { description: 'Hospitality Tax (12%)', amount: 178.2, date: new Date(), type: 'TAX' },
      ],
    });

    const reservation1 = await TableReservation.create({
      reservationNumber: 'RES-5201',
      organizationId: organization._id,
      branchId: branch._id,
      restaurantId: restaurant1._id,
      customerId: customer._id,
      customerName: 'Elena Vance',
      customerPhone: '+1 (212) 555-0199',
      customerEmail: 'elena.vance@example.com',
      partySize: 2,
      reservationDate: '2026-10-21',
      timeSlot: '19:30',
      tableNumber: 'T-103',
      specialRequests: 'Window table if available. Celebrating anniversary.',
      status: 'CONFIRMED',
    });

    const order1 = await Order.create({
      orderNumber: 'ORD-7294',
      organizationId: organization._id,
      branchId: branch._id,
      restaurantId: restaurant1._id,
      customerId: customer._id,
      customerName: 'Elena Vance',
      orderType: OrderTypes.DINE_IN,
      tableNumber: 'T-103',
      items: [
        {
          menuItemId: (await MenuItem.findOne({ slug: 'hudson-valley-duck-breast' }))!._id,
          name: 'Pan-Seared Hudson Valley Duck Breast',
          price: 44.0,
          quantity: 2,
          itemTotal: 88.0,
        },
        {
          menuItemId: (await MenuItem.findOne({ slug: 'grand-marnier-souffle' }))!._id,
          name: 'Grand Marnier Soufflé',
          price: 18.0,
          quantity: 1,
          itemTotal: 18.0,
        },
      ],
      subtotal: 106.0,
      tax: 9.01,
      serviceCharge: 5.3,
      total: 120.31,
      status: OrderStatuses.PREPARING,
      paymentStatus: PaymentStatuses.PENDING,
      placedAt: new Date(Date.now() - 1000 * 60 * 12),
    });

    // In-room dining order
    const order2 = await Order.create({
      orderNumber: 'ORD-9102',
      organizationId: organization._id,
      branchId: branch._id,
      restaurantId: restaurant2._id,
      customerName: 'Elena Vance (Suite 202)',
      orderType: OrderTypes.ROOM_SERVICE,
      roomNumber: '202',
      hotelBookingId: booking1._id,
      items: [
        {
          menuItemId: (await MenuItem.findOne({ slug: 'oysters-half-shell-dozen' }))!._id,
          name: 'Oysters on the Half Shell (Dozen)',
          price: 36.0,
          quantity: 1,
          itemTotal: 36.0,
        },
        {
          menuItemId: (await MenuItem.findOne({ slug: 'smoked-bourbon-old-fashioned' }))!._id,
          name: 'Smoked Bourbon Old Fashioned',
          price: 20.0,
          quantity: 2,
          itemTotal: 40.0,
        },
      ],
      subtotal: 76.0,
      tax: 6.46,
      serviceCharge: 3.8,
      total: 86.26,
      status: OrderStatuses.READY,
      paymentStatus: PaymentStatuses.COMPLETED,
      paymentMethod: 'ROOM_CHARGE',
      notes: 'Please bring up to Room 202 with ice bucket.',
      placedAt: new Date(Date.now() - 1000 * 60 * 25),
    });

    console.log('[Seed] Database successfully seeded with luxury demonstration records!');
    console.log('========================================================================');
    console.log('  DEMO CREDENTIALS:');
    console.log('  Password for all demo accounts: HavenDemo2026!');
    console.log('  • Admin:              admin@havenandhearth.com');
    console.log('  • Owner / GM:         owner@havenandhearth.com');
    console.log('  • POS / Cashier:      cashier@havenandhearth.com');
    console.log('  • Kitchen Staff:      kitchen@havenandhearth.com');
    console.log('  • Hotel Receptionist: reception@havenandhearth.com');
    console.log('  • Housekeeping:       housekeeping@havenandhearth.com');
    console.log('  • Customer / Guest:   elena.vance@example.com');
    console.log('========================================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}
