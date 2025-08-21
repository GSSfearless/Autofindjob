from typing import Dict, Any, List
import json
from .base_agent import BaseAgent
from ..models.schemas import InterviewQuestion, InterviewAnswer
import structlog

logger = structlog.get_logger()

class TopicManagerAgent(BaseAgent):
    """话题管理智能体 - 负责控制面试话题流程和深度"""
    
    def __init__(self):
        super().__init__(
            name="TopicManagerAgent",
            role_description="专业的面试流程管理专家，能够根据候选人回答动态调整话题深度和方向"
        )
        self.topic_stack = []  # 话题栈
        self.current_depth = 0  # 当前深度
        self.max_depth = 3     # 最大深入层次
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理话题管理请求"""
        try:
            action = input_data.get("action")  # "next_question", "follow_up", "deep_dive", "topic_switch"
            
            if action == "next_question":
                return await self._handle_next_question(input_data)
            elif action == "follow_up":
                return await self._handle_follow_up(input_data)
            elif action == "deep_dive":
                return await self._handle_deep_dive(input_data)
            elif action == "topic_switch":
                return await self._handle_topic_switch(input_data)
            else:
                return await self._handle_next_question(input_data)
                
        except Exception as e:
            logger.error("TopicManagerAgent处理失败", error=str(e))
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }
    
    async def _handle_next_question(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理下一个问题的请求"""
        current_question_index = input_data.get("current_question_index", 0)
        total_questions = input_data.get("total_questions", 5)
        questions = input_data.get("questions", [])
        
        if current_question_index >= total_questions - 1:
            return {
                "success": True,
                "action": "interview_complete",
                "message": "面试已完成所有问题",
                "agent": self.name
            }
        
        next_index = current_question_index + 1
        next_question = questions[next_index] if next_index < len(questions) else None
        
        return {
            "success": True,
            "action": "next_question",
            "next_question_index": next_index,
            "next_question": next_question,
            "agent": self.name
        }
    
    async def _handle_follow_up(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理追问"""
        current_question = input_data.get("current_question")
        candidate_answer = input_data.get("candidate_answer")
        
        if not current_question or not candidate_answer:
            return await self._handle_next_question(input_data)
        
        # 分析是否需要追问
        should_follow_up = await self._should_generate_follow_up(current_question, candidate_answer)
        
        if should_follow_up:
            follow_up_question = await self._generate_follow_up_question(current_question, candidate_answer)
            return {
                "success": True,
                "action": "follow_up",
                "follow_up_question": follow_up_question,
                "agent": self.name
            }
        else:
            return await self._handle_next_question(input_data)
    
    async def _handle_deep_dive(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理深入探讨"""
        current_topic = input_data.get("current_topic")
        candidate_answer = input_data.get("candidate_answer")
        
        if self.current_depth >= self.max_depth:
            return await self._handle_next_question(input_data)
        
        deep_dive_question = await self._generate_deep_dive_question(current_topic, candidate_answer)
        self.current_depth += 1
        
        return {
            "success": True,
            "action": "deep_dive",
            "deep_dive_question": deep_dive_question,
            "current_depth": self.current_depth,
            "agent": self.name
        }
    
    async def _handle_topic_switch(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理话题切换"""
        self.current_depth = 0  # 重置深度
        return await self._handle_next_question(input_data)
    
    async def _should_generate_follow_up(self, question: Dict[str, Any], answer: Dict[str, Any]) -> bool:
        """判断是否需要追问"""
        system_prompt = f"""{self.get_base_system_prompt()}

请判断候选人的回答是否需要追问。考虑以下因素：
1. 回答是否过于简短或模糊
2. 是否涉及有趣的技术细节值得深入
3. 是否有矛盾或需要澄清的地方
4. 是否可以更好地展示候选人能力

请回答 "是" 或 "否"。
"""

        user_message = f"""
问题：{question.get('question', '')}
候选人回答：{answer.get('answer_text', '')}
回答时长：{answer.get('duration', 0)}秒

是否需要追问？
"""

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.1)
            return "是" in response.lower() or "yes" in response.lower()
        except Exception as e:
            logger.error("判断是否追问失败", error=str(e))
            return False
    
    async def _generate_follow_up_question(self, question: Dict[str, Any], answer: Dict[str, Any]) -> str:
        """生成追问问题"""
        system_prompt = f"""{self.get_base_system_prompt()}

基于候选人的回答，生成一个合适的追问问题。追问应该：
1. 针对回答中的关键点进行深入
2. 帮助候选人更好地展示能力
3. 保持面试的自然流程
4. 具有建设性

请直接返回追问问题，不需要额外格式。
"""

        user_message = f"""
原问题：{question.get('question', '')}
候选人回答：{answer.get('answer_text', '')}

请生成追问问题：
"""

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.7)
            return response.strip()
        except Exception as e:
            logger.error("生成追问问题失败", error=str(e))
            return "能否详细说明一下这个方面？"
    
    async def _generate_deep_dive_question(self, topic: str, answer: Dict[str, Any]) -> str:
        """生成深入探讨问题"""
        system_prompt = f"""{self.get_base_system_prompt()}

基于当前话题和候选人的回答，生成一个深入探讨的问题。问题应该：
1. 在当前话题基础上更深入
2. 考察更高层次的理解
3. 探索实际应用场景
4. 挑战候选人的思考深度

请直接返回深入问题，不需要额外格式。
"""

        user_message = f"""
当前话题：{topic}
候选人最近回答：{answer.get('answer_text', '')}

请生成深入探讨问题：
"""

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.7)
            return response.strip()
        except Exception as e:
            logger.error("生成深入问题失败", error=str(e))
            return "如果面对更复杂的场景，你会怎样处理？"
    
    async def suggest_interview_flow(self, questions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """建议面试流程"""
        system_prompt = f"""{self.get_base_system_prompt()}

请为以下面试问题设计最佳的提问顺序和流程策略。考虑：
1. 问题难度的递进
2. 话题的逻辑关联
3. 候选人的心理状态变化
4. 面试的整体节奏

请提供重新排序的建议和流程说明。
"""

        questions_text = "\n".join([
            f"{i+1}. {q.get('question', '')} (类型: {q.get('type', 'unknown')})"
            for i, q in enumerate(questions)
        ])

        user_message = f"""
面试问题列表：
{questions_text}

请建议最佳面试流程：
"""

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.5)
            return {
                "success": True,
                "flow_suggestion": response,
                "agent": self.name
            }
        except Exception as e:
            logger.error("生成面试流程建议失败", error=str(e))
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }