import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import SweetAlertUtils from '../utils/sweetAlert';

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
      SweetAlertUtils.cart.updateSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตจำนวน';
      setLocalError(errorMessage);
      SweetAlertUtils.cart.updateError(errorMessage);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const item = items.find(item => item.productId === productId);
    if (!item) return;

    const result = await SweetAlertUtils.cart.removeConfirm(item.product.name);
    
    if (result.isConfirmed) {
      try {
        setLocalError('');
        await removeItem(productId);
        SweetAlertUtils.toast('success', 'ลบสินค้าออกจากตะกร้าแล้ว');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบสินค้า';
        setLocalError(errorMessage);
        SweetAlertUtils.error('ไม่สามารถลบสินค้าได้', errorMessage);
      }
    }
  };

  const handleClearCart = async () => {
    const result = await SweetAlertUtils.cart.clearConfirm();
    
    if (result.isConfirmed) {
      try {
        setLocalError('');
        await clearCart();
        SweetAlertUtils.toast('success', 'ล้างตะกร้าสินค้าแล้ว');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการล้างตะกร้า';
        setLocalError(errorMessage);
        SweetAlertUtils.error('ไม่สามารถล้างตะกร้าได้', errorMessage);
      }
    }
  };

  if (!isAuthenticated) {
    return null; 
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
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="mb-8">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">กลับไปหน้าหลัก</span>
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ตะกร้าสินค้า
          </h1>
          <p className="text-gray-600">
            คุณมีสินค้า <span className="font-semibold text-blue-600">{summary.totalItems} ชิ้น</span> ใน <span className="font-semibold">{summary.itemCount} รายการ</span>
          </p>
        </div>
        
        <button
          onClick={handleClearCart}
          className="hidden sm:flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors px-4 py-2 rounded-lg text-sm font-medium mt-4 sm:mt-0"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          ลบทั้งหมด
        </button>
      </div>
    </div>

    {(localError || cartError) && (
      <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm font-medium">
              {localError || cartError}
            </p>
          </div>
        </div>
      </div>
    )}

    {isLoading && (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      
      <div className="xl:col-span-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                รายการสินค้า
              </h2>
              <button
                onClick={handleClearCart}
                className="sm:hidden text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
              >
                ลบทั้งหมด
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm">
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
                                <div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                  <span class="text-blue-600 text-xs font-medium">${item.product.name.substring(0, 8)}</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-medium">
                            {item.product.name.substring(0, 8)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-grow min-w-0 space-y-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      {item.product.description && (
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {item.product.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">ราคาต่อชิ้น:</span>
                        <span className="font-bold text-blue-600">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        จำนวน: <span className="font-medium">{item.product.quantity} ชิ้น</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isLoading}
                        className="p-2 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="text-lg font-semibold px-4 py-1 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-2 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={isLoading}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="ลบสินค้า"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="xl:col-span-1">
        <div className="bg-white shadow-lg sticky top-8" style={{
          fontFamily: 'monospace',
          border: '2px dashed #000',
          maxWidth: '280px'
        }}>
          
          <div className="text-center py-4 px-4 border-b-2 border-dashed border-black">
            <h2 className="text-lg font-bold text-black mb-2">
              ใบเสร็จรับเงิน
            </h2>
            <div className="text-sm text-black">
              <div>วันที่: {new Date().toLocaleDateString('th-TH')}</div>
              <div>เวลา: {new Date().toLocaleTimeString('th-TH')}</div>
            </div>
          </div>

          <div className="px-4 py-4">
            
            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between">
                    <span className="truncate pr-2 text-black">
                      {item.product.name.length > 15 
                        ? `${item.product.name.substring(0, 15)}...` 
                        : item.product.name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between pl-2">
                    <span className="text-black">
                      {item.quantity} x {formatPrice(item.product.price).replace('฿', '')}
                    </span>
                    <span className="font-bold text-black">
                      {formatPrice(item.totalPrice).replace('฿', '')}
                    </span>
                  </div>
                  {index < items.length - 1 && (
                    <div className="border-b border-dashed border-gray-400 mt-2"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-black pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-black">
                <span>จำนวนสินค้า:</span>
                <span>{summary.totalItems} ชิ้น</span>
              </div>
              <div className="flex justify-between text-black">
                <span>จำนวนรายการ:</span>
                <span>{summary.itemCount} รายการ</span>
              </div>
            </div>

            <div className="border-t-2 border-double border-black mt-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black">
                  รวมทั้งหมด:
                </span>
                <span className="text-xl font-bold text-black">
                  ฿{formatPrice(summary.totalPrice).replace('฿', '').replace(',', ',')}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 mt-4 pt-3 text-center text-xs text-black">
              <div>*** ขอบคุณที่ใช้บริการ ***</div>
              <div className="mt-1">โทร: 02-xxx-xxxx</div>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-3">
            <button className="w-full bg-black text-white py-3 px-4 font-bold text-sm hover:bg-gray-800 transition-colors">
              ดำเนินการชำระเงิน
            </button>

            <div className="text-center">
              <Link
                to="/"
                className="text-black hover:text-gray-600 transition-colors text-sm underline"
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