# Haven & Hearth — REST API Reference

Base Endpoint: `/api/v1`

---

## 1. System Health
- **`GET /api/v1/health`**
  - **Description**: Returns server uptime, platform status, and MongoDB connection state.
  - **Access**: Public.

---

## 2. Authentication & Session
- **`POST /api/v1/auth/register`**
  - **Description**: Register customer or hospitality group owner account.
  - **Body**: `{ name, email, password, role, phone, organizationName }`.
- **`POST /api/v1/auth/login`**
  - **Description**: Authenticate with email and password. Sets HTTP-only `token` cookie and returns user profile.
  - **Rate Limit**: 50 attempts / 15 minutes.
- **`POST /api/v1/auth/logout`**
  - **Description**: Clears session cookie.
- **`GET /api/v1/auth/me`**
  - **Description**: Returns current authenticated user and organization memberships.
  - **Access**: Authenticated.

---

## 3. Restaurants & Dining
- **`GET /api/v1/restaurants`**
  - **Query Params**: `cuisine`, `priceRange`, `search`.
  - **Description**: List active estate restaurants.
- **`GET /api/v1/restaurants/:slug`**
  - **Description**: Retrieve detailed restaurant profile, menu categories, and available tables.
- **`GET /api/v1/restaurants/menu-items`**
  - **Query Params**: `restaurantId`, `category`.
- **`POST /api/v1/restaurants/menu-items`**
  - **Access**: RESTAURANT_OWNER, BRANCH_MANAGER.
- **`PATCH /api/v1/restaurants/menu-items/:id`**
  - **Access**: RESTAURANT_OWNER, BRANCH_MANAGER, KITCHEN_STAFF.

---

## 4. Food Orders & KDS
- **`POST /api/v1/orders`**
  - **Description**: Creates food order (Dine-in, Takeaway, Delivery, Room Service) with authoritative server-side price calculations.
  - **Body**: `{ restaurantId, orderType, customerName, items, tableNumber, roomNumber, paymentMethod }`.
  - **Socket Event**: Emits `new_ticket` to kitchen brigade and `order_created` to branch.
- **`GET /api/v1/orders/:id`**
  - **Description**: Fetch order by ID with restaurant details.
- **`GET /api/v1/orders/customer`**
  - **Description**: List order history for authenticated customer.
- **`GET /api/v1/orders/branch`**
  - **Access**: Staff roles.
- **`PATCH /api/v1/orders/:id/status`**
  - **Description**: Advance order status (PENDING -> ACCEPTED -> PREPARING -> READY -> COMPLETED).
  - **Socket Event**: Emits `order_updated` to customer and kitchen.

---

## 5. Table Reservations
- **`GET /api/v1/reservations/availability`**
  - **Query Params**: `restaurantId`, `date`, `partySize`.
  - **Description**: Checks table slots for a specific date and party size against booked tables.
- **`POST /api/v1/reservations`**
  - **Description**: Books table with human-readable reservation reference (`RES-xxxx`).
- **`GET /api/v1/reservations/customer`**
  - **Description**: Customer's active and past table reservations.
- **`PATCH /api/v1/reservations/:id/status`**
  - **Access**: Staff roles (SEATED, COMPLETED, CANCELLED).

---

## 6. Boutique Hotel & Stays
- **`GET /api/v1/hotels`**
  - **Description**: List boutique hotel properties.
- **`GET /api/v1/hotels/:slug`**
  - **Description**: Hotel details and room categories.
- **`GET /api/v1/hotels/availability`**
  - **Query Params**: `hotelId`, `checkInDate`, `checkOutDate`, `guests`.
  - **Description**: Query real-time room availability preventing overlapping bookings.
- **`POST /api/v1/hotels/bookings`**
  - **Description**: Create confirmed hotel reservation with initial room and tax folios.
- **`PATCH /api/v1/hotels/bookings/:id/checkin`**
  - **Description**: Front desk check-in (marks room OCCUPIED).
- **`PATCH /api/v1/hotels/bookings/:id/checkout`**
  - **Description**: Front desk check-out (marks room DIRTY for housekeeping).
- **`PATCH /api/v1/hotels/rooms/:id/housekeeping`**
  - **Description**: Update housekeeping status (CLEAN, DIRTY, IN_PROGRESS, INSPECTED).

---

## 7. Point of Sale (POS)
- **`GET /api/v1/pos/context`**
  - **Query Params**: `branchId`.
  - **Description**: Returns quick-access menu items and tables for POS screen.
- **`POST /api/v1/pos/checkout`**
  - **Description**: High-velocity checkout, applies discounts, records payment, releases table, and returns print-ready receipt.

---

## 8. Pantry & Procurement
- **`GET /api/v1/inventory/ingredients`**
  - **Description**: List ingredients with stock levels and low-stock alerts.
- **`POST /api/v1/inventory/movements`**
  - **Description**: Record stock movement (Usage, Wastage, Restock) with audit trail.
- **`GET /api/v1/inventory/purchases`**
  - **Description**: List purchase orders.
- **`PATCH /api/v1/inventory/purchases/:id/receive`**
  - **Description**: Mark purchase order received; automatically increments ingredient stocks.

---

## 9. Executive Reporting
- **`GET /api/v1/reports/overview`**
  - **Description**: Server-side aggregation of total sales, sales by channel, top selling items, hotel occupancy rates, and pantry asset valuation.
