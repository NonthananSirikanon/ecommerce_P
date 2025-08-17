
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
              PP
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              หน้าหลัก
            </Link>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              ซื้อเครื่องเกม
            </a>
          </nav>

          {/* Search, Cart, and Auth */}
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            
            {isAuthenticated && (
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
            )}

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.email}
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      โปรไฟล์
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      คำสั่งซื้อ
                    </a>
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
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                หน้าหลัก
              </Link>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                ซื้อเครื่องเกม
              </a>
              
              {/* Mobile Auth Links */}
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
                  <div className="text-sm text-gray-500 border-t pt-4">
                    {user?.name} ({user?.email})
                  </div>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    โปรไฟล์
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    คำสั่งซื้อ
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-600 hover:text-gray-900"
                  >
                    ออกจากระบบ
                  </button>
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
