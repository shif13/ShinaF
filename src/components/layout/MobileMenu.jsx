import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, User, Package, Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const MobileMenu = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  
  const categories = [
    { name: 'Women', path: '/shop?subcategory=WOMEN' },
    { name: 'Men', path: '/shop?subcategory=MEN' },
    { name: 'Kids', path: '/shop?subcategory=KIDS' },
    { name: 'Home Decor', path: '/shop?category=HOMEDECOR' },
    { name: 'Accessories', path: '/shop?category=ACCESSORIES' },
  ];
  
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  const handleLinkClick = () => {
    toggleMobileMenu();
  };
  
  const handleLogout = () => {
    logout();
    toggleMobileMenu();
  };
  
  if (!isMobileMenuOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="overlay animate-fade-in"
        onClick={toggleMobileMenu}
      />
      
      {/* Drawer */}
      <div className="drawer-left animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brown-100 safe-top">
          <div className="text-xl font-display font-bold">
            <span className="gradient-text">Shina</span>
            <span className="text-brown-800"> Boutique</span>
          </div>
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin safe-bottom">
          {/* User Section */}
          {isAuthenticated ? (
            <div className="p-4 bg-cream-50 border-b border-brown-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-terracotta-600" />
                </div>
                <div>
                  <p className="font-medium text-brown-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-brown-600">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex flex-col items-center gap-1 p-2 text-brown-700 hover:bg-white rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs">Profile</span>
                </Link>
                
                <Link
                  to="/orders"
                  onClick={handleLinkClick}
                  className="flex flex-col items-center gap-1 p-2 text-brown-700 hover:bg-white rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span className="text-xs">Orders</span>
                </Link>
                
                <Link
                  to="/wishlist"
                  onClick={handleLinkClick}
                  className="flex flex-col items-center gap-1 p-2 text-brown-700 hover:bg-white rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-xs">Wishlist</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-cream-50 border-b border-brown-100">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="block w-full btn-primary text-center"
              >
                Login / Register
              </Link>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="py-2">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-brown-500 uppercase tracking-wider">
                Shop by Category
              </h3>
            </div>
            
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                onClick={handleLinkClick}
                className="flex items-center justify-between px-4 py-3 text-brown-700 hover:bg-brown-50 active:bg-brown-100 transition-colors"
              >
                <span className="font-medium">{category.name}</span>
                <ChevronRight className="w-5 h-5 text-brown-400" />
              </Link>
            ))}
            
            <div className="h-px bg-brown-100 my-2" />
            
            <Link
              to="/about"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-4 py-3 text-brown-700 hover:bg-brown-50 active:bg-brown-100 transition-colors"
            >
              <span className="font-medium">About Us</span>
              <ChevronRight className="w-5 h-5 text-brown-400" />
            </Link>
            
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-4 py-3 text-brown-700 hover:bg-brown-50 active:bg-brown-100 transition-colors"
            >
              <span className="font-medium">Contact</span>
              <ChevronRight className="w-5 h-5 text-brown-400" />
            </Link>
          </nav>
          
          {/* Logout */}
          {isAuthenticated && (
            <>
              <div className="h-px bg-brown-100 my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-brown-100 bg-cream-50">
          <p className="text-xs text-brown-600 text-center">
            © 2024 Shina Boutique. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;