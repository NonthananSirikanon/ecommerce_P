import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, Home, Gamepad2, MapPin, Package, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import SweetAlertUtils from '../utils/sweetAlert';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { summary } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleLogout = async () => {
    const result = await SweetAlertUtils.auth.logoutConfirm();
    
    if (result.isConfirmed) {
      try {
        await logout();
        setIsUserMenuOpen(false);
        SweetAlertUtils.auth.logoutSuccess();
      } catch (error) {
        console.error('Logout error:', error);
        SweetAlertUtils.error('ไม่สามารถออกจากระบบได้', 'กรุณาลองใหม่อีกครั้ง');
        setIsUserMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
                isActiveLink('/') 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>หน้าหลัก</span>
            </Link>
            <Link
              to="/consolegames"
              className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
                isActiveLink('/consolegames') 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
              }`}
            >
              <Gamepad2 className="h-4 w-4" />
              <span>ซื้อเครื่องเกม</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            
            {isAuthenticated && (
              <Link to="/cart" className="relative group">
                <ShoppingCart className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                {summary.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    {summary.totalItems}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user?.firstName} {user?.lastName}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.email}
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      โปรไฟล์
                    </Link>
                    {/* <Link
                      to="/addresses"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      จัดการที่อยู่
                    </Link> */}
                    <Link
                      to="/payments"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      ประวัติการชำระเงิน
                    </Link>
                    {/* <Link
                      to="/order-history"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      ประวัติการสั่งซื้อ
                    </Link> */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 ${
                  isActiveLink('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>หน้าหลัก</span>
              </Link>
              <Link 
                to="/games" 
                className={`flex items-center space-x-2 ${
                  isActiveLink('/games') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                <span>ซื้อเครื่องเกม</span>
              </Link>
              
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    เข้าสู่ระบบ
                  </Link>
                  <Link to="/register" className="text-blue-600 hover:text-blue-700">
                    สมัครสมาชิก
                  </Link>
                </>
              )}
              
              {isAuthenticated && (
                <>
                  <div className="z-1 border-t pt-4 mt-4">
                    <div className="text-sm text-gray-500 mb-3">
                      <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs">{user?.email}</div>
                    </div>
                    <div className="space-y-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                      >
                        <User className="h-4 w-4" />
                        <span>โปรไฟล์</span>
                      </Link>
                      <Link 
                        to="/order-history" 
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>ประวัติการสั่งซื้อ</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;