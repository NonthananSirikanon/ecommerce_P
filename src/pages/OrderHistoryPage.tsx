import React, { useState, useCallback } from 'react';
import { Search, Filter, Package, CreditCard, AlertCircle } from 'lucide-react';
import { useOrderHistory, useOrderHistoryStats } from '../hooks/useOrderHistory';
import OrderHistoryCard from '../components/OrderHistoryCard';
import type { OrderHistoryQueryParams, OrderStatus, PaymentStatus } from '../types/orderHistory';

const OrderHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<OrderHistoryQueryParams>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  const {
    orderHistory,
    loading,
    error,
    pagination,
    refetch,
    clearError
  } = useOrderHistory(filters);

  const {
    summary,
    loading: statsLoading
  } = useOrderHistoryStats();

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you might want to implement search by order number
    // For now, we'll just refetch with current filters
    refetch(filters);
  }, [filters, refetch]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<OrderHistoryQueryParams>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    refetch(updatedFilters);
  }, [filters, refetch]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    refetch(updatedFilters);
  }, [filters, refetch]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const clearedFilters = { page: 1, limit: 10 };
    setFilters(clearedFilters);
    setSearchTerm('');
    refetch(clearedFilters);
  }, [refetch]);

  // Handle view detail (placeholder for future implementation)
  const handleViewDetail = useCallback((orderId: string) => {
    console.log('View order detail:', orderId);
    // In a real implementation, you might navigate to a detail page
    // navigate(`/orders/${orderId}`);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              refetch(filters);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติการสั่งซื้อ</h1>
          <p className="text-gray-600">ดูประวัติการสั่งซื้อและติดตามสถานะของคุณ</p>
        </div>

        {/* Stats Summary */}
        {summary && !statsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.totalOrders}
                  </div>
                  <div className="text-sm text-gray-600">คำสั่งซื้อทั้งหมด</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.completedOrders}
                  </div>
                  <div className="text-sm text-gray-600">สำเร็จแล้ว</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.paidOrders}
                  </div>
                  <div className="text-sm text-gray-600">ชำระเงินแล้ว</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ฿{parseFloat(summary.totalSpent).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">ยอดรวมทั้งหมด</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยหมายเลขคำสั่งซื้อ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              ตัวกรอง
            </button>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ล้างตัวกรอง
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Order Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานะคำสั่งซื้อ
                  </label>
                  <select
                    value={filters.orderStatus || ''}
                    onChange={(e) => handleFilterChange({
                      orderStatus: e.target.value as OrderStatus || undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">ทั้งหมด</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="processing">กำลังประมวลผล</option>
                    <option value="shipped">จัดส่งแล้ว</option>
                    <option value="delivered">ส่งแล้ว</option>
                    <option value="cancelled">ยกเลิกแล้ว</option>
                    <option value="refunded">คืนเงินแล้ว</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานะการชำระเงิน
                  </label>
                  <select
                    value={filters.paymentStatus || ''}
                    onChange={(e) => handleFilterChange({
                      paymentStatus: e.target.value as PaymentStatus || undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">ทั้งหมด</option>
                    <option value="pending">รอชำระเงิน</option>
                    <option value="processing">กำลังประมวลผล</option>
                    <option value="completed">ชำระเงินแล้ว</option>
                    <option value="failed">ชำระไม่สำเร็จ</option>
                    <option value="cancelled">ยกเลิกแล้ว</option>
                    <option value="refunded">คืนเงินแล้ว</option>
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่เริ่มต้น
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange({
                      dateFrom: e.target.value || undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่สิ้นสุด
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange({
                      dateTo: e.target.value || undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order History List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดประวัติการสั่งซื้อ...</p>
          </div>
        ) : orderHistory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบประวัติการสั่งซื้อ</h3>
            <p className="text-gray-600">คุณยังไม่มีประวัติการสั่งซื้อหรือลองปรับเปลี่ยนตัวกรอง</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                แสดง {orderHistory.length} รายการ จากทั้งหมด {pagination.totalOrders} รายการ
              </p>
            </div>

            {/* Order Cards */}
            <div className="grid gap-6 mb-8">
              {orderHistory.map((order) => (
                <OrderHistoryCard
                  key={order.id}
                  orderHistory={order}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ก่อนหน้า
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          pagination.currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;