import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              PPGaming
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
             เว็บไซต์ขายเครื่องเล่นเกมคราคาถูก
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gaming-gradient hover:opacity-90 transition-opacity"
              >
                สั่งซื้อเลย
              </Button>
              <Button variant="outline" size="lg">
                ดูรายละเอียด
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gaming-gradient rounded-3xl blur-3xl opacity-20"></div>
            <img
              src="https://www.flashfly.net/wp/wp-content/uploads/2025/07/playstation-6.jpg"
              alt="Latest gaming consoles including PlayStation, Xbox, and Nintendo Switch"
              className="relative z-10 w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
