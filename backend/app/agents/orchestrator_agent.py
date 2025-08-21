from typing import Dict, Any, List
import asyncio
from .base_agent import BaseAgent
from .interviewer_agent import InterviewerAgent
from .evaluator_agent import EvaluatorAgent
from .topic_manager_agent import TopicManagerAgent
from ..models.schemas import InterviewSession, InterviewStatus
import structlog
import uuid

logger = structlog.get_logger()

class OrchestratorAgent(BaseAgent):
    """协调智能体 - 负责协调所有其他智能体的工作"""
    
    def __init__(self):
        super().__init__(
            name="OrchestratorAgent",
            role_description="面试流程协调者，负责统筹管理整个面试过程，协调各个智能体的工作"
        )
        
        # 初始化其他智能体
        self.interviewer = InterviewerAgent()
        self.evaluator = EvaluatorAgent()
        self.topic_manager = TopicManagerAgent()
        
        # 会话存储 (在生产环境中应使用数据库)
        self.sessions = {}
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """协调处理各种面试相关任务"""
        try:
            action = input_data.get("action")
            
            if action == "create_session":
                return await self._create_session(input_data)
            elif action == "start_interview":
                return await self._start_interview(input_data)
            elif action == "submit_answer":
                return await self._submit_answer(input_data)
            elif action == "get_next_question":
                return await self._get_next_question(input_data)
            elif action == "finish_interview":
                return await self._finish_interview(input_data)
            elif action == "get_session":
                return await self._get_session(input_data)
            else:
                return {
                    "success": False,
                    "error": f"未知操作: {action}",
                    "agent": self.name
                }
                
        except Exception as e:
            logger.error("OrchestratorAgent处理失败", error=str(e))
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }
    
    async def _create_session(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建面试会话"""
        try:
            session_id = str(uuid.uuid4())
            resume_analysis = input_data.get("resume_analysis")
            job_analysis = input_data.get("job_analysis")
            
            # 并行生成面试问题
            question_result = await self.interviewer.process({
                "resume_analysis": resume_analysis,
                "job_analysis": job_analysis,
                "question_count": 5
            })
            
            if not question_result.get("success"):
                raise Exception(f"问题生成失败: {question_result.get('error')}")
            
            questions = question_result.get("questions", [])
            
            # 转换简化数据为完整模型格式
            from ..models.schemas import ResumeAnalysis, JobAnalysis
            
            # 转换简历分析数据
            if resume_analysis:
                resume_model = ResumeAnalysis(
                    personal_info={"name": resume_analysis.get("name")} if resume_analysis.get("name") else None,
                    skills=resume_analysis.get("skills", []) if isinstance(resume_analysis.get("skills"), list) else [],
                    experience=[{"description": exp} for exp in resume_analysis.get("experience", [])] if isinstance(resume_analysis.get("experience"), list) else [],
                    education=[{"level": resume_analysis.get("education")}] if resume_analysis.get("education") and resume_analysis.get("education") != "Not specified" else None
                )
            else:
                resume_model = None
                
            # 转换职位分析数据
            if job_analysis:
                job_model = JobAnalysis(
                    position=job_analysis.get("position"),
                    required_skills=job_analysis.get("requirements", []) if isinstance(job_analysis.get("requirements"), list) else [],
                    experience_requirements=job_analysis.get("experience")
                )
            else:
                job_model = None
            
            # 创建面试会话
            session = InterviewSession(
                id=session_id,
                status=InterviewStatus.PENDING,
                resume_analysis=resume_model,
                job_analysis=job_model,
                questions=questions,
                answers=[],
                evaluations=[],
                current_question_index=0
            )
            
            self.sessions[session_id] = session
            
            logger.info(f"创建面试会话", session_id=session_id, questions_count=len(questions))
            
            return {
                "success": True,
                "session": session.dict(),
                "agent": self.name
            }
            
        except Exception as e:
            logger.error("创建面试会话失败", error=str(e))
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }
    
    async def _start_interview(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """开始面试"""
        session_id = input_data.get("session_id")
        
        if session_id not in self.sessions:
            return {
                "success": False,
                "error": "会话不存在",
                "agent": self.name
            }
        
        session = self.sessions[session_id]
        session.status = InterviewStatus.IN_PROGRESS
        
        if not session.questions:
            return {
                "success": False,
                "error": "没有面试问题",
                "agent": self.name
            }
        
        first_question = session.questions[0]
        
        logger.info(f"开始面试", session_id=session_id)
        
        return {
            "success": True,
            "session": session.dict(),
            "current_question": first_question.dict(),
            "agent": self.name
        }
    
    async def _submit_answer(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """提交答案并获取评估"""
        session_id = input_data.get("session_id")
        answer_data = input_data.get("answer")
        
        if session_id not in self.sessions:
            return {
                "success": False,
                "error": "会话不存在",
                "agent": self.name
            }
        
        session = self.sessions[session_id]
        current_index = session.current_question_index
        
        if current_index >= len(session.questions):
            return {
                "success": False,
                "error": "没有当前问题",
                "agent": self.name
            }
        
        current_question = session.questions[current_index]
        
        # 记录答案
        session.answers.append(answer_data)
        
        # 并行评估答案
        evaluation_result = await self.evaluator.process({
            "question": current_question.dict(),
            "answer": answer_data,
            "resume_context": session.resume_analysis,
            "job_context": session.job_analysis
        })
        
        if evaluation_result.get("success"):
            evaluation = evaluation_result.get("evaluation")
            session.evaluations.append(evaluation)
            
            logger.info(f"完成答案评估", 
                       session_id=session_id, 
                       question_index=current_index,
                       score=evaluation.score)
            
            return {
                "success": True,
                "evaluation": evaluation.dict(),
                "agent": self.name
            }
        else:
            logger.error("评估失败", error=evaluation_result.get("error"))
            return {
                "success": False,
                "error": evaluation_result.get("error"),
                "agent": self.name
            }
    
    async def _get_next_question(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """获取下一个问题"""
        session_id = input_data.get("session_id")
        
        if session_id not in self.sessions:
            return {
                "success": False,
                "error": "会话不存在",
                "agent": self.name
            }
        
        session = self.sessions[session_id]
        
        # 检查是否可以继续下一问题
        next_index = session.current_question_index + 1
        
        if next_index >= len(session.questions):
            # 面试结束
            return await self._finish_interview({"session_id": session_id})
        
        # 更新问题索引
        session.current_question_index = next_index
        next_question = session.questions[next_index]
        
        logger.info(f"进入下一问题", 
                   session_id=session_id, 
                   question_index=next_index)
        
        return {
            "success": True,
            "current_question": next_question.dict(),
            "question_index": next_index,
            "total_questions": len(session.questions),
            "agent": self.name
        }
    
    async def _finish_interview(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """完成面试"""
        session_id = input_data.get("session_id")
        
        if session_id not in self.sessions:
            return {
                "success": False,
                "error": "会话不存在",
                "agent": self.name
            }
        
        session = self.sessions[session_id]
        session.status = InterviewStatus.COMPLETED
        
        # 计算总体分数
        if session.evaluations:
            total_score = sum(eval.score for eval in session.evaluations)
            session.overall_score = round(total_score / len(session.evaluations), 1)
        else:
            session.overall_score = 0.0
        
        # 生成最终反馈
        try:
            final_feedback = await self.evaluator.generate_final_feedback(
                session.evaluations,
                session.resume_analysis,
                session.job_analysis
            )
            session.final_feedback = final_feedback
        except Exception as e:
            logger.error("生成最终反馈失败", error=str(e))
            session.final_feedback = f"面试已完成。总体得分：{session.overall_score}/10"
        
        logger.info(f"面试完成", 
                   session_id=session_id, 
                   overall_score=session.overall_score)
        
        return {
            "success": True,
            "session": session.dict(),
            "overall_score": session.overall_score,
            "final_feedback": session.final_feedback,
            "agent": self.name
        }
    
    async def _get_session(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """获取会话信息"""
        session_id = input_data.get("session_id")
        
        if session_id not in self.sessions:
            return {
                "success": False,
                "error": "会话不存在",
                "agent": self.name
            }
        
        session = self.sessions[session_id]
        return {
            "success": True,
            "session": session.dict(),
            "agent": self.name
        }
    
    async def get_session_status(self, session_id: str) -> Dict[str, Any]:
        """获取会话状态"""
        return await self._get_session({"session_id": session_id})
    
    def get_all_sessions(self) -> Dict[str, InterviewSession]:
        """获取所有会话（调试用）"""
        return self.sessions

# 创建全局协调者实例
orchestrator = OrchestratorAgent()