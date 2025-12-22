import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, MapPin, Plus, Edit, Trash2, 
  Check, X, Camera, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { InlineLoader } from '../components/common/Spinner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await client.get('/users/profile');
      if (response.data.success) {
        const userData = response.data.data.user;
        setPersonalInfo({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await client.get('/users/addresses');
      if (response.data.success) {
        setAddresses(response.data.data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await client.put('/users/profile', personalInfo);
      if (response.data.success) {
        updateUser(response.data.data.user);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await client.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAddress) {
        await client.put(`/users/addresses/${editingAddress.id}`, addressForm);
        toast.success('Address updated successfully');
      } else {
        await client.post('/users/addresses', addressForm);
        toast.success('Address added successfully');
      }
      fetchAddresses();
      resetAddressForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await client.delete(`/users/addresses/${id}`);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
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
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'addresses', label: 'Addresses', icon: MapPin }
  ];

  return (
    <>
      {/* Header */}
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terracotta-400 to-amber-500 flex items-center justify-center text-white text-3xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-brown-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-brown-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              {user?.emailVerified && (
                <Badge variant="success" size="sm" className="mt-1">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Tabs */}
      <Section size="sm" bg="cream">
        <Container>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-terracotta-600 shadow-sm'
                      : 'text-brown-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Content */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-lg border border-brown-200 p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-brown-900 mb-6">
                  Personal Information
                </h2>
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      leftIcon={<User className="w-5 h-5" />}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    value={user?.email}
                    leftIcon={<Mail className="w-5 h-5" />}
                    disabled
                    helperText="Email cannot be changed"
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    leftIcon={<Phone className="w-5 h-5" />}
                    placeholder="+91 98765 43210"
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={loading}
                      leftIcon={<Save className="w-5 h-5" />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-lg border border-brown-200 p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-brown-900 mb-6">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <Input
                    type="password"
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                  />

                  <Input
                    type="password"
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    leftIcon={<Lock className="w-5 h-5" />}
                    helperText="Must be at least 6 characters with uppercase, lowercase, and number"
                    required
                  />

                  <Input
                    type="password"
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={loading}
                      leftIcon={<Lock className="w-5 h-5" />}
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-brown-900">
                    Saved Addresses
                  </h2>
                  {!showAddressForm && (
                    <Button
                      variant="primary"
                      leftIcon={<Plus className="w-5 h-5" />}
                      onClick={() => setShowAddressForm(true)}
                    >
                      Add New Address
                    </Button>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-white rounded-lg border-2 border-terracotta-200 p-6 md:p-8">
                    <h3 className="text-xl font-display font-bold text-brown-900 mb-6">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="First Name"
                          value={addressForm.firstName}
                          onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                          required
                        />
                        <Input
                          label="Last Name"
                          value={addressForm.lastName}
                          onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                          required
                        />
                      </div>

                      <Input
                        label="Street Address"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="House no., Building name, Street"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="City"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                        <Input
                          label="State"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="PIN Code"
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                          placeholder="e.g., 600001"
                          required
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="w-4 h-4 text-terracotta-600 border-brown-300 rounded focus:ring-terracotta-500"
                        />
                        <span className="text-sm text-brown-700">Set as default address</span>
                      </label>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={loading}
                          className="flex-1"
                        >
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetAddressForm}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                {addresses.length === 0 ? (
                  <div className="bg-white rounded-lg border border-brown-200 p-12 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-brown-400" />
                    <h3 className="text-xl font-display font-semibold text-brown-900 mb-2">
                      No Addresses Saved
                    </h3>
                    <p className="text-brown-600 mb-6">
                      Add your first address to make checkout faster
                    </p>
                    {!showAddressForm && (
                      <Button
                        variant="primary"
                        leftIcon={<Plus className="w-5 h-5" />}
                        onClick={() => setShowAddressForm(true)}
                      >
                        Add Address
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-white rounded-lg border-2 border-brown-200 p-6 hover:border-terracotta-300 transition-colors relative"
                      >
                        {address.isDefault && (
                          <Badge variant="success" size="sm" className="absolute top-4 right-4">
                            Default
                          </Badge>
                        )}
                        <div className="space-y-2 mb-4">
                          <p className="font-semibold text-brown-900 text-lg">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-brown-700">{address.street}</p>
                          <p className="text-brown-700">
                            {address.city}, {address.state} - {address.zipCode}
                          </p>
                          <p className="text-brown-600 text-sm flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {address.phone}
                          </p>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-brown-200">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default Profile;