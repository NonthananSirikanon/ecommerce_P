import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
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
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/addresses" element={<AddressManagementPage />} />
                <Route path="/payments" element={<PaymentManagementPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
