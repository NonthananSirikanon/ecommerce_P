import React from 'react';
import ProductCard from "./Product_Card";
import { useFeaturedProducts } from '../hooks/useProducts';

const FeaturedProducts: React.FC = () => {
  const { products, loading, error, refetch } = useFeaturedProducts(8);


  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-start mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            สินค้าแนะนำ
          </h2>
          <p className="text-gray-600">
            เครื่องเล่นเกมยอดนิยมและคุณภาพสูงที่คัดสรรมาเป็นพิเศษ
          </p>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">กำลังโหลดสินค้า...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center">
            <p>{error}</p>
            <button 
              onClick={refetch} 
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ไม่มีสินค้าแนะนำในขณะนี้</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default FeaturedProducts;