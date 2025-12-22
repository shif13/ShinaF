// ============================================
// FILE: src/pages/admin/Users.jsx
// ============================================
import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, Search, UserCheck, UserX, Shield, 
  Mail, Phone, Calendar, Edit, Trash2, Eye, MoreVertical,
  Crown, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../../api/client';
import Container from '../../components/ui/Container';
import Section from '../../components/ui/Section';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { InlineLoader } from '../../components/common/Spinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20
  });

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [pagination.currentPage, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.limit);
      if (roleFilter) params.append('role', roleFilter);

      const response = await client.get(`/admin/users?${params.toString()}`);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
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

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await client.put(`/admin/users/${userId}/role`, {
        role: newRole
      });

      if (response.data.success) {
        toast.success('User role updated successfully');
        fetchUsers();
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(response.data.data.user);
        }
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await client.delete(`/admin/users/${userId}`);

      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        setShowUserModal(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await client.get(`/admin/users/${userId}`);
      if (response.data.success) {
        setSelectedUser(response.data.data.user);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user details');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Stats Cards */}
      <Section size="sm" bg="cream">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={UsersIcon}
              color="blue"
            />
            <StatCard
              label="Admin Users"
              value={stats.adminUsers}
              icon={Shield}
              color="purple"
            />
            <StatCard
              label="Active Users"
              value={stats.activeUsers}
              icon={UserCheck}
              color="green"
            />
            <StatCard
              label="New This Month"
              value={stats.newUsersThisMonth}
              icon={Calendar}
              color="amber"
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
                User Management
              </h1>
              <p className="text-brown-600 mt-1">
                {pagination.totalUsers} total users
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                className="px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="">All Roles</option>
                <option value="USER">Users</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
        </Container>
      </Section>

      {/* Users Table */}
      <Section>
        <Container>
          {loading ? (
            <InlineLoader text="Loading users..." />
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 text-brown-400" />
              <h3 className="text-xl font-display font-bold text-brown-900 mb-2">
                No Users Found
              </h3>
              <p className="text-brown-600">
                {searchQuery ? 'Try adjusting your search' : 'No users match the selected filters'}
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
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-brown-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brown-100">
                    {filteredUsers.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        onView={handleViewUser}
                        onUpdateRole={handleUpdateRole}
                        onDelete={handleDeleteUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-brown-100">
                {filteredUsers.map((user) => (
                  <UserMobileCard
                    key={user.id}
                    user={user}
                    onView={handleViewUser}
                    onUpdateRole={handleUpdateRole}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-brown-200 flex items-center justify-between">
                  <div className="text-sm text-brown-600">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of{' '}
                    {pagination.totalUsers} users
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onUpdateRole={handleUpdateRole}
          onDelete={handleDeleteUser}
        />
      )}
    </>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600'
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

// User Table Row Component
const UserTableRow = ({ user, onView, onUpdateRole, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <tr className="hover:bg-cream-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center font-semibold text-terracotta-700">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <div className="font-medium text-brown-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-brown-600">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="text-sm text-brown-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-brown-400" />
            {user.email}
          </div>
          {user.phone && (
            <div className="text-sm text-brown-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-brown-400" />
              {user.phone}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
          {user.role === 'ADMIN' ? (
            <><Crown className="w-3 h-3 mr-1" /> Admin</>
          ) : (
            <><User className="w-3 h-3 mr-1" /> User</>
          )}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-brown-700">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 text-sm text-brown-700">
        {user._count?.orders || 0} orders
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => onView(user.id)}
          >
            View
          </Button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-brown-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-brown-600" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-brown-200 py-1 z-20">
                  <button
                    onClick={() => {
                      onUpdateRole(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-cream-50 transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => {
                      onDelete(user.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

// User Mobile Card Component
const UserMobileCard = ({ user, onView, onUpdateRole, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center font-semibold text-terracotta-700">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <div className="font-medium text-brown-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-brown-600">{user.email}</div>
          </div>
        </div>
        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
          {user.role === 'ADMIN' ? (
            <><Crown className="w-3 h-3 mr-1" /> Admin</>
          ) : (
            <><User className="w-3 h-3 mr-1" /> User</>
          )}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="text-brown-600">
          <Calendar className="w-4 h-4 inline mr-1" />
          Joined {formatDate(user.createdAt)}
        </div>
        <div className="text-brown-700">
          {user._count?.orders || 0} orders
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(user.id)}
        >
          View Details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateRole(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
        >
          <Shield className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose, onUpdateRole, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-brown-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-terracotta-100 flex items-center justify-center font-bold text-2xl text-terracotta-700">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900">
                {user.firstName} {user.lastName}
              </h2>
              <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'} className="mt-1">
                {user.role === 'ADMIN' ? (
                  <><Crown className="w-3 h-3 mr-1" /> Admin</>
                ) : (
                  <><User className="w-3 h-3 mr-1" /> User</>
                )}
              </Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brown-600 hover:text-brown-900 transition-colors"
          >
            <UserX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Contact Information</h3>
            <div className="bg-cream-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brown-600" />
                <div>
                  <div className="text-xs text-brown-600">Email</div>
                  <div className="text-brown-900">{user.email}</div>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brown-600" />
                  <div>
                    <div className="text-xs text-brown-600">Phone</div>
                    <div className="text-brown-900">{user.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Account Details</h3>
            <div className="bg-cream-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-brown-600">User ID:</span>
                <span className="text-sm font-mono text-brown-900">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brown-600">Joined:</span>
                <span className="text-sm text-brown-900">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brown-600">Last Updated:</span>
                <span className="text-sm text-brown-900">{formatDate(user.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brown-600">Total Orders:</span>
                <span className="text-sm font-semibold text-brown-900">{user._count?.orders || 0}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {user.addresses && user.addresses.length > 0 && (
            <div>
              <h3 className="font-semibold text-brown-900 mb-3">Saved Addresses</h3>
              <div className="space-y-2">
                {user.addresses.map((address, index) => (
                  <div key={address.id} className="bg-cream-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-brown-900">{address.name}</div>
                      {address.isDefault && (
                        <Badge variant="success" size="sm">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-brown-700">{address.street}</p>
                    <p className="text-sm text-brown-700">
                      {address.city}, {address.state} - {address.zipCode}
                    </p>
                    <p className="text-sm text-brown-700">{address.country}</p>
                    <p className="text-sm text-brown-600 mt-1">{address.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <h3 className="font-semibold text-brown-900 mb-3">Admin Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<Shield className="w-4 h-4" />}
                onClick={() => {
                  onUpdateRole(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN');
                  onClose();
                }}
              >
                {user.role === 'ADMIN' ? 'Remove Admin Privileges' : 'Grant Admin Privileges'}
              </Button>
              <Button
                variant="danger"
                className="w-full justify-start"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  onDelete(user.id);
                }}
              >
                Delete User Account
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-brown-200">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;