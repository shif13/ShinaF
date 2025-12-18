import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  LogOut, Menu, X 
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];
  
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-display font-bold gradient-text">
          Admin Panel
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-brown-900 text-white z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold">
            <span className="text-terracotta-400">Shina</span>
            <span> Admin</span>
          </h1>
        </div>
        
        <nav className="px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive(item.path)
                    ? 'bg-terracotta-600 text-white'
                    : 'text-cream-200 hover:bg-brown-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brown-800">
          <div className="px-4 py-3 mb-2">
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-cream-300">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-brown-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;