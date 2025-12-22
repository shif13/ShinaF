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
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [addingToCart, setAddingToCart] = useState({});
  
  const { isAuthenticated } = useAuthStore();
  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  
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
    totalProducts: 0,
    limit: 12
  });

  // Categories from your Prisma schema
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'CLOTHING', label: 'Clothing' },
    { value: 'FOOTWEAR', label: 'Footwear' },
    { value: 'ACCESSORIES', label: 'Accessories' },
    { value: 'HOMEDECOR', label: 'Home Decor' }
  ];

  const subcategories = [
    { value: '', label: 'All' },
    { value: 'WOMEN', label: 'Women' },
    { value: 'MEN', label: 'Men' },
    { value: 'KIDS', label: 'Kids' },
    { value: 'PETS', label: 'Pets' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'ratingAverage', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Fetch wishlist when authenticated
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
      if (featured) params.append('featured', featured);
      params.append('sort', sort);
      params.append('order', order);
      params.append('page', page);
      params.append('limit', '12');

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
      console.log('Could not fetch wishlist:', error);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to first page when filters change
    setSearchParams(newParams);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    newParams.set('page', '1');
    setSearchParams(newParams);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
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

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">Shop</h1>
              <p className="text-brown-600 mt-1">
                {pagination.totalProducts} {pagination.totalProducts === 1 ? 'product' : 'products'} found
              </p>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-4">
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex border border-brown-200 rounded-lg overflow-hidden">
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
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="sm:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-brown-200 rounded-lg hover:bg-cream-50 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-terracotta-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </Container>
      </Section>

      {/* Main Content */}
      <Section>
        <Container>
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-brown-100 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-lg">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-terracotta-600 hover:text-terracotta-700 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Shop For
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => updateFilter('subcategory', e.target.value)}
                      className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    >
                      {subcategories.map(sub => (
                        <option key={sub.value} value={sub.value}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                      <span className="text-brown-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>

                  {/* Featured */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured === 'true'}
                        onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                        className="w-4 h-4 text-terracotta-600 border-brown-300 rounded focus:ring-terracotta-500"
                      />
                      <span className="text-sm text-brown-700">Featured Products Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid/List */}
            <main className="flex-1">
              {loading ? (
                <InlineLoader text="Loading products..." />
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-brown-600 text-lg mb-4">No products found</p>
                  <Button variant="primary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
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

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => updateFilter('page', Math.max(1, page - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </Button>
                        
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => updateFilter('page', pageNum)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                page === pageNum
                                  ? 'bg-terracotta-600 text-white'
                                  : 'border border-brown-200 hover:bg-cream-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        {pagination.totalPages > 5 && (
                          <>
                            <span className="px-2">...</span>
                            <button
                              onClick={() => updateFilter('page', pagination.totalPages)}
                              className={`px-4 py-2 rounded-lg border border-brown-200 hover:bg-cream-50`}
                            >
                              {pagination.totalPages}
                            </button>
                          </>
                        )}
                        
                        <Button
                          variant="outline"
                          onClick={() => updateFilter('page', Math.min(pagination.totalPages, page + 1))}
                          disabled={page === pagination.totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </Container>
      </Section>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in" 
            onClick={() => setIsFilterOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 p-6 overflow-y-auto safe-top safe-bottom animate-slide-in-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">Filters</h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-brown-50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-brown-200 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">Shop For</label>
                <select
                  value={localFilters.subcategory}
                  onChange={(e) => setLocalFilters({...localFilters, subcategory: e.target.value})}
                  className="w-full px-3 py-2 border border-brown-200 rounded-lg"
                >
                  {subcategories.map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) => setLocalFilters({...localFilters, minPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-brown-200 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) => setLocalFilters({...localFilters, maxPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-brown-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.featured === 'true'}
                    onChange={(e) => setLocalFilters({...localFilters, featured: e.target.checked ? 'true' : ''})}
                    className="w-4 h-4 text-terracotta-600 border-brown-300 rounded"
                  />
                  <span className="text-sm text-brown-700">Featured Products Only</span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={applyFilters}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const ProductCard = ({ product, viewMode, onAddToCart, onToggleWishlist, isAddingToCart, isWishlisted }) => {
  const navigate = useNavigate();

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

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
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-lg text-brown-900 mb-1 cursor-pointer hover:text-terracotta-600 transition-colors line-clamp-1"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold text-terracotta-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-sm text-brown-500 line-through">
                  ₹{product.compareAtPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-brown-600 mb-2">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {product.ratingAverage} ({product.ratingCount})
            </span>
            <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
              {product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
            </span>
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
                isWishlisted ? 'fill-red-500' : ''
              }`}
            />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isAddingToCart || product.stock === 0}
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
              isWishlisted ? 'fill-red-500' : ''
            }`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-brown-900 mb-2 line-clamp-2 cursor-pointer hover:text-terracotta-600 transition-colors"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-terracotta-600">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-brown-500 line-through">
              ₹{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-brown-600 mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {product.ratingAverage} ({product.ratingCount})
          </span>
          <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
            {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
          </span>
        </div>
        
        <Button
          variant="primary"
          className="w-full"
          leftIcon={<ShoppingCart className="w-4 h-4" />}
          onClick={() => onAddToCart(product)}
          disabled={isAddingToCart || product.stock === 0}
          isLoading={isAddingToCart}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default Shop;