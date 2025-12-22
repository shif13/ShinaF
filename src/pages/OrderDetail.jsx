import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock,
  MapPin, CreditCard, Phone, Mail, Download, RefreshCw,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { PageLoader } from '../components/common/Spinner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view order details');
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancelling(true);
    try {
      const response = await client.put(`/orders/${id}/cancel`);
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrderDetails();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice download will be available soon!');
    // TODO: Implement invoice generation
  };

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
              Order Not Found
            </h2>
            <Button variant="primary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: Clock,
        variant: 'warning',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        label: 'Order Pending',
        description: 'Your order is awaiting confirmation'
      },
      PROCESSING: {
        icon: RefreshCw,
        variant: 'info',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        label: 'Processing Order',
        description: 'We are preparing your order'
      },
      SHIPPED: {
        icon: Truck,
        variant: 'primary',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        label: 'Order Shipped',
        description: 'Your order is on the way'
      },
      DELIVERED: {
        icon: CheckCircle,
        variant: 'success',
        color: 'text-green-600',
        bg: 'bg-green-50',
        label: 'Order Delivered',
        description: 'Your order has been delivered'
      },
      CANCELLED: {
        icon: XCircle,
        variant: 'danger',
        color: 'text-red-600',
        bg: 'bg-red-50',
        label: 'Order Cancelled',
        description: 'This order has been cancelled'
      },
      REFUNDED: {
        icon: RefreshCw,
        variant: 'danger',
        color: 'text-red-600',
        bg: 'bg-red-50',
        label: 'Order Refunded',
        description: 'Refund has been processed'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'PROCESSING';
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      CARD: '💳',
      UPI: '📱',
      NETBANKING: '🏦',
      WALLET: '👛'
    };
    return icons[method] || '💳';
  };

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 hover:bg-brown-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-brown-900">
                Order Details
              </h1>
              <p className="text-brown-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadInvoice}
              className="hidden sm:flex"
            >
              Invoice
            </Button>
          </div>

          {/* Status Banner */}
          <div className={`p-4 rounded-lg ${statusConfig.bg} border-2 ${statusConfig.color.replace('text-', 'border-')}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${statusConfig.color.replace('text-', 'bg-').replace('600', '100')} flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${statusConfig.color}`}>
                  {statusConfig.label}
                </h3>
                <p className={statusConfig.color.replace('600', '700')}>
                  {statusConfig.description}
                </p>
              </div>
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelOrder}
                  isLoading={cancelling}
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Order Timeline */}
      <Section size="sm" bg="cream">
        <Container>
          <h2 className="text-xl font-display font-bold text-brown-900 mb-6">Order Timeline</h2>
          <div className="bg-white rounded-lg border-2 border-brown-100 p-6">
            <div className="space-y-6">
              {/* Order Placed */}
              <TimelineItem
                icon={Package}
                title="Order Placed"
                date={formatDate(order.createdAt)}
                completed={true}
              />

              {/* Payment Confirmed */}
              {order.paidAt && (
                <TimelineItem
                  icon={CreditCard}
                  title="Payment Confirmed"
                  date={formatDate(order.paidAt)}
                  completed={true}
                />
              )}

              {/* Processing */}
              <TimelineItem
                icon={RefreshCw}
                title="Order Processing"
                date={order.orderStatus !== 'PENDING' ? 'In Progress' : 'Pending'}
                completed={['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)}
              />

              {/* Shipped */}
              <TimelineItem
                icon={Truck}
                title="Order Shipped"
                date={order.shippedAt ? formatDate(order.shippedAt) : 'Pending'}
                completed={['SHIPPED', 'DELIVERED'].includes(order.orderStatus)}
                tracking={order.trackingNumber}
              />

              {/* Delivered */}
              <TimelineItem
                icon={CheckCircle}
                title="Order Delivered"
                date={order.deliveredAt ? formatDate(order.deliveredAt) : 'Pending'}
                completed={order.orderStatus === 'DELIVERED'}
                isLast={true}
              />

              {/* Cancelled */}
              {order.orderStatus === 'CANCELLED' && (
                <TimelineItem
                  icon={XCircle}
                  title="Order Cancelled"
                  date={formatDate(order.cancelledAt)}
                  completed={true}
                  isLast={true}
                  color="red"
                />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border-2 border-brown-100 overflow-hidden">
                <div className="p-6 border-b border-brown-100 bg-cream-50">
                  <h2 className="text-xl font-display font-bold text-brown-900">
                    Order Items ({order.items?.length || 0})
                  </h2>
                </div>
                
                <div className="divide-y divide-brown-100">
                  {order.items?.map((item, index) => (
                    <div key={index} className="p-6 hover:bg-cream-50 transition-colors">
                      <div className="flex gap-4">
                        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                          <img
                            src={item.image || '/placeholder.png'}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover bg-cream-100 hover:scale-105 transition-transform"
                          />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.productId}`}
                            className="font-semibold text-brown-900 hover:text-terracotta-600 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-brown-600">
                            {item.size && (
                              <span className="px-2 py-1 bg-cream-100 rounded">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-2 py-1 bg-cream-100 rounded">
                                Color: {item.color}
                              </span>
                            )}
                            <span>Qty: {item.quantity}</span>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-lg font-bold text-terracotta-600">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-sm text-brown-600">× {item.quantity}</span>
                            <span className="text-sm text-brown-600">=</span>
                            <span className="text-lg font-bold text-brown-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border-2 border-brown-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-terracotta-600" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-brown-900">
                    Shipping Address
                  </h2>
                </div>
                
                <div className="bg-cream-50 rounded-lg p-4 border border-brown-100">
                  <p className="font-semibold text-brown-900 mb-2">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-brown-700">{order.shippingAddress.street}</p>
                  <p className="text-brown-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-brown-700">{order.shippingAddress.country}</p>
                  <div className="flex items-center gap-2 mt-3 text-brown-700">
                    <Phone className="w-4 h-4" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border-2 border-brown-100 p-6 sticky top-24">
                <h2 className="text-xl font-display font-bold text-brown-900 mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-brown-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{order.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-brown-700">
                    <span>Shipping</span>
                    {order.shippingCost === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">
                        ₹{order.shippingCost.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-brown-700">
                    <span>Tax (GST)</span>
                    <span className="font-semibold">
                      ₹{order.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -₹{order.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  
                  <div className="h-px bg-brown-200" />
                  
                  <div className="flex justify-between text-brown-900">
                    <span className="text-lg font-display font-bold">Total</span>
                    <span className="text-2xl font-display font-bold text-terracotta-600">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="pt-6 border-t border-brown-100">
                  <h3 className="font-semibold text-brown-900 mb-3">Payment Information</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-brown-600">Method</span>
                      <span className="font-medium text-brown-900">
                        {getPaymentMethodIcon(order.paymentMethod)} {order.paymentMethod}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-brown-600">Status</span>
                      <Badge variant={
                        order.paymentStatus === 'PAID' ? 'success' :
                        order.paymentStatus === 'PENDING' ? 'warning' :
                        'danger'
                      }>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    
                    {order.paidAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-brown-600">Paid On</span>
                        <span className="text-brown-900">
                          {new Date(order.paidAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-brown-100 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice
                  </Button>
                  
                  <Link to="/shop">
                    <Button variant="primary" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-cream-50 rounded-lg border-2 border-brown-200 p-6">
                <h3 className="font-display font-bold text-brown-900 mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3 text-sm">
                  <Link 
                    to="/contact"
                    className="flex items-center gap-2 text-brown-700 hover:text-terracotta-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Link>
                  <Link 
                    to="/orders"
                    className="flex items-center gap-2 text-brown-700 hover:text-terracotta-600 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>View All Orders</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

// Timeline Item Component
const TimelineItem = ({ icon: Icon, title, date, completed, tracking, isLast, color = 'terracotta' }) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          completed 
            ? `bg-${color}-600 text-white` 
            : 'bg-brown-200 text-brown-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        {!isLast && (
          <div className={`w-0.5 h-full mt-2 ${
            completed ? `bg-${color}-600` : 'bg-brown-200'
          }`} style={{ minHeight: '40px' }} />
        )}
      </div>
      
      <div className="flex-1 pb-6">
        <h4 className={`font-semibold ${
          completed ? 'text-brown-900' : 'text-brown-500'
        }`}>
          {title}
        </h4>
        <p className="text-sm text-brown-600 mt-1">{date}</p>
        {tracking && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <span className="text-blue-900">
              <strong>Tracking:</strong> {tracking}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;