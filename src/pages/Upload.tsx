import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, Briefcase, ArrowRight, Loader2, AlertCircle, TestTube } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { useInterview } from "@/hooks/useInterview";

const Upload = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const navigate = useNavigate();
  const { uploadAndCreateSession, isLoading, error, clearError, isConnected } = useInterview();

  // Mock模式标识
  const isMockMode = true;

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setResumeFile(files[0]);
    }
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const canProceed = resumeFile && jdText.trim() && !isLoading && isConnected;

  const handleProceed = async () => {
    if (!resumeFile || !jdText.trim()) return;
    
    console.log('开始处理上传请求...');
    console.log('文件:', resumeFile.name);
    console.log('职位描述长度:', jdText.length);
    
    try {
      clearError();
      console.log('调用uploadAndCreateSession...');
      await uploadAndCreateSession(resumeFile, jdText);
      console.log('uploadAndCreateSession完成，准备导航到/interview');
      
      // 添加短暂延迟，确保session状态已更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/interview');
      console.log('导航完成');
    } catch (err) {
      console.error('上传失败:', err);
      // 错误会通过useInterview hook处理
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      {/* Mock模式标识 */}
      {isMockMode && (
        <div className="fixed top-20 right-4 z-50">
          <Alert className="bg-yellow-50 border-yellow-200">
            <TestTube className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 font-medium">
              🧪 Mock测试模式 - 使用模拟数据
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary mb-4">
              开始你的AI面试之旅
            </h1>
            <p className="text-lg text-muted-foreground">
              上传你的简历和目标职位描述，AI将为你量身定制面试问题
            </p>
            {isMockMode && (
              <p className="text-sm text-yellow-600 mt-2">
                💡 当前为测试模式，将使用模拟数据快速验证流程
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Resume Upload */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display font-bold text-2xl text-primary mb-2">
                  上传简历
                </h2>
                <p className="text-muted-foreground">
                  支持 PDF、Word 格式，最大 10MB
                </p>
              </div>

              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleResumeDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                {resumeFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium text-primary">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-medium text-primary mb-2">
                        拖拽文件到此处或点击上传
                      </p>
                      <p className="text-sm text-muted-foreground">
                        支持 PDF、DOC、DOCX 格式
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeSelect}
              />
            </Card>

            {/* Job Description */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-display font-bold text-2xl text-primary mb-2">
                  职位描述
                </h2>
                <p className="text-muted-foreground">
                  粘贴目标职位的详细要求和描述
                </p>
              </div>

              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="请粘贴职位描述，包括：
• 岗位职责
• 技能要求  
• 工作经验要求
• 其他相关信息..."
                className="w-full h-64 p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />

              <div className="mt-4 text-right">
                <span className="text-sm text-muted-foreground">
                  {jdText.length} 字符
                </span>
              </div>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Connection Status */}
          {!isConnected && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                后端服务连接中...请确保后端服务已启动
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="text-center">
            <Button
              onClick={handleProceed}
              disabled={!canProceed}
              size="lg"
              className="group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  开始AI面试
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              {isLoading 
                ? 'AI正在分析你的背景并生成个性化面试问题...'
                : '上传完成后，AI将分析你的背景并生成个性化面试问题'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;