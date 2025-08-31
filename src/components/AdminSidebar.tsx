import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'แดชบอร์ด',
      path: '/admin/dashboard'
    },
    {
      icon: Package,
      label: 'จัดการสินค้า',
      path: '/admin/products'
    },
    {
      icon: Users,
      label: 'จัดการลูกค้า',
      path: '/admin/customers'
    },
    {
      icon: ShoppingCart,
      label: 'คำสั่งซื้อ',
      path: '/admin/orders'
    },
    {
      icon: BarChart3,
      label: 'รายงาน',
      path: '/admin/reports'
    },
    {
      icon: Settings,
      label: 'ตั้งค่า',
      path: '/admin/settings'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        flex flex-col h-full
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-gray-800">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
              text-red-600 hover:bg-red-50 w-full transition-colors duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;