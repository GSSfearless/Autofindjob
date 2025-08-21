import { Card } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      title: "ASK",
      subtitle: "智能提问生成",
      description: "Generates contextual interview questions in real-time.",
      color: "brand-pink",
      gradient: "gradient-pink",
      image: "/lovable-uploads/0519a86d-b553-46e8-8644-a0df03f67834.png"
    },
    {
      title: "GUIDE",
      subtitle: "面试流程引导",
      description: "Controls topic flow and depth in real-time",
      color: "brand-green",
      gradient: "gradient-green",
      image: "/lovable-uploads/37d4044b-b388-40d8-a9d9-71592c99ba53.png"
    },
    {
      title: "SCORE",
      subtitle: "实时评估反馈",
      description: "Evaluates responses in real-time.",
      color: "brand-blue",
      gradient: "gradient-blue",
      image: "/lovable-uploads/2a2cc1a9-0ca1-4f11-a514-ab2085e92dd8.png"
    },
    {
      title: "SYNC",
      subtitle: "多维度协调",
      description: "Coordinates all agents in real-time.",
      color: "brand-purple",
      gradient: "gradient-purple",
      image: "/lovable-uploads/671c5b55-5eca-4342-9db2-0a51fbb95864.png"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-primary mb-6">
            四大核心AI能力
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            通过先进的AI技术栈，为每位求职者提供个性化、专业化的面试训练体验
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="relative overflow-hidden border-0 shadow-medium hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`bg-${feature.gradient} p-8 h-full flex flex-col`}>
                {/* Feature Image */}
                <div className="mb-6 flex justify-center">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-auto max-w-[200px] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-display font-black text-2xl text-primary mb-2">
                    {feature.title}
                  </h3>
                  <h4 className="font-semibold text-lg text-primary/80 mb-4">
                    {feature.subtitle}
                  </h4>
                  <p className="text-primary/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;