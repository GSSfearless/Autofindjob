import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Clock, User, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const InterviewRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");

  const questions = [
    "请简单介绍一下你自己和你的技术背景",
    "描述一下你最有挑战性的项目经历",
    "如何处理项目中的技术难题？",
    "你如何保持技术技能的更新？",
    "为什么想要加入我们公司？"
  ];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer("");
    }
  };

  const isLastQuestion = currentQuestion === questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Interview Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-primary mb-2">
                AI模拟面试进行中
              </h1>
              <p className="text-muted-foreground">
                第 {currentQuestion} 题，共 {questions.length} 题
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Area */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <User className="w-16 h-16 text-primary/60" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <VideoOff className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* AI Interviewer Avatar */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="lg"
                    onClick={() => setIsRecording(!isRecording)}
                    className="group"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        停止录音
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        开始录音
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? (
                      <>
                        <VideoOff className="w-5 h-5 mr-2" />
                        关闭摄像头
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5 mr-2" />
                        打开摄像头
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Current Question */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-primary mb-2">AI面试官</p>
                    <p className="text-lg leading-relaxed">
                      {questions[currentQuestion - 1]}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <Card className="p-6">
                <h3 className="font-semibold text-primary mb-4">面试进度</h3>
                <div className="space-y-3">
                  {questions.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index + 1 < currentQuestion 
                          ? 'bg-primary text-primary-foreground' 
                          : index + 1 === currentQuestion
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm ${
                        index + 1 === currentQuestion ? 'font-medium text-primary' : 'text-muted-foreground'
                      }`}>
                        问题 {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Text Answer */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">文字回答</h3>
                </div>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="你也可以在这里输入文字回答..."
                  className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={handleNextQuestion}
                  disabled={isLastQuestion}
                  className="w-full"
                >
                  {isLastQuestion ? "已是最后一题" : "下一题"}
                </Button>
                
                {isLastQuestion && (
                  <Button asChild variant="hero" className="w-full">
                    <Link to="/feedback">完成面试，查看反馈</Link>
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <Link to="/feedback">查看实时反馈</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewRoom;