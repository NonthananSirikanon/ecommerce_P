// Features Component
const Features: React.FC = () => {
  const features = [
    {
      title: "จัดส่งฟรี",
      description: "สั่งซื้อครบ ฿1,500 จัดส่งฟรีทั่วประเทศ",
      icon: "🚚"
    },
    {
      title: "รับประกันคุณภาพ",
      description: "สินค้าทุกชิ้นผ่านการตรวจสอบคุณภาพ",
      icon: "✅"
    },
    {
      title: "บริการหลังการขาย",
      description: "ทีมซัพพอร์ตพร้อมให้บริการ 24/7",
      icon: "💬"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;