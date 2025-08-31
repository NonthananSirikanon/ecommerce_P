import { useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { adminLogin, isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Get the intended destination or default to admin dashboard
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // Clear error when inputs change
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [email, password, error]);

  // Redirect if already logged in as admin
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to={from} replace />;
  }

  // Redirect non-admin users to regular login
  if (isAuthenticated && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await adminLogin({ email, password });
      // The redirect will happen automatically via the useEffect above
    } catch (err) {
      if (err instanceof Error) {
        // Check if the error is related to insufficient privileges
        if (err.message.includes('admin') || err.message.includes('สิทธิ์')) {
          setError('คุณไม่มีสิทธิ์เข้าใช้งานระบบผู้ดูแล กรุณาติดต่อผู้ดูแลระบบ');
        } else {
          setError(err.message);
        }
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ระบบผู้ดูแล
          </h2>
          <p className="text-gray-600">
            เข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                อีเมลผู้ดูแล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="รหัสผ่านผู้ดูแล"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  'เข้าสู่ระบบผู้ดูแล'
                )}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <Link 
                to="/login" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                เข้าสู่ระบบผู้ใช้ทั่วไป
              </Link>
              <div className="text-xs text-gray-500">
                หากคุณไม่ใช่ผู้ดูแลระบบ กรุณาใช้หน้าเข้าสู่ระบบปกติ
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                ข้อมูลสำคัญด้านความปลอดภัย
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                หน้านี้สำหรับผู้ดูแลระบบเท่านั้น การเข้าใช้งานจะถูกบันทึกและตรวจสอบ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;