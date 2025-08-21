from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class InterviewStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class QuestionType(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    SITUATION = "situation"
    EXPERIENCE = "experience"

class UploadRequest(BaseModel):
    job_description: str = Field(..., description="职位描述文本")

class ResumeAnalysis(BaseModel):
    personal_info: Optional[Dict[str, Any]] = None
    education: Optional[List[Dict[str, Any]]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    highlights: Optional[List[str]] = None

class JobAnalysis(BaseModel):
    position: Optional[str] = None
    level: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    experience_requirements: Optional[str] = None
    education_requirements: Optional[str] = None
    other_requirements: Optional[List[str]] = None

class InterviewQuestion(BaseModel):
    id: str
    question: str
    type: QuestionType
    context: Optional[str] = None
    expected_duration: Optional[int] = None  # seconds
    follow_up_questions: Optional[List[str]] = None

class InterviewAnswer(BaseModel):
    question_id: str
    answer_text: Optional[str] = None
    answer_audio: Optional[str] = None  # base64 encoded audio
    duration: Optional[int] = None  # seconds
    timestamp: datetime = Field(default_factory=datetime.now)

class InterviewEvaluation(BaseModel):
    question_id: str
    score: float = Field(..., ge=0, le=10)
    feedback: str
    strengths: Optional[List[str]] = None
    areas_for_improvement: Optional[List[str]] = None
    suggestions: Optional[List[str]] = None

class InterviewSession(BaseModel):
    id: str
    status: InterviewStatus = InterviewStatus.PENDING
    resume_analysis: Optional[ResumeAnalysis] = None
    job_analysis: Optional[JobAnalysis] = None
    questions: List[InterviewQuestion] = []
    answers: List[InterviewAnswer] = []
    evaluations: List[InterviewEvaluation] = []
    current_question_index: int = 0
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    overall_score: Optional[float] = None
    final_feedback: Optional[str] = None

class StartInterviewRequest(BaseModel):
    session_id: str

class SubmitAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer_text: Optional[str] = None
    answer_audio: Optional[str] = None

class WebSocketMessage(BaseModel):
    type: str  # question, evaluation, status, error
    data: Dict[str, Any]
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.now)

class QuestionGenerationRequest(BaseModel):
    resume_analysis: Dict[str, Any]  # 改为更灵活的字典格式
    job_analysis: Dict[str, Any]      # 改为更灵活的字典格式
    question_count: int = Field(default=5, ge=1, le=10)

class EvaluationRequest(BaseModel):
    question: InterviewQuestion
    answer: InterviewAnswer
    resume_context: Optional[ResumeAnalysis] = None
    job_context: Optional[JobAnalysis] = None