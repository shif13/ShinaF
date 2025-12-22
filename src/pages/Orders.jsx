import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Clock, Truck, CheckCircle, XCircle, RefreshCw,
  ChevronRight, Search, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { InlineLoader } from '../components/common/Spinner';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await client.get('/orders');
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await client.put(`/orders/${orderId}/cancel`);
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.orderStatus === filterStatus;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const orderStatuses = [
    { value: 'ALL', label: 'All Orders', count: orders.length },
    { value: 'PENDING', label: 'Pending', count: orders.filter(o => o.orderStatus === 'PENDING').length },
    { value: 'PROCESSING', label: 'Processing', count: orders.filter(o => o.orderStatus === 'PROCESSING').length },
    { value: 'SHIPPED', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'SHIPPED').length },
    { value: 'DELIVERED', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'DELIVERED').length },
    { value: 'CANCELLED', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'CANCELLED').length },
  ];

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">My Orders</h1>
              <p className="text-brown-600 mt-1">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Filters */}
      <Section size="sm" bg="cream">
        <Container>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {orderStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  filterStatus === status.value
                    ? 'bg-terracotta-600 text-white'
                    : 'bg-white border border-brown-200 text-brown-700 hover:border-brown-300'
                }`}
              >
                <span className="font-medium">{status.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  filterStatus === status.value
                    ? 'bg-white/20'
                    : 'bg-brown-100'
                }`}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Orders List */}
      <Section>
        <Container>
          {loading ? (
            <InlineLoader text="Loading your orders..." />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-brown-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                {searchQuery || filterStatus !== 'ALL' ? 'No orders found' : 'No orders yet'}
              </h2>
              <p className="text-brown-600 mb-8">
                {searchQuery || filterStatus !== 'ALL' 
                  ? 'Try adjusting your filters or search query'
                  : 'Start shopping to create your first order!'
                }
              </p>
              {!searchQuery && filterStatus === 'ALL' && (
                <Button variant="primary" onClick={() => navigate('/shop')}>
                  Start Shopping
                </Button>
              )}
              {(searchQuery || filterStatus !== 'ALL') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('ALL');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  onViewDetails={() => navigate(`/orders/${order.id}`)}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

// Order Card Component
const OrderCard = ({ order, onCancel, onViewDetails }) => {
  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: Clock,
        variant: 'warning',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        label: 'Pending'
      },
      PROCESSING: {
        icon: RefreshCw,
        variant: 'info',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        label: 'Processing'
      },
      SHIPPED: {
        icon: Truck,
        variant: 'primary',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        label: 'Shipped'
      },
      DELIVERED: {
        icon: CheckCircle,
        variant: 'success',
        color: 'text-green-600',
        bg: 'bg-green-50',
        label: 'Delivered'
      },
      CANCELLED: {
        icon: XCircle,
        variant: 'danger',
        color: 'text-red-600',
        bg: 'bg-red-50',
        label: 'Cancelled'
      },
      REFUNDED: {
        icon: RefreshCw,
        variant: 'danger',
        color: 'text-red-600',
        bg: 'bg-red-50',
        label: 'Refunded'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  
  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'PROCESSING';
  
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg border-2 border-brown-100 hover:border-brown-200 transition-all overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-brown-100 bg-cream-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-display font-bold text-lg text-brown-900">
                Order #{order.orderNumber}
              </h3>
              <Badge variant={statusConfig.variant} size="md">
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-brown-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Placed on {orderDate}
              </span>
              <span>•</span>
              <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
              <span>•</span>
              <span className="font-semibold text-terracotta-600">
                ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View Details
            </Button>
            {canCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel(order.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="p-4 md:p-6">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {order.items?.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-20 h-20 bg-cream-100 rounded-lg overflow-hidden"
            >
              <img
                src={item.image || item.product?.images?.[0] || '/placeholder.png'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {order.items?.length > 4 && (
            <div className="flex-shrink-0 w-20 h-20 bg-cream-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-brown-600">
                +{order.items.length - 4}
              </span>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <div className={`flex flex-col items-center gap-1 ${
              ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                ? 'text-terracotta-600'
                : 'text-brown-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-brown-200'
              }`}>
                <Package className="w-4 h-4" />
              </div>
              <span className="font-medium">Placed</span>
            </div>

            <div className="flex-1 h-0.5 bg-brown-200 mx-2">
              <div 
                className={`h-full transition-all duration-500 ${
                  ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                    ? 'bg-terracotta-600 w-full'
                    : 'w-0'
                }`}
              />
            </div>

            <div className={`flex flex-col items-center gap-1 ${
              ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                ? 'text-terracotta-600'
                : 'text-brown-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-brown-200'
              }`}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="font-medium">Processing</span>
            </div>

            <div className="flex-1 h-0.5 bg-brown-200 mx-2">
              <div 
                className={`h-full transition-all duration-500 ${
                  ['SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                    ? 'bg-terracotta-600 w-full'
                    : 'w-0'
                }`}
              />
            </div>

            <div className={`flex flex-col items-center gap-1 ${
              ['SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                ? 'text-terracotta-600'
                : 'text-brown-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['SHIPPED', 'DELIVERED'].includes(order.orderStatus)
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-brown-200'
              }`}>
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-medium">Shipped</span>
            </div>

            <div className="flex-1 h-0.5 bg-brown-200 mx-2">
              <div 
                className={`h-full transition-all duration-500 ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-terracotta-600 w-full'
                    : 'w-0'
                }`}
              />
            </div>

            <div className={`flex flex-col items-center gap-1 ${
              order.orderStatus === 'DELIVERED'
                ? 'text-terracotta-600'
                : 'text-brown-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.orderStatus === 'DELIVERED'
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-brown-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="font-medium">Delivered</span>
            </div>
          </div>
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;