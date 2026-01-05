// src/App.jsx - CORRECTED VERSION
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Payment Pages
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));

// Static Pages
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const FAQ = lazy(() => import('./pages/FAQ'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-terracotta-600"></div>
  </div>
);

// Cart Sync Component - Handles cart synchronization on auth changes
const CartSync = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { syncCart, logout: logoutCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      syncCart(user.id);
    } else {
      logoutCart();
    }
  }, [isAuthenticated, user?.id, syncCart, logoutCart]);

  return null;
};

function App() {
  return (
    <>
      {/* Cart Synchronization Component */}
      <CartSync />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Payment Pages */}
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-failed" element={<PaymentFailed />} />
            
            {/* Static Pages */}
            <Route path="terms" element={<TermsConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="shipping" element={<ShippingPolicy />} />
            <Route path="returns" element={<ReturnPolicy />} />
            <Route path="faq" element={<FAQ />} />
            
            {/* Protected User Routes */}
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;