import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Clock, User, Bot, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { useInterview } from "@/hooks/useInterview";

const InterviewRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const navigate = useNavigate();
  
  const {
    session,
    currentQuestion,
    isLoading,
    error,
    startInterview,
    submitAnswer,
    nextQuestion,
    finishInterview,
    clearError
  } = useInterview();

  // Check if we have a session, if not redirect to upload
  useEffect(() => {
    console.log('InterviewRoom useEffect - session:', session);
    console.log('InterviewRoom useEffect - session?.id:', session?.id);
    console.log('InterviewRoom useEffect - session?.status:', session?.status);
    
    if (!session) {
      console.log('没有session，重定向到upload页面');
      navigate('/upload');
    } else if (session.status === 'pending') {
      console.log('session状态为pending，自动开始面试');
      // Auto start interview if session is ready
      startInterview().catch(console.error);
    } else {
      console.log('session状态:', session.status);
    }
  }, [session, navigate, startInterview]);
  
  if (!session) {
    return <div>加载中...</div>;
  }

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

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    
    try {
      clearError();
      await submitAnswer(userAnswer);
      setUserAnswer("");
    } catch (err) {
      console.error('提交答案失败:', err);
    }
  };

  const handleNextQuestion = async () => {
    try {
      clearError();
      await nextQuestion();
    } catch (err) {
      console.error('获取下一问题失败:', err);
    }
  };

  const handleFinishInterview = async () => {
    try {
      clearError();
      await finishInterview();
      navigate('/feedback');
    } catch (err) {
      console.error('完成面试失败:', err);
    }
  };

  const isLastQuestion = session && currentQuestion && 
    session.current_question_index >= (session.questions?.length || 1) - 1;

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
                第 {(session?.current_question_index || 0) + 1} 题，共 {session?.questions?.length || 0} 题
              </p>
              {session?.status && (
                <p className="text-sm text-muted-foreground">
                  状态：{session.status === 'in_progress' ? '进行中' : session.status}
                </p>
              )}
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
                    {currentQuestion ? (
                      <div>
                        <p className="text-lg leading-relaxed mb-2">
                          {currentQuestion.question}
                        </p>
                        {currentQuestion.context && (
                          <p className="text-sm text-muted-foreground italic">
                            {currentQuestion.context}
                          </p>
                        )}
                        {currentQuestion.expected_duration && (
                          <p className="text-xs text-muted-foreground mt-2">
                            建议回答时间：{Math.floor(currentQuestion.expected_duration / 60)}分钟
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {isLoading ? '加载问题中...' : '没有可用的问题'}
                      </p>
                    )}
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
                  {session?.questions?.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < (session.current_question_index || 0)
                          ? 'bg-primary text-primary-foreground' 
                          : index === (session.current_question_index || 0)
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm ${
                        index === (session.current_question_index || 0) ? 'font-medium text-primary' : 'text-muted-foreground'
                      }`}>
                        问题 {index + 1}
                      </span>
                    </div>
                  )) || []}
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

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    '提交答案'
                  )}
                </Button>
                
                <Button 
                  onClick={handleNextQuestion}
                  disabled={isLastQuestion || isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLastQuestion ? "已是最后一题" : "下一题"}
                </Button>
                
                {isLastQuestion && (
                  <Button 
                    onClick={handleFinishInterview}
                    disabled={isLoading}
                    variant="hero" 
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      '完成面试，查看反馈'
                    )}
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" asChild>
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