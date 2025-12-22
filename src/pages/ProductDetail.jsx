import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Minus, Plus, Star, Check, 
  Truck, Package, RotateCcw, Shield, ChevronLeft, ChevronRight,
  X, ZoomIn, Share2, Facebook, Twitter, Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { PageLoader } from '../components/common/Spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const carouselRef = useRef(null);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/products/${id}`);
      if (response.data.success) {
        const productData = response.data.data;
        setProduct(productData);
        if (productData.sizes && productData.sizes.length > 0) setSelectedSize(productData.sizes[0]);
        if (productData.colors && productData.colors.length > 0) setSelectedColor(productData.colors[0]);
        fetchRelatedProducts(productData.category, productData.id);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load product');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentId) => {
  try {
    // Don't fetch if category is undefined/null
    if (!category) {
      console.log('No category provided, skipping related products');
      return;
    }
    
    const response = await client.get(`/products?category=${category}&limit=4`);
    if (response.data.success) {
      const filtered = response.data.data.products.filter(p => p.id !== currentId);
      setRelatedProducts(filtered.slice(0, 4));
    }
  } catch (error) {
    console.error('Error fetching related products:', error);
    // Don't show error to user, just skip related products
  }
};

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    setAddingToCart(true);
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        size: selectedSize || null,
        color: selectedColor || null,
        quantity: quantity
      });
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    setAddingToWishlist(true);
    try {
      await client.post(`/users/wishlist/${product.id}`);
      toast.success('Added to wishlist!');
    } catch (error) {
      if (error.response?.status === 409) toast('Already in wishlist');
      else toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) setQuantity(newQuantity);
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.name}`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
    setIsShareOpen(false);
  };

  if (loading) return <PageLoader />;
  
  if (!product) return (
    <Section className="min-h-screen flex items-center justify-center">
      <Container>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">Product Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </Container>
    </Section>
  );

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock < 10;

  return (
    <>
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-cream-100 rounded-lg overflow-hidden group">
                <img 
                  src={product.images[selectedImage] || '/placeholder.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                />
                
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ZoomIn className="w-5 h-5 text-brown-900" />
                </button>
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && <Badge variant="danger" size="lg" className="font-bold">{discount}% OFF</Badge>}
                  {product.featured && <Badge variant="warning" size="lg" className="font-bold">⭐ Featured</Badge>}
                </div>
                
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button 
                      key={index} 
                      onClick={() => setSelectedImage(index)} 
                      className={`aspect-square bg-cream-100 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-terracotta-600 ring-2 ring-terracotta-200' : 'border-transparent hover:border-brown-200'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.ratingAverage) ? 'fill-amber-400 text-amber-400' : 'text-brown-300'}`} />
                    ))}
                    <span className="ml-2 text-brown-600">{product.ratingAverage} ({product.ratingCount} reviews)</span>
                  </div>
                  {product.category && <Badge variant="info">{product.category}</Badge>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-terracotta-600">₹{product.price.toLocaleString()}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xl text-brown-500 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                  )}
                </div>
                
                <div className="relative">
                  <button onClick={() => setIsShareOpen(!isShareOpen)} className="p-2 border-2 border-brown-200 rounded-lg hover:bg-brown-50 transition-colors">
                    <Share2 className="w-5 h-5 text-brown-700" />
                  </button>
                  
                  {isShareOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsShareOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-brown-100 z-20 p-2">
                        <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                          <Facebook className="w-5 h-5" />
                          <span className="text-sm font-medium">Facebook</span>
                        </button>
                        <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sky-50 text-sky-600 transition-colors">
                          <Twitter className="w-5 h-5" />
                          <span className="text-sm font-medium">Twitter</span>
                        </button>
                        <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          <span className="text-sm font-medium">WhatsApp</span>
                        </button>
                        <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brown-50 text-brown-700 transition-colors">
                          <LinkIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">Copy Link</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                {inStock ? (
                  lowStock ? (
                    <p className="text-amber-600 font-medium flex items-center gap-2"><Package className="w-5 h-5" />Only {product.stock} left!</p>
                  ) : (
                    <p className="text-green-600 font-medium flex items-center gap-2"><Check className="w-5 h-5" />In Stock</p>
                  )
                ) : (
                  <p className="text-red-600 font-medium">Out of Stock</p>
                )}
              </div>

              <p className="text-brown-700 leading-relaxed">{product.description}</p>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-3">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedSize === size ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-700' : 'border-brown-200 hover:border-brown-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-3">
                    Color: <span className="font-bold text-brown-900">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-terracotta-600 ring-2 ring-terracotta-200 scale-110' : 'border-brown-200 hover:border-brown-300'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-brown-200 rounded-lg">
                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 font-semibold text-lg">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="p-3 hover:bg-brown-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-brown-600">{product.stock} available</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" size="lg" className="flex-1" leftIcon={<ShoppingCart className="w-5 h-5" />} onClick={handleAddToCart} disabled={!inStock || addingToCart} isLoading={addingToCart}>
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <button onClick={handleAddToWishlist} disabled={addingToWishlist} className="p-4 border-2 border-brown-200 rounded-lg hover:bg-terracotta-50 hover:border-terracotta-200 hover:text-terracotta-600 transition-colors disabled:opacity-50">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-brown-100">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-brown-900">Free Shipping</p>
                    <p className="text-brown-600">On orders over ₹1000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-brown-900">Secure Payment</p>
                    <p className="text-brown-600">100% secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-brown-900">Easy Returns</p>
                    <p className="text-brown-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-brown-900">Quality Check</p>
                    <p className="text-brown-600">Verified products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section bg="white" className="border-t border-brown-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex border-b border-brown-200 overflow-x-auto scrollbar-hide">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'text-terracotta-600 border-b-2 border-terracotta-600' : 'text-brown-600 hover:text-brown-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose prose-brown max-w-none">
                  <p className="text-brown-700 leading-relaxed">{product.description}</p>
                  {product.details && (
                    <div className="mt-6">
                      <h3 className="font-display font-semibold text-xl text-brown-900 mb-4">Product Details</h3>
                      <p className="text-brown-700 whitespace-pre-line">{product.details}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="font-display font-semibold text-xl text-brown-900 mb-4">Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex py-3 border-b border-brown-100">
                      <span className="w-1/3 font-medium text-brown-900">Category</span>
                      <span className="w-2/3 text-brown-700">{product.category}</span>
                    </div>
                    {product.subcategory && (
                      <div className="flex py-3 border-b border-brown-100">
                        <span className="w-1/3 font-medium text-brown-900">Subcategory</span>
                        <span className="w-2/3 text-brown-700">{product.subcategory}</span>
                      </div>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex py-3 border-b border-brown-100">
                        <span className="w-1/3 font-medium text-brown-900">Available Sizes</span>
                        <span className="w-2/3 text-brown-700">{product.sizes.join(', ')}</span>
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex py-3 border-b border-brown-100">
                        <span className="w-1/3 font-medium text-brown-900">Available Colors</span>
                        <span className="w-2/3 text-brown-700">{product.colors.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex py-3 border-b border-brown-100">
                      <span className="w-1/3 font-medium text-brown-900">SKU</span>
                      <span className="w-2/3 text-brown-700 font-mono">{product.sku || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display font-semibold text-xl text-brown-900">Customer Reviews</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.ratingAverage) ? 'fill-amber-400 text-amber-400' : 'text-brown-300'}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-brown-900">{product.ratingAverage}</span>
                        <span className="text-brown-600">({product.ratingCount} reviews)</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Write a Review</Button>
                  </div>
                  <div className="space-y-6">
                    {product.ratingCount === 0 ? (
                      <p className="text-center text-brown-600 py-8">No reviews yet. Be the first to review this product!</p>
                    ) : (
                      <p className="text-center text-brown-600 py-8">Reviews will be displayed here</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {relatedProducts.length > 0 && (
        <Section>
          <Container>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-brown-900">You May Also Like</h2>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel('left')} className="p-2 border-2 border-brown-200 rounded-lg hover:bg-brown-50 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollCarousel('right')} className="p-2 border-2 border-brown-200 rounded-lg hover:bg-brown-50 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div ref={carouselRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-brown-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer snap-start"
                >
                  <div className="relative aspect-square bg-cream-100 overflow-hidden">
                    <img src={relatedProduct.images?.[0] || '/placeholder.png'} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-brown-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-terracotta-600">₹{relatedProduct.price.toLocaleString()}</span>
                      {relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price && (
                        <span className="text-sm text-brown-500 line-through">₹{relatedProduct.compareAtPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsLightboxOpen(false)}>
          <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-8 h-8 text-white" />
          </button>
          
          <div className="relative max-w-5xl w-full">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-auto max-h-[90vh] object-contain" />
            
            {product.images.length > 1 && (
              <>
                <button onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`w-2 h-2 rounded-full transition-all ${selectedImage === index ? 'bg-white w-8' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;