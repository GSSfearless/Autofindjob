import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "个性化AI面试问题生成",
    "实时多维度评估反馈", 
    "详细的能力提升报告",
    "无限次练习机会"
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-primary mb-6 animate-fade-in">
            准备好获得梦想工作了吗？
          </h2>
          
          <p className="text-xl text-primary/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            加入数万名成功求职者的行列，让AI助力你的职业发展
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-primary/80">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/95 shadow-xl group">
              立即开始免费体验
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-white/10">
              预约产品演示
            </Button>
          </div>
          
          <p className="text-sm text-primary/60 mt-6">
            免费试用 • 无需信用卡 • 随时取消
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;