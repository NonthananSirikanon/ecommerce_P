
// Product Card Component
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  badge?: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm">{product.name}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        
      
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">{product.price}</span>
            
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;