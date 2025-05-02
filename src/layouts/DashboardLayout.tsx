import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { School, User, LogOut, CreditCard, ClipboardList, QrCode, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: <ClipboardList size={20} /> },
      { path: '/dashboard/profile', label: 'Profile', icon: <User size={20} /> },
    ];

    switch (user.role) {
      case 'parent':
        return [
          ...baseItems,
          { path: '/dashboard/payment', label: 'Payment', icon: <CreditCard size={20} /> },
          { path: '/dashboard/transactions', label: 'Transactions', icon: <ClipboardList size={20} /> },
        ];
      case 'educator':
      case 'driver':
      case 'cook':
        return [
          ...baseItems,
          { path: '/dashboard/scanner', label: 'Scanner', icon: <QrCode size={20} /> },
        ];
      default:
        return baseItems;
    }
  };

  const navigation = getNavigationItems();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications(0);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-500 text-white">
      {/* Mobile Header */}
      <header className="bg-background-600 py-4 px-4 lg:hidden flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <School className="text-primary-500 mr-2" size={24} />
          <span className="font-semibold text-xl">Gogo-Soft 2025</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearNotifications}
            className="relative"
          >
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background-500 border-b border-gray-700 animate-slideUp">
          <div className="flex flex-col">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm ${isActive ? 'bg-primary-500 text-white' : 'text-gray-300 hover:bg-background-400'}`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-background-400"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-background-600 border-r border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-700 px-4">
          <School className="text-primary-500 mr-2" size={28} />
          <span className="font-semibold text-xl">Gogo-Soft 2025</span>
        </div>
        <div className="flex flex-col overflow-y-auto flex-1">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm rounded-lg ${isActive ? 'bg-primary-500 text-white' : 'text-gray-300 hover:bg-background-400'}`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-2 py-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-background-400 rounded-lg"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-500">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-gray-700">
          <h1 className="text-xl font-semibold">
            {location.pathname === '/dashboard' ? 'Dashboard' :
              navigation.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={clearNotifications}
                className="relative p-1 rounded-full hover:bg-background-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full border border-gray-700"
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                  alt={user.name}
                />
                <span className="ml-2 text-sm font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
