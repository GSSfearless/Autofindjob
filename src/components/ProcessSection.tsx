import { Card } from "@/components/ui/card";
import { Upload, Brain, MessageSquare, BarChart3, FileText, Target } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "上传简历和JD",
      description: "智能解析候选人背景和岗位要求，为个性化面试做准备",
      color: "text-primary"
    },
    {
      icon: Brain,
      title: "AI背景分析",
      description: "深度理解技能匹配度，识别重点考察领域和潜在提升空间",
      color: "text-primary"
    },
    {
      icon: MessageSquare,
      title: "动态面试生成",
      description: "根据分析结果实时生成个性化问题，确保面试的针对性和深度",
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "实时评估反馈",
      description: "多维度智能评分，即时指出回答亮点和改进建议",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "详细面试报告",
      description: "生成全面的表现分析报告，包含具体的提升路径规划",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "个人改进计划",
      description: "基于评估结果制定专属学习计划，助力快速提升面试技能",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-primary mb-6">
            智能面试流程
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            从简历上传到改进计划，6步闭环式AI面试训练，让每次练习都更有价值
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-soft hover:shadow-medium transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  
                  <div className="text-sm font-bold text-primary/60 mb-2">
                    STEP {index + 1}
                  </div>
                  
                  <h3 className="font-display font-bold text-xl text-primary mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;