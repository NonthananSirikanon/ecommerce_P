import { ArrowRight } from "lucide-react";

// Hero Section Component
const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ประสบการณ์เกมที่ยอดเยี่ยม
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            เครื่องเล่นเกมและอุปกรณ์คุณภาพสูง พร้อมส่งทั่วประเทศ
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center">
            เริ่มช้อปปิ้ง
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
