import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';

// Customer Pages
import { HomePage } from './features/discovery/HomePage';
import { RestaurantDiscoveryPage } from './features/restaurants/RestaurantDiscoveryPage';
import { RestaurantDetailPage } from './features/restaurants/RestaurantDetailPage';
import { HotelDiscoveryPage } from './features/hotels/HotelDiscoveryPage';
import { HotelDetailPage } from './features/hotels/HotelDetailPage';
import { CartPage } from './features/cart/CartPage';
import { OrderConfirmationPage } from './features/orders/OrderConfirmationPage';
import { CustomerOrdersPage } from './features/account/CustomerOrdersPage';
import { CustomerBookingsPage } from './features/account/CustomerBookingsPage';
import { LoginPage } from './features/authentication/LoginPage';
import { RegisterPage } from './features/authentication/RegisterPage';

// Operations Pages
import { StaffLayout } from './features/operations/StaffLayout';
import { OwnerOverviewPage } from './features/operations/OwnerOverviewPage';
import { PosTerminalPage } from './features/operations/PosTerminalPage';
import { KitchenDisplayPage } from './features/operations/KitchenDisplayPage';
import { TableManagementPage } from './features/operations/TableManagementPage';
import { HotelReceptionPage } from './features/operations/HotelReceptionPage';
import { HousekeepingPage } from './features/operations/HousekeepingPage';
import { InventoryPage } from './features/operations/InventoryPage';
import { ReportsPage } from './features/operations/ReportsPage';

const CustomerLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-ivory-100">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer Facing Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantDiscoveryPage />} />
              <Route path="/restaurants/:slug" element={<RestaurantDetailPage />} />
              <Route path="/hotels" element={<HotelDiscoveryPage />} />
              <Route path="/hotels/:slug" element={<HotelDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/account/orders" element={<CustomerOrdersPage />} />
              <Route path="/account/bookings" element={<CustomerBookingsPage />} />
            </Route>

            {/* Standalone Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Operations Staff Routes */}
            <Route element={<StaffLayout />}>
              <Route path="/app/overview" element={<OwnerOverviewPage />} />
              <Route path="/app/pos" element={<PosTerminalPage />} />
              <Route path="/app/kitchen" element={<KitchenDisplayPage />} />
              <Route path="/app/tables" element={<TableManagementPage />} />
              <Route path="/hotel/overview" element={<HotelReceptionPage />} />
              <Route path="/hotel/housekeeping" element={<HousekeepingPage />} />
              <Route path="/app/inventory" element={<InventoryPage />} />
              <Route path="/app/reports" element={<ReportsPage />} />
            </Route>
          </Routes>

          {/* Floating Live Persona Switcher */}
          <DemoRoleSwitcher />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
