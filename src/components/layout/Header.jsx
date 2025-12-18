import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ShoppingCart, User, Heart, 
  Package, LogOut, ChevronDown 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import Container from '../ui/Container';
import Badge from '../common/Badge';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { toggleMobileMenu, toggleCartDrawer } = useUIStore();
  const { scrollPosition, scrollDirection } = useScrollPosition();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cartItemCount = getItemCount();
  
  // Hide header on scroll down, show on scroll up
  const isHeaderVisible = scrollDirection === 'up' || scrollPosition < 100;
  
  const categories = [
    { name: 'Women', path: '/shop?subcategory=WOMEN' },
    { name: 'Men', path: '/shop?subcategory=MEN' },
    { name: 'Kids', path: '/shop?subcategory=KIDS' },
    { name: 'Home Decor', path: '/shop?category=HOMEDECOR' },
    { name: 'Accessories', path: '/shop?category=ACCESSORIES' },
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };
  
  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-brown-100 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden lg:block bg-terracotta-600 text-white text-sm">
          <Container>
            <div className="flex items-center justify-between py-2">
              <p>Free shipping on orders over ₹1000</p>
              <div className="flex items-center gap-4">
                <Link to="/about" className="hover:underline">About Us</Link>
                <span>|</span>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </div>
            </div>
          </Container>
        </div>
        
        {/* Main Header */}
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 -ml-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
            >
              <div className="text-2xl md:text-3xl font-display font-bold">
                <span className="gradient-text">Shina</span>
                <span className="text-brown-800"> Boutique</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Shop Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-brown-700 font-medium hover:text-terracotta-600 transition-colors py-2">
                  Shop
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-brown-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="block px-4 py-3 text-brown-700 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="text-brown-700 font-medium hover:text-terracotta-600 transition-colors"
              >
                About
              </Link>
              
              <Link 
                to="/contact" 
                className="text-brown-700 font-medium hover:text-terracotta-600 transition-colors"
              >
                Contact
              </Link>
            </nav>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
                aria-label="Search"
              >
                {isSearchOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Search className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>
              
              {/* Wishlist - Desktop only */}
              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="hidden md:block p-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
                  aria-label="Wishlist"
                >
                  <Heart className="w-6 h-6" />
                </Link>
              )}
              
              {/* Cart */}
              <button
                onClick={toggleCartDrawer}
                className="relative p-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  
                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-medium border border-brown-100 z-20 animate-scale-in">
                        <div className="px-4 py-3 border-b border-brown-100">
                          <p className="font-medium text-brown-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-brown-600">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-brown-700 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-brown-700 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="w-4 h-4" />
                            <span>Orders</span>
                          </Link>
                          
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-3 px-4 py-2 text-brown-700 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            <span>Wishlist</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-2 text-sm font-medium text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-all active:scale-95"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </Container>
        
        {/* Search Bar - Expandable */}
        {isSearchOpen && (
          <div className="border-t border-brown-100 bg-cream-50 animate-slide-in-up">
            <Container>
              <form onSubmit={handleSearch} className="py-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-base"
                    autoFocus
                  />
                </div>
              </form>
            </Container>
          </div>
        )}
      </header>
      
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 md:h-20 lg:h-[88px]" />
    </>
  );
};

export default Header;