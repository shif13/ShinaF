import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Heart, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const subtotal = getTotal();
  const shipping = subtotal >= 1000 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };
  
  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;
    
    if (newQuantity < 1) {
      return;
    }
    
    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    
    updateQuantity(item.id, item.size, newQuantity);
  };
  
  const handleRemoveItem = (item) => {
    removeItem(item.id, item.size);
    toast.success('Item removed from cart');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <Section className="min-h-[60vh] flex items-center justify-center">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-brown-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-brown-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-brown-600 mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" leftIcon={<ShoppingBag className="w-5 h-5" />}>
                Start Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">Shopping Cart</h1>
              <p className="text-brown-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <button
              onClick={handleClearCart}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear Cart</span>
            </button>
          </div>
        </Container>
      </Section>

      {/* Cart Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.size}-${item.color}`}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
              
              {/* Mobile Clear Cart */}
              <button
                onClick={handleClearCart}
                className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg border-2 border-red-200 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Clear Cart</span>
              </button>
            </div>

            {/* Order Summary - Sticky on desktop */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-brown-200 p-6 lg:sticky lg:top-24 shadow-sm">
                <h2 className="text-xl font-display font-bold text-brown-900 mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-brown-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex items-center justify-between text-brown-700">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Free Shipping Progress */}
                  {subtotal < 1000 && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-900 font-medium mb-2">
                        Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for FREE shipping! 🎉
                      </p>
                      <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-amber-600 h-full transition-all duration-300"
                          style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Tax */}
                  <div className="flex items-center justify-between text-brown-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="h-px bg-brown-200" />
                  
                  {/* Total */}
                  <div className="flex items-center justify-between text-brown-900">
                    <span className="text-lg font-display font-bold">Total</span>
                    <span className="text-2xl font-display font-bold text-terracotta-600">
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Link to="/shop">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      leftIcon={<ArrowLeft className="w-5 h-5" />}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
                
                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-brown-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-brown-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Secure checkout</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-brown-600">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span>100% secure payment</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-brown-600">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span>Easy returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Recommended Products Section */}
      <Section bg="cream" className="border-t border-brown-100">
        <Container>
          <h2 className="text-2xl font-display font-bold text-brown-900 mb-6">
            You May Also Like
          </h2>
          <p className="text-brown-600 mb-8">
            Continue shopping to discover more amazing products
          </p>
          <Link to="/shop">
            <Button variant="primary">
              Browse Products
            </Button>
          </Link>
        </Container>
      </Section>
    </>
  );
};

// Cart Item Component
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const navigate = useNavigate();
  
  const itemTotal = item.price * item.quantity;
  const isLowStock = item.stock < 10;
  const isOutOfStock = item.stock === 0;
  
  return (
    <div className="bg-white rounded-lg border-2 border-brown-100 p-4 md:p-6 hover:border-brown-200 transition-colors">
      <div className="flex gap-4">
        {/* Image */}
        <div 
          className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-cream-100 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          <img
            src={item.images?.[0] || '/placeholder.png'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-lg text-brown-900 mb-1 line-clamp-2 cursor-pointer hover:text-terracotta-600 transition-colors"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-brown-600 mb-2">
                {item.size && (
                  <span className="px-2 py-0.5 bg-cream-100 rounded">
                    Size: {item.size}
                  </span>
                )}
                {item.color && (
                  <span className="px-2 py-0.5 bg-cream-100 rounded flex items-center gap-1">
                    Color: 
                    <span 
                      className="w-3 h-3 rounded-full border border-brown-300 ml-1"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                    {item.color}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              {isOutOfStock ? (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              ) : isLowStock ? (
                <p className="text-sm text-amber-600 font-medium">
                  Only {item.stock} left in stock!
                </p>
              ) : (
                <p className="text-sm text-green-600">In Stock</p>
              )}
            </div>
            
            {/* Remove Button - Desktop */}
            <button
              onClick={() => onRemove(item)}
              className="hidden md:block p-2 text-brown-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Price & Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-brown-600 font-medium">Quantity:</span>
              <div className="flex items-center border-2 border-brown-200 rounded-lg">
                <button
                  onClick={() => onQuantityChange(item, -1)}
                  disabled={item.quantity <= 1}
                  className="p-2 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="px-4 font-semibold text-brown-900 min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => onQuantityChange(item, 1)}
                  disabled={item.quantity >= item.stock || isOutOfStock}
                  className="p-2 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <p className="text-sm text-brown-600">
                  ₹{item.price.toLocaleString('en-IN')} each
                </p>
                <p className="text-xl font-bold text-terracotta-600">
                  ₹{itemTotal.toLocaleString('en-IN')}
                </p>
              </div>
              
              {/* Remove Button - Mobile */}
              <button
                onClick={() => onRemove(item)}
                className="md:hidden p-2 text-brown-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;