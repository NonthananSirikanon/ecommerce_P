import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ConsoleGamesPage from './pages/ConsoleGamesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import AddressManagementPage from './pages/AddressManagementPage';
import PaymentManagementPage from './pages/PaymentManagementPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EnhancedAdminDashboard from './pages/admin/EnhancedAdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AdminLoginPage from './pages/admin/AdminLoginPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin Login Route (separate from protected routes) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<EnhancedAdminDashboard />} />
              <Route path="dashboard-old" element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route index element={<EnhancedAdminDashboard />} />
            </Route>
            
            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/consolegames" element={<ConsoleGamesPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    {/* <Route path="/order-history" element={<OrderHistoryPage />} /> */}
                    <Route path="/profile" element={<UserProfilePage />} />
                    {/* <Route path="/addresses" element={<AddressManagementPage />} /> */}
                    <Route path="/payments" element={<PaymentManagementPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
