// ============================================
// FILE: src/pages/admin/Orders.jsx
// ============================================
import { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Eye, Truck, CheckCircle, 
  Clock, XCircle, Download, ChevronDown, Calendar,
  TrendingUp, DollarSign, ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import Container from '../../components/ui/Container';
import Section from '../../components/ui/Section';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { InlineLoader } from '../../components/common/Spinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 20
  });

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [pagination.currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.limit);
      if (statusFilter) params.append('status', statusFilter);

      const response = await client.get(`/admin/orders?${params.toString()}`);
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await client.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      const response = await client.put(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
        trackingNumber
      });

      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(response.data.data.order);
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await client.get(`/orders/${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.data.order);
        setShowOrderModal(true);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { label: 'Pending', variant: 'warning', icon: Clock, color: 'text-amber-600' },
      PROCESSING: { label: 'Processing', variant: 'info', icon: Package, color: 'text-blue-600' },
      SHIPPED: { label: 'Shipped', variant: 'primary', icon: Truck, color: 'text-indigo-600' },
      DELIVERED: { label: 'Delivered', variant: 'success', icon: CheckCircle, color: 'text-green-600' },
      CANCELLED: { label: 'Cancelled', variant: 'danger', icon: XCircle, color: 'text-red-600' },
      REFUNDED: { label: 'Refunded', variant: 'danger', icon: XCircle, color: 'text-purple-600' }
    };
    return configs[status] || configs.PENDING;
  };

  return (
    <>
      {/* Stats Cards */}
      <Section size="sm" bg="cream">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingBag}
              color="purple"
            />
            <StatCard
              label="Pending"
              value={stats.pendingOrders}
              icon={Clock}
              color="amber"
            />
            <StatCard
              label="Processing"
              value={stats.processingOrders}
              icon={Package}
              color="blue"
            />
            <StatCard
              label="Shipped"
              value={stats.shippedOrders}
              icon={Truck}
              color="indigo"
            />
            <StatCard
              label="Revenue"
              value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`}
              icon={DollarSign}
              color="green"
            />
          </div>
        </Container>
      </Section>

      {/* Header & Filters */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">
                Order Management
              </h1>
              <p className="text-brown-600 mt-1">
                {pagination.totalOrders} total orders
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                className="px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <Button
                variant="outline"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => toast.info('Export feature coming soon')}
              >
                Export
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Orders Table */}
      <Section>
        <Container>
          {loading ? (
            <InlineLoader text="Loading orders..." />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-brown-400" />
              <h3 className="text-xl font-display font-bold text-brown-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-brown-600">
                {searchQuery ? 'Try adjusting your search' : 'No orders match the selected filters'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-brown-200 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-cream-50 border-b border-brown-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brown-100">
                    {filteredOrders.map((order) => (
                      <OrderTableRow
                        key={order.id}
                        order={order}
                        onView={handleViewOrder}
                        onUpdateStatus={handleUpdateStatus}
                        getStatusConfig={getStatusConfig}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-brown-100">
                {filteredOrders.map((order) => (
                  <OrderMobileCard
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                    onUpdateStatus={handleUpdateStatus}
                    getStatusConfig={getStatusConfig}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-brown-200 flex items-center justify-between">
                  <div className="text-sm text-brown-600">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalOrders)} of{' '}
                    {pagination.totalOrders} orders
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.currentPage === 1}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          getStatusConfig={getStatusConfig}
        />
      )}
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
    <div className="bg-white rounded-lg border border-brown-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-display font-bold text-brown-900">{value}</p>
      <p className="text-sm text-brown-600 mt-1">{label}</p>
    </div>
  );
};

// Order Table Row Component
const OrderTableRow = ({ order, onView, onUpdateStatus, getStatusConfig }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  return (
    <tr className="hover:bg-cream-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-mono font-semibold text-brown-900">
          #{order.orderNumber}
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-brown-900">
            {order.user.firstName} {order.user.lastName}
          </div>
          <div className="text-sm text-brown-600">{order.user.email}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-brown-700">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-6 py-4 text-sm text-brown-700">
        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-terracotta-600">
          ₹{order.total.toLocaleString('en-IN')}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2"
          >
            <Badge variant={statusConfig.variant}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
            <ChevronDown className="w-4 h-4 text-brown-400" />
          </button>

          {showStatusMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStatusMenu(false)}
              />
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-brown-200 py-1 z-20">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateStatus(order.id, status);
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-cream-50 transition-colors"
                  >
                    {getStatusConfig(status).label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={() => onView(order.id)}
        >
          View
        </Button>
      </td>
    </tr>
  );
};

// Order Mobile Card Component
const OrderMobileCard = ({ order, onView, onUpdateStatus, getStatusConfig }) => {
  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 hover:bg-cream-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono font-semibold text-brown-900 mb-1">
            #{order.orderNumber}
          </div>
          <div className="text-sm text-brown-700">
            {order.user.firstName} {order.user.lastName}
          </div>
          <div className="text-xs text-brown-600">{order.user.email}</div>
        </div>
        <Badge variant={statusConfig.variant}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="text-brown-600">
          <Calendar className="w-4 h-4 inline mr-1" />
          {formatDate(order.createdAt)}
        </div>
        <div className="font-semibold text-terracotta-600">
          ₹{order.total.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(order.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

// Order Detail Modal Component
const OrderDetailModal = ({ order, onClose, onUpdateStatus, getStatusConfig }) => {
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;

  const handleSave = () => {
    onUpdateStatus(order.id, selectedStatus, trackingNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-brown-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-display font-bold text-brown-900">
              Order #{order.orderNumber}
            </h2>
            <Badge variant={statusConfig.variant} className="mt-2">
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="text-brown-600 hover:text-brown-900 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Customer Information</h3>
            <div className="bg-cream-50 rounded-lg p-4 space-y-2">
              <div>
                <span className="text-sm text-brown-600">Name:</span>
                <span className="ml-2 font-medium text-brown-900">
                  {order.user.firstName} {order.user.lastName}
                </span>
              </div>
              <div>
                <span className="text-sm text-brown-600">Email:</span>
                <span className="ml-2 text-brown-900">{order.user.email}</span>
              </div>
              <div>
                <span className="text-sm text-brown-600">Phone:</span>
                <span className="ml-2 text-brown-900">{order.shippingAddress.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Shipping Address</h3>
            <div className="bg-cream-50 rounded-lg p-4">
              <p className="text-brown-900">{order.shippingAddress.street}</p>
              <p className="text-brown-900">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
              <p className="text-brown-900">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-cream-50 rounded-lg">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-brown-900">{item.name}</div>
                    <div className="text-sm text-brown-600">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' • '}
                      {item.color && `Color: ${item.color}`}
                    </div>
                    <div className="text-sm text-brown-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-brown-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Order Summary</h3>
            <div className="bg-cream-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-brown-700">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brown-700">
                <span>Shipping:</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-brown-700">
                <span>Tax:</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-brown-200 my-2" />
              <div className="flex justify-between font-bold text-brown-900">
                <span>Total:</span>
                <span className="text-terracotta-600">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Update Order Status</h3>
            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <input
                type="text"
                placeholder="Tracking Number (optional)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-brown-200 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            Update Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;