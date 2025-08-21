// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-lg mb-4 inline-block">
              GameZone
            </div> */}
            <p className="text-gray-400">
              ร้านขายเครื่องเล่นเกมชั้นนำในประเทศไทย
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">หมวดหมู่</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">PlayStation</a></li>
              <li><a href="#" className="hover:text-white">Xbox</a></li>
              <li><a href="#" className="hover:text-white">Nintendo</a></li>
              <li><a href="#" className="hover:text-white">PC Gaming</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">บริการ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">การจัดส่ง</a></li>
              <li><a href="#" className="hover:text-white">การคืนสินค้า</a></li>
              <li><a href="#" className="hover:text-white">รับประกัน</a></li>
              <li><a href="#" className="hover:text-white">ติดต่อเรา</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">ติดตาม</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        
      </div>
    </footer>
  );
};
export default Footer;