import ProductCard from "./Product_Card";
export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  badge?: string;
}
// Featured Products Component
const FeaturedProducts: React.FC = () => {
    
  const products: Product[] = [
    {
      id: 1,
      name: "PlayStation 5",
      price: "฿18,990",
      originalPrice: "฿21,990",
      image: "",
      rating: 5,
      badge: "HOT"
    },
    {
      id: 2,
      name: "Xbox Series X",
      price: "฿16,990",
      image: "",
      rating: 5
    },
    {
      id: 3,
      name: "Nintendo Switch OLED",
      price: "฿12,990",
      image: "",
      rating: 4
    },
    {
      id: 4,
      name: "Steam Deck",
      price: "฿19,990",
      image: "",
      rating: 4,
      badge: "NEW"
    }
  ];

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedProducts;