from typing import Dict, Any
import json
from .base_agent import BaseAgent
from ..models.schemas import InterviewQuestion, InterviewAnswer, InterviewEvaluation
import structlog

logger = structlog.get_logger()

class EvaluatorAgent(BaseAgent):
    """评估智能体 - 负责实时评估候选人回答"""
    
    def __init__(self):
        super().__init__(
            name="EvaluatorAgent", 
            role_description="专业的面试评估专家，能够客观、全面地评估候选人的回答质量和能力表现"
        )
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """评估候选人回答"""
        try:
            question = input_data.get("question")
            answer = input_data.get("answer")
            resume_context = input_data.get("resume_context")
            job_context = input_data.get("job_context")
            
            evaluation = await self.evaluate_answer(
                question, answer, resume_context, job_context
            )
            
            return {
                "success": True,
                "evaluation": evaluation,
                "agent": self.name
            }
        except Exception as e:
            logger.error("EvaluatorAgent处理失败", error=str(e))
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }
    
    async def evaluate_answer(
        self,
        question: Dict[str, Any],
        answer: Dict[str, Any], 
        resume_context: Dict[str, Any] = None,
        job_context: Dict[str, Any] = None
    ) -> InterviewEvaluation:
        """评估单个答案"""
        
        system_prompt = f"""{self.get_base_system_prompt()}

你需要对候选人的面试回答进行专业评估。请从以下维度进行评分（1-10分）和反馈：

评估维度：
1. 内容完整性 - 回答是否全面、有逻辑
2. 技术准确性 - 技术内容是否正确、深入
3. 表达清晰度 - 语言表达是否清晰、易懂
4. 相关性 - 回答是否切合问题要求
5. 深度和见解 - 是否展现了深入思考和独特见解

请提供：
- 总体评分 (1-10分)
- 详细反馈
- 答案的亮点和优势
- 需要改进的方面
- 具体改进建议

请以JSON格式返回评估结果。
"""

        context_info = ""
        if resume_context:
            context_info += f"\n候选人背景：{json.dumps(resume_context, ensure_ascii=False, indent=2)}"
        if job_context:
            context_info += f"\n目标职位：{json.dumps(job_context, ensure_ascii=False, indent=2)}"

        user_message = f"""
面试问题：
类型：{question.get('type', 'unknown')}
问题：{question.get('question', '')}
背景：{question.get('context', '')}

候选人回答：
文字回答：{answer.get('answer_text', '无文字回答')}
回答时长：{answer.get('duration', 0)}秒

{context_info}

请对这个回答进行详细评估。
"""

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.3)
            
            # 尝试解析JSON响应
            try:
                eval_data = json.loads(response)
            except json.JSONDecodeError:
                # JSON解析失败，提取基本信息
                eval_data = self._extract_evaluation_from_text(response)
            
            # 创建评估对象
            evaluation = InterviewEvaluation(
                question_id=question.get('id', ''),
                score=float(eval_data.get('score', 7.0)),
                feedback=eval_data.get('feedback', response),
                strengths=eval_data.get('strengths', []),
                areas_for_improvement=eval_data.get('areas_for_improvement', []),
                suggestions=eval_data.get('suggestions', [])
            )
            
            logger.info(f"完成答案评估", question_id=question.get('id'), score=evaluation.score)
            return evaluation
            
        except Exception as e:
            logger.error("答案评估失败", error=str(e))
            # 返回默认评估
            return InterviewEvaluation(
                question_id=question.get('id', ''),
                score=5.0,
                feedback=f"评估处理出现错误: {str(e)}",
                strengths=[],
                areas_for_improvement=["需要提供更详细的回答"],
                suggestions=["请尝试更具体地回答问题"]
            )
    
    def _extract_evaluation_from_text(self, text: str) -> Dict[str, Any]:
        """从文本中提取评估信息（备用方案）"""
        lines = text.split('\n')
        eval_data = {
            'score': 7.0,
            'feedback': text,
            'strengths': [],
            'areas_for_improvement': [],
            'suggestions': []
        }
        
        # 尝试提取评分
        for line in lines:
            if '分' in line and any(char.isdigit() for char in line):
                try:
                    # 提取数字
                    import re
                    numbers = re.findall(r'\d+\.?\d*', line)
                    if numbers:
                        score = float(numbers[0])
                        if 1 <= score <= 10:
                            eval_data['score'] = score
                            break
                except:
                    pass
        
        return eval_data
    
    async def calculate_overall_score(self, evaluations: list) -> float:
        """计算总体分数"""
        if not evaluations:
            return 0.0
        
        total_score = sum(eval.score for eval in evaluations)
        return round(total_score / len(evaluations), 1)
    
    async def generate_final_feedback(
        self, 
        evaluations: list, 
        resume_context: Dict[str, Any] = None,
        job_context: Dict[str, Any] = None
    ) -> str:
        """生成最终综合反馈"""
        
        system_prompt = f"""{self.get_base_system_prompt()}

请基于候选人在整场面试中的表现，生成一份综合评估报告。

报告应该包括：
1. 总体表现评价
2. 主要优势和亮点
3. 需要改进的方面
4. 针对性建议
5. 是否适合该职位的建议

请保持客观、专业、建设性的态度。
"""

        # 整理所有评估数据
        eval_summary = []
        for eval in evaluations:
            eval_summary.append({
                "问题ID": eval.question_id,
                "评分": eval.score,
                "反馈": eval.feedback[:200],  # 截取前200字符
                "优势": eval.strengths,
                "改进点": eval.areas_for_improvement
            })

        user_message = f"""
面试评估汇总：
{json.dumps(eval_summary, ensure_ascii=False, indent=2)}

总体平均分：{await self.calculate_overall_score(evaluations)}

请生成综合评估报告。
"""

        try:
            response = await self.generate_response(system_prompt, user_message, temperature=0.5)
            return response
        except Exception as e:
            logger.error("生成最终反馈失败", error=str(e))
            return f"面试已完成。平均得分：{await self.calculate_overall_score(evaluations)}/10"