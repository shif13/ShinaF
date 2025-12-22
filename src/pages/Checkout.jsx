import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Smartphone, Building2, Wallet, 
  MapPin, Plus, Check, Lock, ArrowLeft, Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  
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
        
        // Auto-select default address or first address
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
        
        // Reset form
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

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setPlacingOrder(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod
      };

      const response = await client.post('/orders', orderData);

      if (response.data.success) {
        const order = response.data.data.order;
        
        // Clear cart
        clearCart();
        
        toast.success('Order placed successfully!');
        
        // Redirect to order detail page
        navigate(`/orders/${order.id}`, { 
          state: { orderSuccess: true } 
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    { id: 'CARD', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
    { id: 'UPI', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
    { id: 'NETBANKING', name: 'Net Banking', icon: Building2, description: 'All major banks' },
    { id: 'WALLET', name: 'Wallet', icon: Wallet, description: 'Paytm, Mobikwik, Amazon Pay' }
  ];

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
                  /* Address List */
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

              {/* Payment Method Section */}
              <div className="bg-white rounded-lg border-2 border-brown-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-terracotta-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brown-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-brown-600">Select your preferred payment method</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-terracotta-600 bg-terracotta-50'
                            : 'border-brown-200 hover:border-brown-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 w-4 h-4 text-terracotta-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-5 h-5 text-brown-700" />
                              <p className="font-semibold text-brown-900">{method.name}</p>
                            </div>
                            <p className="text-xs text-brown-600">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-brown-200 p-6 lg:sticky lg:top-24 shadow-sm">
                <h2 className="text-xl font-display font-bold text-brown-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto scrollbar-thin">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-cream-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-brown-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-brown-600">
                          Qty: {item.quantity} {item.size && `• ${item.size}`}
                        </p>
                        <p className="text-sm font-semibold text-terracotta-600">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                    )}
                  </div>

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
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brown-500">
                  <Lock className="w-3 h-3" />
                  <span>Secure checkout powered by Stripe</span>
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