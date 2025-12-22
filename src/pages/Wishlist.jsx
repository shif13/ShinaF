// src/pages/Shop.jsx - UPDATED WITH WISHLIST STATE
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, X, Grid3x3, List, Heart, ShoppingCart, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import { InlineLoader } from '../components/common/Spinner';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistedItems, setWishlistedItems] = useState(new Set()); // Track wishlisted items
  
  // Filters from URL
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const page = parseInt(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';
  
  const [localFilters, setLocalFilters] = useState({
    category,
    subcategory,
    minPrice,
    maxPrice,
    search,
    sort,
    featured
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, minPrice, maxPrice, search, sort, order, page, featured]);

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistedItems(new Set());
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (order) params.append('order', order);
      if (page) params.append('page', page);
      if (featured) params.append('featured', featured);

      const response = await client.get(`/products?${params.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await client.get('/users/wishlist');
      if (response.data.success) {
        const wishlist = response.data.data.wishlist;
        const productIds = new Set(
          wishlist?.items?.map(item => item.product.id) || []
        );
        setWishlistedItems(productIds);
      }
    } catch (error) {
      // Silently fail - user might not be logged in
      console.log('Could not fetch wishlist:', error);
    }
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    setSearchParams(params);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'createdAt',
      featured: ''
    });
    setSearchParams({});
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        quantity: 1,
        size: product.sizes?.[0] || null,
        color: product.colors?.[0] || null
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleToggleWishlist = async (productId, isCurrentlyWishlisted) => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isCurrentlyWishlisted) {
        // Remove from wishlist
        await client.delete(`/users/wishlist/${productId}`);
        setWishlistedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await client.post(`/users/wishlist/${productId}`);
        setWishlistedItems(prev => new Set([...prev, productId]));
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const activeFilterCount = [category, subcategory, minPrice, maxPrice, featured].filter(Boolean).length;

  if (loading) {
    return (
      <Section className="min-h-screen">
        <Container>
          <InlineLoader text="Loading products..." />
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">
                {search ? `Search Results for "${search}"` : 'Shop'}
              </h1>
              <p className="text-brown-600 mt-1">
                {pagination.totalProducts} {pagination.totalProducts === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-brown-200 rounded-lg hover:bg-cream-50 transition-colors relative"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-terracotta-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex border border-brown-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-terracotta-600 text-white' 
                      : 'bg-white text-brown-600 hover:bg-cream-50'
                  }`}
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
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Filter Sidebar - keeping your existing filter code */}
      {/* ... rest of your filter code ... */}

      {/* Products Grid */}
      <Section>
        <Container>
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-2">
                No Products Found
              </h2>
              <p className="text-brown-600 mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button variant="primary" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isAddingToCart={addingToCart[product.id]}
                  isWishlisted={wishlistedItems.has(product.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                disabled={pagination.currentPage === 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', pagination.currentPage - 1);
                  setSearchParams(params);
                }}
              >
                Previous
              </Button>
              
              <span className="px-4 py-2 text-brown-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', pagination.currentPage + 1);
                  setSearchParams(params);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  viewMode, 
  onAddToCart, 
  onToggleWishlist, 
  isAddingToCart, 
  isWishlisted 
}) => {
  const navigate = useNavigate();
  
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-brown-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
        <div
          className="w-32 h-32 flex-shrink-0 bg-cream-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-lg text-brown-900 mb-2 line-clamp-2 cursor-pointer hover:text-terracotta-600 transition-colors"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-terracotta-600">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <>
                <span className="text-sm text-brown-500 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-brown-600 mb-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{product.ratingAverage || 0}</span>
            <span>({product.ratingCount || 0})</span>
          </div>
          
          <p className="text-sm text-brown-600 line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onToggleWishlist(product.id, isWishlisted)}
            className={`p-2 border rounded-lg transition-all ${
              isWishlisted
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-brown-200 hover:bg-terracotta-50 hover:border-terracotta-200'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''
              }`}
            />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isAddingToCart || isOutOfStock}
            className="p-2 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-brown-100 overflow-hidden group hover:shadow-md transition-shadow">
      <div
        className="relative aspect-square bg-cream-100 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        
        {product.featured && (
          <div className="absolute top-3 right-12 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            ⭐ Featured
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id, isWishlisted);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isWishlisted
              ? 'bg-red-50 text-red-600 scale-110'
              : 'bg-white hover:bg-terracotta-50 hover:text-terracotta-600'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isWishlisted ? 'fill-red-500 animate-pulse' : ''
            }`}
          />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold text-red-600">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-brown-900 mb-2 line-clamp-2 cursor-pointer hover:text-terracotta-600 transition-colors"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-terracotta-600">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-sm text-brown-500 line-through">
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-brown-600 mb-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{product.ratingAverage || 0}</span>
          <span className="text-brown-400">({product.ratingCount || 0})</span>
        </div>
        
        <Button
          variant="primary"
          className="w-full"
          onClick={() => onAddToCart(product)}
          disabled={isAddingToCart || isOutOfStock}
          isLoading={isAddingToCart}
          leftIcon={<ShoppingCart className="w-5 h-5" />}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default Shop;