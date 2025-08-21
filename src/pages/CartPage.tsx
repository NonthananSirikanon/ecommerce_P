import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const CartPage: React.FC = () => {
  const { items, summary, isLoading, error: cartError, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string>('');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      setLocalError('');
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตจำนวน');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setLocalError('');
      await removeItem(productId);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าหรือไม่?')) {
      try {
        setLocalError('');
        await clearCart();
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการล้างตะกร้า');
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าหลัก
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ตะกร้าสินค้าว่างเปล่า</h2>
            <p className="text-gray-600 mb-6">คุณยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งกันเลย!</p>
            <Link
              to="/"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              เริ่มช้อปปิ้ง
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าหลัก
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">ตะกร้าสินค้า</h1>
          <p className="text-gray-600 mt-2">
            คุณมีสินค้า {summary.totalItems} ชิ้น ใน {summary.itemCount} รายการ
          </p>
        </div>

        {(localError || cartError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {localError || cartError}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">กำลังโหลด...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">รายการสินค้า</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 transition-colors text-sm"
                  >
                    ลบทั้งหมด
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span class="text-gray-500 text-xs">${item.product.name.substring(0, 10)}</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">{item.product.name.substring(0, 10)}</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        {item.product.description && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {item.product.description}
                          </p>
                        )}
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-500">ราคาต่อชิ้น:</span>
                          <span className="text-lg font-bold text-blue-600 ml-2">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          สต็อกคงเหลือ: {item.product.quantity} ชิ้น
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isLoading}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-lg font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={isLoading}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Total Price & Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">สรุปคำสั่งซื้อ</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนสินค้า</span>
                  <span className="font-medium">{summary.totalItems} ชิ้น</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนรายการ</span>
                  <span className="font-medium">{summary.itemCount} รายการ</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">รวมทั้งหมด</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(summary.totalPrice)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  ดำเนินการชำระเงิน
                </button>

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    ช้อปปิ้งต่อ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;