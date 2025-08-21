from typing import Dict, Any, List
import json
from .base_agent import BaseAgent
from ..models.schemas import ResumeAnalysis, JobAnalysis, InterviewQuestion, QuestionType
import structlog
import uuid

logger = structlog.get_logger()

class InterviewerAgent(BaseAgent):
    """面试官智能体 - 负责生成相关的面试问题"""
    
    def __init__(self):
        super().__init__(
            name="InterviewerAgent",
            role_description="专业的技术面试官，能够根据候选人背景和职位要求生成相关、有深度的面试问题"
        )
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """生成面试问题"""
        try:
            resume_analysis = input_data.get("resume_analysis")
            job_analysis = input_data.get("job_analysis")
            question_count = input_data.get("question_count", 5)
            
            questions = await self.generate_questions(
                resume_analysis, 
                job_analysis, 
                question_count
            )
            
            return {
                "success": True,
                "questions": questions,
                "agent": self.name
            }
        except Exception as e:
            logger.error("InterviewerAgent处理失败", error=str(e))
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }
    
    async def generate_questions(
        self, 
        resume_analysis: Dict[str, Any],
        job_analysis: Dict[str, Any],
        question_count: int = 5
    ) -> List[InterviewQuestion]:
        """生成面试问题"""
        
        system_prompt = f"""生成{question_count}个面试问题，返回JSON格式：
[{{"question":"问题内容","type":"technical"}}]"""

        user_message = f"简历：{str(resume_analysis)[:200]}，职位：{str(job_analysis)[:200]}，生成{question_count}个面试问题。"

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.8)
            
            # 简化JSON解析
            try:
                # 清理markdown标记
                clean_response = response.replace("```json", "").replace("```", "").strip()
                questions_data = json.loads(clean_response)
                if not isinstance(questions_data, list):
                    questions_data = []
            except:
                questions_data = []
            
            questions = []
            for i, q_data in enumerate(questions_data[:question_count]):
                if isinstance(q_data, dict):
                    # 验证和清理问题类型
                    question_type = q_data.get("type", "technical")
                    # 确保问题类型是有效的枚举值
                    if question_type not in ["technical", "behavioral", "situation", "experience"]:
                        question_type = "technical"  # 默认使用technical类型
                    
                    question = InterviewQuestion(
                        id=str(uuid.uuid4()),
                        question=q_data.get("question", f"Question {i+1}"),
                        type=QuestionType(question_type),
                        context=q_data.get("context"),
                        expected_duration=q_data.get("expected_duration", 180),
                        follow_up_questions=q_data.get("follow_up_questions", [])
                    )
                    questions.append(question)
            
            if not questions:
                # 如果没有生成问题，使用备用问题
                questions = self._get_fallback_questions(question_count)
            
            logger.info(f"生成了{len(questions)}个面试问题")
            return questions
            
        except Exception as e:
            logger.error("问题生成失败", error=str(e))
            return self._get_fallback_questions(question_count)
    
    def _extract_questions_from_text(self, text: str) -> List[Dict[str, Any]]:
        """从文本中提取问题（备用方案）"""
        lines = text.split('\n')
        questions = []
        
        for line in lines:
            if line.strip() and ('?' in line or '问' in line):
                questions.append({
                    "question": line.strip(),
                    "type": "technical",
                    "expected_duration": 180
                })
        
        return questions
    
    def _get_fallback_questions(self, count: int) -> List[InterviewQuestion]:
        """获取备用问题"""
        fallback_questions = [
            {
                "question": "请简单介绍一下你自己和你的技术背景",
                "type": "experience",
                "expected_duration": 120,
                "context": "开场问题，了解候选人基本情况"
            },
            {
                "question": "描述一下你最有挑战性的项目经历，以及你是如何解决遇到的问题的",
                "type": "situation",
                "expected_duration": 300,
                "context": "考察问题解决能力和项目经验"
            },
            {
                "question": "你如何保持技术技能的更新？请分享一些具体的学习方法",
                "type": "behavioral",
                "expected_duration": 180,
                "context": "了解学习能力和技术敏感度"
            },
            {
                "question": "如果你需要学习一个全新的技术栈来完成项目，你会采用什么策略？",
                "type": "situation",
                "expected_duration": 180,
                "context": "考察学习能力和适应性"
            },
            {
                "question": "为什么想要加入我们公司？你了解我们公司的哪些情况？",
                "type": "behavioral",
                "expected_duration": 120,
                "context": "了解求职动机和对公司的了解程度"
            }
        ]
        
        questions = []
        for i in range(min(count, len(fallback_questions))):
            q_data = fallback_questions[i]
            question = InterviewQuestion(
                id=str(uuid.uuid4()),
                question=q_data["question"],
                type=QuestionType(q_data["type"]),
                context=q_data["context"],
                expected_duration=q_data["expected_duration"],
                follow_up_questions=[]
            )
            questions.append(question)
        
        return questions