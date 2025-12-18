import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import CartDrawer from '../components/layout/CartDrawer';
import Breadcrumbs from '../components/layout/BreadCrumbs';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Mobile Menu */}
      <MobileMenu />
      
      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;