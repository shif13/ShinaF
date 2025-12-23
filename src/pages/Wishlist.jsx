import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Trash2, Grid3x3, List, 
  Star, Share2, X, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { InlineLoader } from '../components/common/Spinner';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [processingItems, setProcessingItems] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view wishlist');
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await client.get('/users/wishlist');
      console.log('Wishlist response:', response.data); // Debug log
      if (response.data.success) {
        setWishlist(response.data.data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    console.log('Removing product ID:', productId); // Debug log
    setProcessingItems(prev => ({ ...prev, [productId]: 'removing' }));
    try {
      // Make sure we're passing just the product ID, not the wishlist item ID
      const response = await client.delete(`/users/wishlist/${productId}`);
      console.log('Remove response:', response.data); // Debug log
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      console.error('Error response:', error.response?.data); // Debug log
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    } finally {
      setProcessingItems(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  const handleAddToCart = async (product) => {
    setProcessingItems(prev => ({ ...prev, [product.id]: 'adding' }));
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        size: product.sizes?.[0] || null,
        color: product.colors?.[0] || null
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setProcessingItems(prev => {
        const newState = { ...prev };
        delete newState[product.id];
        return newState;
      });
    }
  };

  const handleMoveToCart = async (product) => {
    await handleAddToCart(product);
    await handleRemoveFromWishlist(product.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wishlist - Shina Boutique',
          text: 'Check out my wishlist!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Section className="min-h-screen">
        <Container>
          <InlineLoader text="Loading your wishlist..." />
        </Container>
      </Section>
    );
  }

  const items = wishlist?.items || [];

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                My Wishlist
              </h1>
              <p className="text-brown-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            {items.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                >
                  Share
                </Button>
                
                <div className="hidden sm:flex border border-brown-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-terracotta-600 text-white' 
                        : 'bg-white text-brown-600 hover:bg-cream-50'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-terracotta-600 text-white' 
                        : 'bg-white text-brown-600 hover:bg-cream-50'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Content */}
      <Section>
        <Container>
          {items.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <Heart className="w-12 h-12 text-red-300" />
              </div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-brown-600 mb-6">
                Save your favorite items here so you don't lose sight of them!
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/shop')}
                leftIcon={<ShoppingCart className="w-5 h-5" />}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}>
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item.product}
                  viewMode={viewMode}
                  onRemove={handleRemoveFromWishlist}
                  onAddToCart={handleAddToCart}
                  onMoveToCart={handleMoveToCart}
                  isProcessing={processingItems[item.product.id]}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Quick Actions */}
      {items.length > 0 && (
        <Section bg="cream" size="sm">
          <Container>
            <div className="bg-white rounded-lg border border-brown-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-brown-900 text-lg mb-1">
                  Love everything?
                </h3>
                <p className="text-brown-600 text-sm">
                  Add all items to your cart at once
                </p>
              </div>
              <Button
                variant="primary"
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                onClick={() => {
                  items.forEach(item => handleAddToCart(item.product));
                }}
              >
                Add All to Cart
              </Button>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
};

// Wishlist Item Component
const WishlistItem = ({ item, viewMode, onRemove, onAddToCart, onMoveToCart, isProcessing }) => {
  const navigate = useNavigate();
  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock < 10;

  const discount = item.compareAtPrice && item.compareAtPrice > item.price
    ? Math.round((1 - item.price / item.compareAtPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border-2 border-brown-200 p-4 flex gap-4 hover:border-terracotta-300 transition-colors">
        <div
          className="w-32 h-32 flex-shrink-0 bg-cream-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          <img
            src={item.images?.[0] || '/placeholder.png'}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-lg text-brown-900 mb-1 cursor-pointer hover:text-terracotta-600 transition-colors line-clamp-2"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            {item.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold text-terracotta-600">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <>
                <span className="text-sm text-brown-500 line-through">
                  ₹{item.compareAtPrice.toLocaleString('en-IN')}
                </span>
                <Badge variant="danger" size="sm">{discount}% OFF</Badge>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-brown-600 mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {item.ratingAverage || 0} ({item.ratingCount || 0})
            </span>
            {isOutOfStock ? (
              <Badge variant="danger" size="sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" size="sm">
                Only {item.stock} left
              </Badge>
            ) : (
              <Badge variant="success" size="sm">In Stock</Badge>
            )}
          </div>
          
          <p className="text-sm text-brown-600 line-clamp-2 mb-3">
            {item.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            onClick={() => onMoveToCart(item)}
            disabled={isOutOfStock || isProcessing}
            isLoading={isProcessing === 'adding'}
          >
            Move to Cart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X className="w-4 h-4" />}
            onClick={() => onRemove(item.id)}
            disabled={isProcessing}
            className="text-red-600 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg border-2 border-brown-200 overflow-hidden group hover:border-terracotta-300 transition-colors">
      <div
        className="relative aspect-square bg-cream-100 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${item.id}`)}
      >
        <img
          src={item.images?.[0] || '/placeholder.png'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Remove button clicked for product:', item.id); // Debug log
            onRemove(item.id);
          }}
          disabled={isProcessing}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
          aria-label="Remove from wishlist"
        >
          <X className="w-5 h-5 text-red-600" />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg">
              <p className="text-red-600 font-bold">Out of Stock</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-brown-900 mb-2 line-clamp-2 cursor-pointer hover:text-terracotta-600 transition-colors min-h-[3rem]"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          {item.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-terracotta-600">
            ₹{item.price.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-sm text-brown-500 line-through">
              ₹{item.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-brown-600 mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {item.ratingAverage || 0}
          </span>
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" size="sm">
              Only {item.stock} left
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <Button
            variant="primary"
            className="w-full"
            size="sm"
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock || isProcessing}
            isLoading={isProcessing === 'adding'}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;