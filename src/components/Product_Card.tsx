
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span class="text-gray-500 text-sm text-center px-4">${product.name}</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm text-center px-4">{product.name}</span>
          </div>
        )}
        
        {product.quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">หมดสต็อก</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2" title={product.description}>
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.quantity > 0 && (
              <span className="text-xs text-gray-500">
                เหลือ {product.quantity} ชิ้น
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.quantity <= 0 ? 'หมดสต็อก' : 'เพิ่มลงตะกร้า'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;