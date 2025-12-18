import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import Button from '../common/Button';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { isCartDrawerOpen, toggleCartDrawer } = useUIStore();
  
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);
  
  if (!isCartDrawerOpen) return null;
  
  const subtotal = getTotal();
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="overlay animate-fade-in"
        onClick={toggleCartDrawer}
      />
      
      {/* Drawer */}
      <div className="drawer-right animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brown-100 safe-top">
          <h2 className="text-lg font-display font-bold text-brown-900">
            Shopping Cart
            {items.length > 0 && (
              <span className="ml-2 text-terracotta-600">({items.length})</span>
            )}
          </h2>
          
          <button
            onClick={toggleCartDrawer}
            className="p-2 text-brown-700 hover:bg-brown-50 rounded-lg active:scale-95 transition-all"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-brown-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-brown-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-brown-600 mb-6">
              Add some beautiful items to get started!
            </p>
            <Button
              variant="primary"
              onClick={() => {
                toggleCartDrawer();
              }}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-4 p-3 bg-cream-50 rounded-lg"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                      <img
                        src={item.images?.[0] || '/placeholder.png'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-brown-900 line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-brown-600 mb-2">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span>•</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-brown-200 hover:bg-white active:scale-95 transition-all"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="w-8 text-center font-medium text-brown-900">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-brown-200 hover:bg-white active:scale-95 transition-all"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-terracotta-600">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="flex-shrink-0 p-2 text-brown-400 hover:text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-brown-100 p-4 space-y-4 safe-bottom">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-brown-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-brown-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                
                {subtotal < 1000 && subtotal > 0 && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                )}
                
                <div className="pt-2 border-t border-brown-200">
                  <div className="flex items-center justify-between text-lg font-bold text-brown-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-2">
                <Link to="/checkout" onClick={toggleCartDrawer}>
                  <Button variant="primary" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/cart" onClick={toggleCartDrawer}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;