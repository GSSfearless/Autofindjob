import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, Brain, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Feedback = () => {
  const feedbackData = [
    {
      question: "请简单介绍一下你自己和你的技术背景",
      answer: "我是一名有3年经验的前端开发工程师，主要使用React和Vue框架...",
      scores: {
        technical: 85,
        communication: 90,
        structure: 78,
        confidence: 82
      },
      highlights: [
        "清晰地表达了技术背景",
        "展现了良好的沟通能力",
        "回答结构合理"
      ],
      improvements: [
        "可以增加更多具体的项目例子",
        "建议突出个人的独特优势"
      ],
      duration: "2分30秒"
    },
    {
      question: "描述一下你最有挑战性的项目经历",
      answer: "在上一个项目中，我们需要开发一个高并发的电商系统...",
      scores: {
        technical: 92,
        communication: 85,
        structure: 88,
        confidence: 86
      },
      highlights: [
        "技术方案描述详细",
        "体现了解决问题的能力",
        "展示了团队协作经验"
      ],
      improvements: [
        "可以量化项目成果",
        "建议增加遇到困难时的具体应对措施"
      ],
      duration: "3分15秒"
    }
  ];

  const overallScore = 86;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-4xl text-primary mb-4">
              实时评估反馈
            </h1>
            <p className="text-lg text-muted-foreground">
              AI为每个回答提供详细的多维度评估和改进建议
            </p>
          </div>

          {/* Overall Score */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-primary mb-2">{overallScore}</div>
              <p className="text-lg text-muted-foreground">总体评分</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-semibold text-primary mb-1">技术能力</div>
                <div className="text-2xl font-bold">89</div>
              </div>
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-semibold text-primary mb-1">沟通表达</div>
                <div className="text-2xl font-bold">88</div>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-semibold text-primary mb-1">逻辑结构</div>
                <div className="text-2xl font-bold">83</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-semibold text-primary mb-1">自信程度</div>
                <div className="text-2xl font-bold">84</div>
              </div>
            </div>
          </Card>

          {/* Individual Question Feedback */}
          <div className="space-y-8">
            {feedbackData.map((item, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-primary mb-2">
                      {item.question}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>回答时长: {item.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Answer Preview */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-primary mb-2">你的回答</h4>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>

                {/* Scores */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-primary mb-4">各维度评分</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>技术能力</span>
                          <span>{item.scores.technical}%</span>
                        </div>
                        <Progress value={item.scores.technical} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>沟通表达</span>
                          <span>{item.scores.communication}%</span>
                        </div>
                        <Progress value={item.scores.communication} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>逻辑结构</span>
                          <span>{item.scores.structure}%</span>
                        </div>
                        <Progress value={item.scores.structure} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>自信程度</span>
                          <span>{item.scores.confidence}%</span>
                        </div>
                        <Progress value={item.scores.confidence} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights and Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-primary">回答亮点</h4>
                    </div>
                    <div className="space-y-2">
                      {item.highlights.map((highlight, i) => (
                        <Badge key={i} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsDown className="w-5 h-5 text-orange-600" />
                      <h4 className="font-medium text-primary">改进建议</h4>
                    </div>
                    <div className="space-y-2">
                      {item.improvements.map((improvement, i) => (
                        <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="group">
              <Link to="/report">
                查看完整面试报告
                <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/interview">继续面试练习</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;