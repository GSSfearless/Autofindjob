import asyncio
import json
from datetime import datetime
from app.main import MockInterviewerAgent, MockTopicManagerAgent, MockEvaluatorAgent, MockOrchestratorAgent

class TestAgentSystem:
    def __init__(self):
        self.interviewer = MockInterviewerAgent()
        self.topic_manager = MockTopicManagerAgent()
        self.evaluator = MockEvaluatorAgent()
        self.orchestrator = MockOrchestratorAgent()
    
    async def test_interviewer_agent(self):
        """测试面试官代理"""
        print("🧪 测试 InterviewerAgent...")
        
        context = {"question_count": 0}
        result = await self.interviewer.generate_question(context)
        
        assert result["agent"] == "InterviewerAgent"
        assert result["action"] == "generate_question"
        assert "question" in result
        assert result["timestamp"]
        
        print(f"✅ InterviewerAgent 测试通过")
        print(f"   生成问题: {result['question']}")
        return result
    
    async def test_topic_manager_agent(self):
        """测试话题管理代理"""
        print("🧪 测试 TopicManagerAgent...")
        
        context = {"topic_index": 0}
        result = await self.topic_manager.manage_topic_flow(context)
        
        assert result["agent"] == "TopicManagerAgent"
        assert result["action"] == "manage_topic_flow"
        assert "current_topic" in result
        assert result["timestamp"]
        
        print(f"✅ TopicManagerAgent 测试通过")
        print(f"   当前话题: {result['current_topic']}")
        return result
    
    async def test_evaluator_agent(self):
        """测试评估代理"""
        print("🧪 测试 EvaluatorAgent...")
        
        response = "我是一名有3年经验的Python开发者，擅长后端开发和API设计..."
        context = {"question_count": 1}
        result = await self.evaluator.evaluate_response(response, context)
        
        assert result["agent"] == "EvaluatorAgent"
        assert result["action"] == "evaluate_response"
        assert "score" in result
        assert "feedback" in result
        assert result["timestamp"]
        
        print(f"✅ EvaluatorAgent 测试通过")
        print(f"   评分: {result['score']}/100")
        print(f"   反馈: {result['feedback']}")
        return result
    
    async def test_orchestrator_agent(self):
        """测试协调器代理"""
        print("🧪 测试 OrchestratorAgent...")
        
        # 测试开始面试
        session_id = "test-session-001"
        start_result = await self.orchestrator.coordinate_interview(session_id, "start_interview")
        
        assert start_result["session_id"] == session_id
        assert start_result["action"] == "interview_started"
        assert "question" in start_result
        assert "topic" in start_result
        assert "agents_used" in start_result
        
        print(f"✅ OrchestratorAgent 开始面试测试通过")
        print(f"   会话ID: {start_result['session_id']}")
        print(f"   问题: {start_result['question']}")
        print(f"   话题: {start_result['topic']}")
        print(f"   使用代理: {', '.join(start_result['agents_used'])}")
        
        # 测试提交回答
        response = "我使用Python和FastAPI开发了一个RESTful API..."
        response_result = await self.orchestrator.coordinate_interview(session_id, "submit_response", {"response": response})
        
        assert response_result["session_id"] == session_id
        assert response_result["action"] == "response_evaluated"
        assert "evaluation" in response_result
        assert "next_question" in response_result
        
        print(f"✅ OrchestratorAgent 回答评估测试通过")
        print(f"   评估分数: {response_result['evaluation']['score']}")
        print(f"   下一个问题: {response_result['next_question']}")
        
        # 测试结束面试
        end_result = await self.orchestrator.coordinate_interview(session_id, "end_interview")
        
        assert end_result["session_id"] == session_id
        assert end_result["action"] == "interview_ended"
        assert "final_score" in end_result
        
        print(f"✅ OrchestratorAgent 结束面试测试通过")
        print(f"   最终分数: {end_result['final_score']}")
        
        return {
            "start": start_result,
            "response": response_result,
            "end": end_result
        }
    
    async def test_full_interview_flow(self):
        """测试完整面试流程"""
        print("\n🎯 测试完整面试流程...")
        
        session_id = "full-test-session"
        
        # 1. 开始面试
        print("1️⃣ 开始面试...")
        start_result = await self.orchestrator.coordinate_interview(session_id, "start_interview")
        
        # 2. 模拟多个问答回合
        responses = [
            "我是一名全栈开发者，有5年经验，主要使用React和Node.js...",
            "在一个电商项目中，我遇到了高并发问题，通过Redis缓存和数据库优化解决了...",
            "我通过阅读官方文档、实践项目和参与开源社区来学习新技术..."
        ]
        
        for i, response in enumerate(responses, 1):
            print(f"{i+1}️⃣ 第{i}轮问答...")
            result = await self.orchestrator.coordinate_interview(session_id, "submit_response", {"response": response})
            print(f"   评分: {result['evaluation']['score']}/100")
            print(f"   问题: {result['next_question']}")
        
        # 3. 结束面试
        print("5️⃣ 结束面试...")
        end_result = await self.orchestrator.coordinate_interview(session_id, "end_interview")
        
        print(f"✅ 完整面试流程测试通过")
        print(f"   最终分数: {end_result['final_score']:.1f}/100")
        print(f"   总问题数: {end_result['total_questions']}")
        print(f"   回答数: {end_result['responses_count']}")
        
        return {
            "start": start_result,
            "end": end_result
        }
    
    async def run_all_tests(self):
        """运行所有测试"""
        print("🚀 开始运行Agent系统测试...\n")
        
        try:
            # 测试各个代理
            await self.test_interviewer_agent()
            await self.test_topic_manager_agent()
            await self.test_evaluator_agent()
            await self.test_orchestrator_agent()
            
            # 测试完整流程
            await self.test_full_interview_flow()
            
            print("\n🎉 所有测试通过！Agent系统运行正常。")
            
        except Exception as e:
            print(f"\n❌ 测试失败: {str(e)}")
            raise

async def main():
    """主函数"""
    tester = TestAgentSystem()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
