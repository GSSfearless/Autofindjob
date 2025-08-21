// Mock API服务 - 用于测试前端流程
import { ResumeAnalysis, JobAnalysis, InterviewQuestion, InterviewSession } from './api';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock数据
const mockResumeAnalysis: ResumeAnalysis = {
  personal_info: { name: "张三", email: "zhangsan@example.com" },
  skills: ["JavaScript", "React", "Node.js", "Python", "FastAPI"],
  experience: [
    { company: "科技公司", position: "前端开发工程师", duration: "2年" },
    { company: "创业公司", position: "全栈开发工程师", duration: "1年" }
  ],
  education: [{ level: "本科", major: "计算机科学", school: "某大学" }],
  projects: [
    { name: "电商平台", description: "使用React和Node.js开发的电商系统" },
    { name: "AI聊天机器人", description: "基于Python的智能对话系统" }
  ]
};

const mockJobAnalysis: JobAnalysis = {
  position: "高级前端开发工程师",
  level: "Senior",
  responsibilities: [
    "负责公司核心产品的前端开发",
    "优化前端性能和用户体验",
    "指导初级开发人员"
  ],
  required_skills: ["JavaScript", "React", "TypeScript", "Node.js"],
  experience_requirements: "3-5年",
  education_requirements: "本科及以上"
};

const mockQuestions: InterviewQuestion[] = [
  {
    id: "q1",
    question: "请介绍一下你的技术栈和项目经验",
    type: "experience",
    context: "了解候选人的技术背景",
    expected_duration: 180
  },
  {
    id: "q2", 
    question: "在React项目中，你是如何管理状态的？请举例说明",
    type: "technical",
    context: "考察React技术深度",
    expected_duration: 240
  },
  {
    id: "q3",
    question: "描述一个你遇到的技术难题，以及你是如何解决的",
    type: "situation",
    context: "考察问题解决能力",
    expected_duration: 300
  },
  {
    id: "q4",
    question: "你如何看待前端性能优化？有哪些具体的优化策略？",
    type: "technical",
    context: "考察性能优化知识",
    expected_duration: 240
  },
  {
    id: "q5",
    question: "为什么选择我们公司？你对这个职位有什么期望？",
    type: "behavioral",
    context: "了解求职动机",
    expected_duration: 180
  }
];

const mockSession: InterviewSession = {
  id: "mock-session-123",
  status: "pending",
  resume_analysis: mockResumeAnalysis,
  job_analysis: mockJobAnalysis,
  questions: mockQuestions,
  current_question_index: 0
};

export class MockApiService {
  async uploadResumeAndJD(file: File, jobDescription: string) {
    console.log('Mock: 上传文件和分析', { fileName: file.name, jdLength: jobDescription.length });
    
    // 模拟处理时间
    await delay(2000);
    
    return {
      success: true,
      message: "文件上传和分析成功",
      data: {
        resume_text: "模拟简历内容...",
        resume_analysis: mockResumeAnalysis,
        job_analysis: mockJobAnalysis,
        filename: file.name
      }
    };
  }

  async createInterviewSession(
    resumeAnalysis: ResumeAnalysis,
    jobAnalysis: JobAnalysis,
    questionCount: number = 5
  ) {
    console.log('Mock: 创建面试会话', { questionCount });
    
    // 模拟处理时间
    await delay(1500);
    
    return {
      success: true,
      message: "面试会话创建成功",
      data: mockSession
    };
  }

  async startInterview(sessionId: string) {
    console.log('Mock: 开始面试', { sessionId });
    
    await delay(1000);
    
    return {
      success: true,
      message: "面试已开始",
      data: {
        session: { ...mockSession, status: "in_progress" },
        current_question: mockQuestions[0]
      }
    };
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    answerText?: string,
    answerAudio?: string
  ) {
    console.log('Mock: 提交答案', { sessionId, questionId, answerText });
    
    await delay(1000);
    
    return {
      success: true,
      message: "答案已提交",
      data: {
        evaluation: {
          question_id: questionId,
          score: 8.5,
          feedback: "回答得很好，展现了扎实的技术功底和清晰的表达能力。建议可以多举一些具体的例子。",
          strengths: ["技术理解深入", "表达清晰"],
          areas_for_improvement: ["可以多举实例"],
          suggestions: ["建议准备更多项目案例"]
        }
      }
    };
  }

  async getNextQuestion(sessionId: string) {
    console.log('Mock: 获取下一问题', { sessionId });
    
    await delay(800);
    
    const currentIndex = mockSession.current_question_index + 1;
    
    if (currentIndex >= mockQuestions.length) {
      return {
        success: true,
        message: "面试已完成",
        data: {
          session: { ...mockSession, status: "completed", overall_score: 8.2 },
          final_feedback: "整体表现优秀，技术基础扎实，沟通能力良好。建议录用。"
        }
      };
    }
    
    return {
      success: true,
      message: "获取下一问题成功",
      data: {
        current_question: mockQuestions[currentIndex],
        question_index: currentIndex,
        total_questions: mockQuestions.length
      }
    };
  }

  async finishInterview(sessionId: string) {
    console.log('Mock: 完成面试', { sessionId });
    
    await delay(1000);
    
    return {
      success: true,
      message: "面试已完成",
      data: {
        session: { 
          ...mockSession, 
          status: "completed", 
          overall_score: 8.2,
          final_feedback: "整体表现优秀，技术基础扎实，沟通能力良好。建议录用。"
        },
        overall_score: 8.2,
        final_feedback: "整体表现优秀，技术基础扎实，沟通能力良好。建议录用。"
      }
    };
  }

  async getSession(sessionId: string) {
    console.log('Mock: 获取会话信息', { sessionId });
    
    await delay(500);
    
    return {
      success: true,
      data: mockSession
    };
  }

  createWebSocket(sessionId: string): WebSocket {
    console.log('Mock: 创建WebSocket连接', { sessionId });
    
    // 创建一个模拟的WebSocket对象
    const mockWs = {
      readyState: WebSocket.OPEN,
      onopen: null as any,
      onmessage: null as any,
      onerror: null as any,
      onclose: null as any,
      send: (data: string) => {
        console.log('Mock WebSocket send:', data);
      },
      close: () => {
        console.log('Mock WebSocket close');
      }
    } as any;
    
    // 模拟连接建立
    setTimeout(() => {
      if (mockWs.onopen) mockWs.onopen();
    }, 100);
    
    return mockWs;
  }

  async healthCheck(): Promise<boolean> {
    console.log('Mock: 健康检查');
    return true;
  }
}

export const mockApiService = new MockApiService();
