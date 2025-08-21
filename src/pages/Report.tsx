import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Share2, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Calendar,
  Clock,
  Award,
  Brain,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Report = () => {
  const reportData = {
    interviewDate: "2024年1月15日",
    duration: "25分30秒",
    totalQuestions: 5,
    completedQuestions: 5,
    overallScore: 86,
    categoryScores: {
      technical: 89,
      communication: 88,
      structure: 83,
      confidence: 84
    },
    strengths: [
      "技术基础扎实，对前端框架有深入理解",
      "沟通表达清晰，逻辑思维能力强",
      "项目经验丰富，能够结合实际案例说明",
      "学习能力强，对新技术保持敏感度"
    ],
    improvements: [
      "回答问题时可以更加具体和量化",
      "可以增强对业务理解的表达",
      "建议提升对系统设计的整体思考",
      "面试中保持更加自信的表现"
    ],
    recommendations: [
      {
        category: "技术提升",
        items: [
          "深入学习系统设计原理",
          "练习算法和数据结构",
          "了解微服务架构模式"
        ]
      },
      {
        category: "面试技巧",
        items: [
          "练习STAR法则回答行为问题",
          "准备更多具体的项目案例",
          "提升技术问题的表达能力"
        ]
      },
      {
        category: "职业发展",
        items: [
          "关注行业发展趋势",
          "参与开源项目贡献",
          "建立个人技术品牌"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-4xl text-primary mb-4">
                面试报告
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{reportData.interviewDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{reportData.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享报告
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出PDF
              </Button>
            </div>
          </div>

          {/* Overall Summary */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="text-6xl font-bold text-primary mb-2">
                  {reportData.overallScore}
                </div>
                <p className="text-lg text-muted-foreground mb-4">总体评分</p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">面试表现优秀</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{reportData.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">总题数</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{reportData.completedQuestions}</div>
                  <div className="text-sm text-muted-foreground">已完成</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">A-</div>
                  <div className="text-sm text-muted-foreground">等级评定</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">Top 15%</div>
                  <div className="text-sm text-muted-foreground">排名百分位</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Scores */}
          <Card className="p-8 mb-8">
            <h2 className="font-display font-bold text-2xl text-primary mb-6">
              详细评分分析
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="font-medium">技术能力</span>
                    <span className="ml-auto font-bold">{reportData.categoryScores.technical}%</span>
                  </div>
                  <Progress value={reportData.categoryScores.technical} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    技术基础扎实，框架理解深入，具备解决复杂问题的能力
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span className="font-medium">沟通表达</span>
                    <span className="ml-auto font-bold">{reportData.categoryScores.communication}%</span>
                  </div>
                  <Progress value={reportData.categoryScores.communication} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    表达清晰流畅，能够有效传达技术概念和想法
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-medium">逻辑结构</span>
                    <span className="ml-auto font-bold">{reportData.categoryScores.structure}%</span>
                  </div>
                  <Progress value={reportData.categoryScores.structure} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    思路清晰，回答有条理，但可以进一步优化表达结构
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-medium">自信程度</span>
                    <span className="ml-auto font-bold">{reportData.categoryScores.confidence}%</span>
                  </div>
                  <Progress value={reportData.categoryScores.confidence} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    整体表现自然，建议在技术讨论中展现更多自信
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                优势亮点
              </h3>
              <div className="space-y-3">
                {reportData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{strength}</p>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                改进空间
              </h3>
              <div className="space-y-3">
                {reportData.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{improvement}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-8 mb-8">
            <h2 className="font-display font-bold text-2xl text-primary mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              个人提升计划
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {reportData.recommendations.map((rec, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-primary">{rec.category}</h3>
                  <div className="space-y-2">
                    {rec.items.map((item, i) => (
                      <Badge key={i} variant="outline" className="block p-2 text-center">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link to="/upload">
                开始新的面试练习
                <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">返回首页</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;