import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import Button from '../common/Button';
import Input from '../common/Input';

const ProductFormModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'CLOTHING',
    subcategory: 'WOMEN',
    price: '',
    compareAtPrice: '',
    stock: '',
    sizes: [],
    colors: [],
    featured: false,
    tags: []
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'CLOTHING',
        subcategory: product.subcategory || 'WOMEN',
        price: product.price || '',
        compareAtPrice: product.compareAtPrice || '',
        stock: product.stock || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        featured: product.featured || false,
        tags: product.tags || []
      });
      setImages(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    // Preview images
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append basic text fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('subcategory', formData.subcategory);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      submitData.append('featured', formData.featured);
      
      // Append optional fields
      if (formData.compareAtPrice) {
        submitData.append('compareAtPrice', formData.compareAtPrice);
      }

      // Append arrays as JSON strings
      // In ProductFormModal.jsx handleSubmit function, replace this:
if (formData.sizes && formData.sizes.length > 0) {
  submitData.append('sizes', JSON.stringify(formData.sizes));
}

// With this:
if (formData.sizes && formData.sizes.length > 0) {
  formData.sizes.forEach(size => {
    submitData.append('sizes[]', size);
  });
}

// Same for colors:
if (formData.colors && formData.colors.length > 0) {
  formData.colors.forEach(color => {
    submitData.append('colors[]', color);
  });
}

// Same for tags:
if (formData.tags && formData.tags.length > 0) {
  formData.tags.forEach(tag => {
    submitData.append('tags[]', tag);
  });
}
      
      if (formData.colors && formData.colors.length > 0) {
        submitData.append('colors', JSON.stringify(formData.colors));
      }
      
      if (formData.tags && formData.tags.length > 0) {
        submitData.append('tags', JSON.stringify(formData.tags));
      }

      // Append image files
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (product) {
        // Update existing product
        await client.put(`/admin/products/${product.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        // Create new product
        await client.post('/admin/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully!');
      }

      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.message ||
                          'Failed to save product';
      
      toast.error(errorMessage);
      
      // Log validation errors if any
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-lg shadow-strong z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brown-200">
          <h2 className="text-2xl font-display font-bold text-brown-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-brown-50 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-3">
                Product Images {!product && <span className="text-red-500">*</span>}
              </label>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-cream-100 rounded-lg overflow-hidden">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-brown-300 rounded-lg hover:bg-cream-50 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-brown-600" />
                <span className="text-brown-600">Upload Images (Max 5)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-brown-500 mt-2">
                {!product && 'At least one image is required. '}Maximum 5 images, 5MB each (JPEG, PNG, GIF, WebP)
              </p>
            </div>

            {/* Name & Description */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Elegant Silk Saree"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                placeholder="Detailed product description..."
                required
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  required
                >
                  <option value="CLOTHING">Clothing</option>
                  <option value="FOOTWEAR">Footwear</option>
                  <option value="ACCESSORIES">Accessories</option>
                  <option value="HOMEDECOR">Home Decor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  required
                >
                  <option value="WOMEN">Women</option>
                  <option value="MEN">Men</option>
                  <option value="KIDS">Kids</option>
                  <option value="PETS">Pets</option>
                  <option value="ALL">All</option>
                </select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Price (₹)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="999"
                min="0"
                step="0.01"
                required
              />
              <Input
                type="number"
                label="Compare Price (₹)"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                placeholder="1499"
                min="0"
                step="0.01"
                helperText="Original price before discount"
              />
              <Input
                type="number"
                label="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                min="0"
                required
              />
            </div>

            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sizes (comma-separated)"
                name="sizes"
                value={formData.sizes.join(', ')}
                onChange={(e) => handleArrayInput('sizes', e.target.value)}
                placeholder="S, M, L, XL"
                helperText="Optional. Leave empty if not applicable"
              />
              <Input
                label="Colors (comma-separated)"
                name="colors"
                value={formData.colors.join(', ')}
                onChange={(e) => handleArrayInput('colors', e.target.value)}
                placeholder="Red, Blue, Green"
                helperText="Optional. Leave empty if not applicable"
              />
            </div>

            {/* Tags */}
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayInput('tags', e.target.value)}
              placeholder="summer, casual, trending"
              helperText="Optional. Used for search and filtering"
            />

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-terracotta-600 border-brown-300 rounded focus:ring-terracotta-500"
              />
              <label htmlFor="featured" className="text-sm text-brown-700">
                Mark as Featured Product
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading} className="flex-1">
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductFormModal;