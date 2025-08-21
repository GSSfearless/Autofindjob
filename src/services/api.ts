const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ResumeAnalysis {
  personal_info?: any;
  education?: any[];
  experience?: any[];
  skills?: string[];
  projects?: any[];
  highlights?: string[];
}

export interface JobAnalysis {
  position?: string;
  level?: string;
  responsibilities?: string[];
  required_skills?: string[];
  experience_requirements?: string;
  education_requirements?: string;
  other_requirements?: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: string;
  context?: string;
  expected_duration?: number;
  follow_up_questions?: string[];
}

export interface InterviewSession {
  id: string;
  status: string;
  resume_analysis?: ResumeAnalysis;
  job_analysis?: JobAnalysis;
  questions: InterviewQuestion[];
  current_question_index: number;
  overall_score?: number;
  final_feedback?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    resume_text: string;
    resume_analysis: ResumeAnalysis;
    job_analysis: JobAnalysis;
    filename: string;
  };
}

export interface InterviewResponse {
  success: boolean;
  message: string;
  data: any;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async uploadResumeAndJD(file: File, jobDescription: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('resume_file', file);
    formData.append('job_description', jobDescription);

    const response = await fetch(`${this.baseUrl}/api/upload/resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '上传失败');
    }

    return response.json();
  }

  async createInterviewSession(
    resumeAnalysis: ResumeAnalysis,
    jobAnalysis: JobAnalysis,
    questionCount: number = 5
  ): Promise<InterviewResponse> {
    const response = await fetch(`${this.baseUrl}/api/interview/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_analysis: resumeAnalysis,
        job_analysis: jobAnalysis,
        question_count: questionCount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '创建面试会话失败');
    }

    return response.json();
  }

  async startInterview(sessionId: string): Promise<InterviewResponse> {
    const response = await fetch(`${this.baseUrl}/api/interview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '开始面试失败');
    }

    return response.json();
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    answerText?: string,
    answerAudio?: string
  ): Promise<InterviewResponse> {
    const response = await fetch(`${this.baseUrl}/api/interview/submit-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        answer_text: answerText,
        answer_audio: answerAudio,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '提交答案失败');
    }

    return response.json();
  }

  async getNextQuestion(sessionId: string): Promise<InterviewResponse> {
    const response = await fetch(`${this.baseUrl}/api/interview/next-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '获取下一问题失败');
    }

    return response.json();
  }

  async finishInterview(sessionId: string): Promise<InterviewResponse> {
    const response = await fetch(`${this.baseUrl}/api/interview/finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '完成面试失败');
    }

    return response.json();
  }

  async getSession(sessionId: string): Promise<InterviewResponse> {
    const response = await fetch(`${this.baseUrl}/api/interview/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '获取会话信息失败');
    }

    return response.json();
  }

  createWebSocket(sessionId: string): WebSocket {
    const wsUrl = this.baseUrl.replace('http', 'ws');
    return new WebSocket(`${wsUrl}/api/interview/ws/${sessionId}`);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();