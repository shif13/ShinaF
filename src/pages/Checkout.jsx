// ============================================
// FILE: src/pages/Checkout.jsx - CARD PAYMENT ONLY (SIMPLE & CLEAN)
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { 
  MapPin, Plus, Lock, ArrowLeft, Loader, CreditCard, Package, Truck, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import StripePayment from '../components/checkout/StripePayment';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // Stripe states
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: user?.phone || '',
    isDefault: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, items, navigate]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await client.get('/users/addresses');
      if (response.data.success) {
        const addressList = response.data.data.addresses;
        setAddresses(addressList);
        
        const defaultAddr = addressList.find(addr => addr.isDefault);
        setSelectedAddress(defaultAddr || addressList[0] || null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    try {
      const response = await client.post('/users/addresses', newAddress);
      if (response.data.success) {
        toast.success('Address added successfully');
        setShowAddressForm(false);
        fetchAddresses();
        
        setNewAddress({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
          phone: user?.phone || '',
          isDefault: false
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setPlacingOrder(true);

    try {
      // Step 1: Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.product?._id || item.id || item.productId,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null
        })),
        shippingAddress: selectedAddress,
        paymentMethod: 'CARD' // Always CARD
      };

      const orderResponse = await client.post('/orders', orderData);

      if (orderResponse.data.success) {
        const order = orderResponse.data.data.order;
        setOrderId(order.id);
        
        // Step 2: Create Stripe payment intent
        const paymentResponse = await client.post('/payment/create-intent', {
          orderId: order.id
        });

        if (paymentResponse.data.success) {
          setClientSecret(paymentResponse.data.data.clientSecret);
          setShowStripeForm(true);
          toast.success('Please complete your payment');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Verify payment with backend
      await client.post('/payment/verify', {
        paymentIntentId: paymentIntent.id,
        orderId: orderId
      });

      toast.success('Payment successful!');
      clearCart();
      navigate(`/orders/${orderId}`, { 
        state: { orderSuccess: true, paymentSuccess: true } 
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
    setShowStripeForm(false);
    setClientSecret('');
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-terracotta-600 mx-auto mb-4" />
          <p className="text-brown-600">Loading checkout...</p>
        </div>
      </Section>
    );
  }

  // If showing Stripe payment form
  if (showStripeForm && clientSecret) {
    return (
      <Section>
        <Container>
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => {
                setShowStripeForm(false);
                setClientSecret('');
              }}
              className="flex items-center gap-2 text-brown-600 hover:text-brown-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to checkout</span>
            </button>

            <div className="bg-white rounded-lg border-2 border-brown-200 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-brown-900 mb-2">
                  Complete Payment
                </h2>
                <p className="text-brown-600">
                  Secure card payment powered by Stripe
                </p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Your card details are encrypted and never stored on our servers
                  </p>
                </div>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePayment
                  amount={total}
                  orderId={orderId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-brown-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">Checkout</h1>
              <p className="text-brown-600 mt-1">Complete your purchase</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-white rounded-lg border-2 border-brown-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-terracotta-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-brown-900">
                        Delivery Address
                      </h2>
                      <p className="text-sm text-brown-600">Select or add a delivery address</p>
                    </div>
                  </div>
                  
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-2 px-4 py-2 text-terracotta-600 hover:bg-terracotta-50 rounded-lg border-2 border-terracotta-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add New</span>
                    </button>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm ? (
                  <form onSubmit={handleAddAddress} className="space-y-4 p-4 bg-cream-50 rounded-lg border border-brown-200">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={newAddress.firstName}
                        onChange={handleAddressChange}
                        required
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={newAddress.lastName}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                    <Input
                      label="Street Address"
                      name="street"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                      placeholder="House no., Building name, Street"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="PIN Code"
                        name="zipCode"
                        value={newAddress.zipCode}
                        onChange={handleAddressChange}
                        placeholder="e.g., 600001"
                        required
                      />
                      <Input
                        label="Phone"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleAddressChange}
                        className="w-4 h-4 text-terracotta-600 border-brown-300 rounded focus:ring-terracotta-500"
                      />
                      <span className="text-sm text-brown-700">Set as default address</span>
                    </label>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" variant="primary" className="flex-1">
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {addresses.length === 0 ? (
                      <div className="text-center py-8 text-brown-600">
                        <MapPin className="w-12 h-12 mx-auto mb-3 text-brown-400" />
                        <p>No saved addresses. Add a new address to continue.</p>
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedAddress?.id === address.id
                              ? 'border-terracotta-600 bg-terracotta-50'
                              : 'border-brown-200 hover:border-brown-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddress?.id === address.id}
                              onChange={() => setSelectedAddress(address)}
                              className="mt-1 w-4 h-4 text-terracotta-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-brown-900">
                                  {address.firstName} {address.lastName}
                                </p>
                                {address.isDefault && (
                                  <span className="text-xs bg-terracotta-100 text-terracotta-700 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-brown-700">{address.street}</p>
                              <p className="text-sm text-brown-700">
                                {address.city}, {address.state} - {address.zipCode}
                              </p>
                              <p className="text-sm text-brown-600 mt-1">
                                Phone: {address.phone}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method Info */}
              <div className="bg-white rounded-lg border-2 border-brown-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-terracotta-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brown-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-brown-600">Secure card payment via Stripe</p>
                  </div>
                </div>

                <div className="p-4 bg-cream-50 rounded-lg border border-brown-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-6 h-6 text-brown-700" />
                    <div>
                      <p className="font-semibold text-brown-900">Card Payment</p>
                      <p className="text-xs text-brown-600">Visa, Mastercard, RuPay, Debit/Credit Cards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Your card details are encrypted and processed securely by Stripe. 
                      We never store your card information on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-brown-200 p-6 lg:sticky lg:top-24 shadow-sm">
                <h2 className="text-xl font-display font-bold text-brown-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto scrollbar-thin">
                  {items.map((item) => (
                    <div key={`${item.product?._id || item.id}-${item.size || ''}`} className="flex gap-3">
                      <img
                        src={item.product?.images?.[0] || item.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.name || item.name || 'Product'}
                        className="w-16 h-16 rounded-lg object-cover bg-cream-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-brown-900 line-clamp-1">
                          {item.product?.name || item.name || 'Product'}
                        </p>
                        <p className="text-xs text-brown-600">
                          Qty: {item.quantity} {item.size && `• ${item.size}`}
                        </p>
                        <p className="text-sm font-semibold text-terracotta-600">
                          ₹{((item.product?.price || item.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-brown-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-brown-700">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                    )}
                  </div>

                  {shipping > 0 && subtotal < 1000 && (
                    <p className="text-xs text-brown-600 bg-green-50 p-2 rounded">
                      Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for free shipping! 🚚
                    </p>
                  )}

                  <div className="flex justify-between text-brown-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">
                      ₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="h-px bg-brown-200" />

                  <div className="flex justify-between text-brown-900">
                    <span className="text-lg font-display font-bold">Total</span>
                    <span className="text-2xl font-display font-bold text-terracotta-600">
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddress}
                  isLoading={placingOrder}
                  leftIcon={<Lock className="w-5 h-5" />}
                >
                  {placingOrder ? 'Processing...' : 'Proceed to Payment'}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brown-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure checkout • PCI DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default Checkout;