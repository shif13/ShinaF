import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Clock, Truck, CheckCircle, XCircle, Search, 
  Filter, Download, Eye, RotateCcw, Calendar, DollarSign
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

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
    if (!confirm('Are you sure you want to cancel this order?')) return;

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

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { 
        label: 'Pending', 
        variant: 'warning', 
        icon: Clock,
        description: 'Order is being processed'
      },
      PROCESSING: { 
        label: 'Processing', 
        variant: 'info', 
        icon: Package,
        description: 'Order is being prepared'
      },
      SHIPPED: { 
        label: 'Shipped', 
        variant: 'primary', 
        icon: Truck,
        description: 'Order is on the way'
      },
      DELIVERED: { 
        label: 'Delivered', 
        variant: 'success', 
        icon: CheckCircle,
        description: 'Order has been delivered'
      },
      CANCELLED: { 
        label: 'Cancelled', 
        variant: 'danger', 
        icon: XCircle,
        description: 'Order was cancelled'
      },
      REFUNDED: { 
        label: 'Refunded', 
        variant: 'info', 
        icon: RotateCcw,
        description: 'Order has been refunded'
      }
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        switch(dateFilter) {
          case 'WEEK': return daysDiff <= 7;
          case 'MONTH': return daysDiff <= 30;
          case '3MONTHS': return daysDiff <= 90;
          case 'YEAR': return daysDiff <= 365;
          default: return true;
        }
      });
    }

    return filtered;
  };

  const filteredOrders = filterOrders();

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'PENDING').length,
    processing: orders.filter(o => o.orderStatus === 'PROCESSING').length,
    shipped: orders.filter(o => o.orderStatus === 'SHIPPED').length,
    delivered: orders.filter(o => o.orderStatus === 'DELIVERED').length
  };

  if (loading) {
    return (
      <Section className="min-h-screen">
        <Container>
          <InlineLoader text="Loading your orders..." />
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div>
            <h1 className="text-3xl font-display font-bold text-brown-900">My Orders</h1>
            <p className="text-brown-600 mt-1">
              Track and manage your orders
            </p>
          </div>
        </Container>
      </Section>

      {/* Stats Cards */}
      <Section size="sm" bg="cream">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Total Orders" value={stats.total} icon={Package} color="purple" />
            <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
            <StatCard label="Processing" value={stats.processing} icon={Package} color="blue" />
            <StatCard label="Shipped" value={stats.shipped} icon={Truck} color="indigo" />
            <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} color="green" />
          </div>
        </Container>
      </Section>

      {/* Filters */}
      <Section>
        <Container>
          <div className="bg-white rounded-lg border border-brown-200 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="text"
                  placeholder="Search by order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="ALL">All Time</option>
                <option value="WEEK">Last 7 Days</option>
                <option value="MONTH">Last 30 Days</option>
                <option value="3MONTHS">Last 3 Months</option>
                <option value="YEAR">Last Year</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-brown-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-2">
                {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
              </h2>
              <p className="text-brown-600 mb-6">
                {orders.length === 0 
                  ? "You haven't placed any orders yet. Start shopping!" 
                  : 'Try adjusting your filters to see more orders'}
              </p>
              {orders.length === 0 && (
                <Button variant="primary" onClick={() => navigate('/shop')}>
                  Start Shopping
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

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <div className="bg-white rounded-lg border border-brown-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-brown-900">{value}</p>
      <p className="text-sm text-brown-600">{label}</p>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onCancel, onViewDetails }) => {
  const statusInfo = getStatusInfo(order.orderStatus);
  const StatusIcon = statusInfo.icon;
  const canCancel = ['PENDING', 'PROCESSING'].includes(order.orderStatus);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { label: 'Pending', variant: 'warning', icon: Clock },
      PROCESSING: { label: 'Processing', variant: 'info', icon: Package },
      SHIPPED: { label: 'Shipped', variant: 'primary', icon: Truck },
      DELIVERED: { label: 'Delivered', variant: 'success', icon: CheckCircle },
      CANCELLED: { label: 'Cancelled', variant: 'danger', icon: XCircle },
      REFUNDED: { label: 'Refunded', variant: 'info', icon: RotateCcw }
    };
    return statusMap[status] || statusMap.PENDING;
  };

  return (
    <div className="bg-white rounded-lg border-2 border-brown-200 overflow-hidden hover:border-terracotta-300 transition-colors">
      {/* Header */}
      <div className="bg-cream-50 px-4 md:px-6 py-4 border-b border-brown-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-brown-900">
                Order #{order.orderNumber}
              </h3>
              <Badge variant={statusInfo.variant} size="sm">
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-brown-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}
              onClick={onViewDetails}
            >
              View Details
            </Button>
            {canCancel && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => onCancel(order.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Items Preview */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-brown-700 mb-3">
              Items ({order.items.length})
            </p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {order.items.slice(0, 4).map((item, index) => (
                <div key={index} className="flex-shrink-0 w-20 h-20 bg-cream-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="flex-shrink-0 w-20 h-20 bg-brown-100 rounded-lg flex items-center justify-center">
                  <span className="text-brown-700 font-semibold">
                    +{order.items.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <p className="text-sm font-medium text-brown-700 mb-3">Order Total</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm text-brown-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-brown-600">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-brown-600">
                <span>Tax</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-brown-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brown-900">Total</span>
                  <span className="text-xl font-bold text-terracotta-600">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-cream-50 rounded-lg p-4 border border-brown-200">
          <p className="text-sm font-medium text-brown-700 mb-2">Shipping Address</p>
          <div className="text-sm text-brown-600">
            <p className="font-medium text-brown-900">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="text-brown-600">Tracking Number:</span>
            <span className="font-mono font-semibold text-blue-600">
              {order.trackingNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;