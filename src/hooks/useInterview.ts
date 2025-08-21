import { useState, useEffect, useRef } from 'react';
import { apiService, InterviewSession, InterviewQuestion } from '../services/api';

export interface InterviewState {
  session: InterviewSession | null;
  currentQuestion: InterviewQuestion | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export interface InterviewActions {
  uploadAndCreateSession: (file: File, jobDescription: string) => Promise<void>;
  startInterview: () => Promise<void>;
  submitAnswer: (answerText?: string, answerAudio?: string) => Promise<void>;
  nextQuestion: () => Promise<void>;
  finishInterview: () => Promise<void>;
  clearError: () => void;
}

export const useInterview = (): InterviewState & InterviewActions => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);

  // 调试用：监控session状态变化
  useEffect(() => {
    console.log('useInterview - session状态变化:', session);
  }, [session]);

  useEffect(() => {
    // 检查后端连接
    const checkConnection = async () => {
      const connected = await apiService.healthCheck();
      setIsConnected(connected);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // 30秒检查一次

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 建立WebSocket连接
    if (session?.id && !wsRef.current) {
      try {
        const ws = apiService.createWebSocket(session.id);
        
        ws.onopen = () => {
          console.log('WebSocket连接已建立');
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('收到WebSocket消息:', message);
            
            switch (message.type) {
              case 'interview_started':
                if (message.data?.current_question) {
                  setCurrentQuestion(message.data.current_question);
                }
                break;
              
              case 'next_question':
                if (message.data?.current_question) {
                  setCurrentQuestion(message.data.current_question);
                }
                break;
              
              case 'interview_complete':
                setCurrentQuestion(null);
                if (message.data?.session) {
                  setSession(message.data.session);
                }
                break;
              
              case 'evaluation':
                console.log('收到评估结果:', message.data);
                break;
              
              case 'interview_finished':
                if (message.data?.session) {
                  setSession(message.data.session);
                }
                break;
            }
          } catch (err) {
            console.error('解析WebSocket消息失败:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket错误:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket连接已关闭');
          wsRef.current = null;
        };

        wsRef.current = ws;

        // 发送心跳
        const heartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

        return () => {
          clearInterval(heartbeat);
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };
      } catch (err) {
        console.error('WebSocket连接失败:', err);
      }
    }
  }, [session?.id]);

  const uploadAndCreateSession = async (file: File, jobDescription: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('开始上传文件和分析...');
      
      // 上传文件并分析
      const uploadResponse = await apiService.uploadResumeAndJD(file, jobDescription);
      console.log('文件上传响应:', uploadResponse);
      
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message);
      }

      console.log('开始创建面试会话...');
      
      // 创建面试会话
      const sessionResponse = await apiService.createInterviewSession(
        uploadResponse.data.resume_analysis,
        uploadResponse.data.job_analysis,
        5 // 默认5个问题
      );
      
      console.log('面试会话创建响应:', sessionResponse);

      if (!sessionResponse.success) {
        throw new Error(sessionResponse.message);
      }

      console.log('设置会话状态:', sessionResponse.data);
      setSession(sessionResponse.data);
      
      // 等待一个微任务周期，确保状态更新
      await new Promise(resolve => setTimeout(resolve, 0));
      
      console.log('上传和会话创建完成');
    } catch (err) {
      console.error('上传和会话创建失败:', err);
      let errorMessage = '操作失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async () => {
    if (!session) {
      setError('没有找到面试会话');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.startInterview(session.id);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // 更新会话状态
      if (response.data?.session) {
        setSession(response.data.session);
      }

      // 设置当前问题
      if (response.data?.current_question) {
        setCurrentQuestion(response.data.current_question);
      }
    } catch (err) {
      let errorMessage = '开始面试失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answerText?: string, answerAudio?: string) => {
    if (!session || !currentQuestion) {
      setError('没有找到当前问题');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.submitAnswer(
        session.id,
        currentQuestion.id,
        answerText,
        answerAudio
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      console.log('答案提交成功:', response.data);
    } catch (err) {
      let errorMessage = '提交答案失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (!session) {
      setError('没有找到面试会话');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getNextQuestion(session.id);
      
      if (!response.success) {
        // 可能是面试结束
        if (response.message?.includes('完成') || response.message?.includes('结束')) {
          await finishInterview();
          return;
        }
        throw new Error(response.message);
      }

      // WebSocket会处理问题更新
    } catch (err) {
      let errorMessage = '获取下一问题失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async () => {
    if (!session) {
      setError('没有找到面试会话');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.finishInterview(session.id);
      
      if (response.success && response.data?.session) {
        setSession(response.data.session);
      }

      setCurrentQuestion(null);
    } catch (err) {
      let errorMessage = '完成面试失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // 清理WebSocket连接
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    session,
    currentQuestion,
    isLoading,
    error,
    isConnected,
    uploadAndCreateSession,
    startInterview,
    submitAnswer,
    nextQuestion,
    finishInterview,
    clearError,
  };
};