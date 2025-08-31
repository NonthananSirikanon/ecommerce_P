import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Shield } from 'lucide-react';

interface AdminProtectionProps {
  children: React.ReactNode;
}

const AdminProtection = ({ children }: AdminProtectionProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.role !== 'admin') {
      setShowUnauthorized(true);
      const timer = setTimeout(() => {
        setShowUnauthorized(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, user]);

  // Still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าใช้...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login with current location
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated but not admin role
  if (user && user.role !== 'admin') {
    if (showUnauthorized) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่มีสิทธิ์เข้าใช้งาน
            </h2>
            <p className="text-gray-600 mb-6">
              คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การใช้งาน
            </p>
            <div className="space-y-3">
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p><span className="font-medium">ชื่อผู้ใช้:</span> {user.firstName} {user.lastName}</p>
                <p><span className="font-medium">อีเมล:</span> {user.email}</p>
                <p><span className="font-medium">บทบาท:</span> {user.role}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  // User is admin - show admin content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Badge */}
      <div className="bg-blue-600 text-white text-center py-1 text-sm">
        <Shield className="inline-block w-4 h-4 mr-1" />
        โหมดผู้ดูแลระบบ - {user.firstName} {user.lastName}
      </div>
      {children}
    </div>
  );
};

export default AdminProtection;