import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminProtection from './AdminProtection';

const AdminLayout = () => {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProtection>
  );
};

export default AdminLayout;