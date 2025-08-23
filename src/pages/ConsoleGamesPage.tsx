import React, { useState } from 'react';
import { Gamepad2, Search, Filter } from 'lucide-react';
import ProductCard from '../components/Product_Card';
import { useProducts } from '../hooks/useProducts';

const ConsoleGamesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { products, loading, error, refetch, pagination } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Gamepad2 className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">ซื้อเครื่องเกม</h1>
            <p className="text-xl text-blue-100">
              เครื่องเล่นเกมคุณภาพสูง เกมยอดนิยม และอุปกรณ์เสริมครบครัน
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700 font-medium">ค้นหาและกรองสินค้า</span>
            </div>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาเครื่องเกม, เกม, อุปกรณ์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            เครื่องเกมและอุปกรณ์
          </h2>
          {pagination && (
            <p className="text-gray-600">
              พบสินค้า {pagination.totalProducts} รายการ (หน้า {currentPage} จาก {totalPages})
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">กำลังโหลดสินค้า...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
            <p className="mb-3">{error}</p>
            <button 
              onClick={refetch} 
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <Gamepad2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-2">ไม่พบสินค้าที่ต้องการ</p>
            <p className="text-gray-400">ลองค้นหาด้วยคำอื่นหรือดูสินค้าทั้งหมด</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ก่อนหน้า
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConsoleGamesPage;