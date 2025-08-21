from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio
from typing import Dict, List, Any
import uuid
from datetime import datetime
import time

# Mock Agent System
class MockInterviewerAgent:
    def __init__(self):
        self.name = "InterviewerAgent"
        self.role = "生成面试问题"
    
    async def generate_question(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """模拟生成面试问题"""
        await asyncio.sleep(0.5)  # 模拟AI处理时间
        
        questions = [
            "请介绍一下您的技术背景和经验？",
            "您如何处理项目中的技术挑战？",
            "请描述一个您解决过的复杂技术问题？",
            "您如何看待新技术的学习和应用？",
            "在团队协作中，您通常扮演什么角色？"
        ]
        
        return {
            "agent": self.name,
            "action": "generate_question",
            "question": questions[context.get("question_count", 0) % len(questions)],
            "context": context,
            "timestamp": datetime.now().isoformat()
        }

class MockTopicManagerAgent:
    def __init__(self):
        self.name = "TopicManagerAgent"
        self.role = "管理话题流转"
        self.topics = ["技术背景", "项目经验", "问题解决", "学习能力", "团队协作"]
    
    async def manage_topic_flow(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """模拟话题管理"""
        await asyncio.sleep(0.3)
        
        current_topic_index = context.get("topic_index", 0)
        next_topic = self.topics[current_topic_index % len(self.topics)]
        
        return {
            "agent": self.name,
            "action": "manage_topic_flow",
            "current_topic": next_topic,
            "topic_index": current_topic_index,
            "should_transition": current_topic_index > 0 and current_topic_index % 2 == 0,
            "context": context,
            "timestamp": datetime.now().isoformat()
        }

class MockEvaluatorAgent:
    def __init__(self):
        self.name = "EvaluatorAgent"
        self.role = "评估候选人回答"
    
    async def evaluate_response(self, response: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """模拟回答评估"""
        await asyncio.sleep(0.4)
        
        # 模拟评估逻辑
        score = min(100, len(response) * 2 + 60)  # 简单的评分逻辑
        feedback = "回答详细，展现了良好的技术理解能力" if score > 80 else "回答需要更多具体的技术细节"
        
        return {
            "agent": self.name,
            "action": "evaluate_response",
            "score": score,
            "feedback": feedback,
            "response_length": len(response),
            "context": context,
            "timestamp": datetime.now().isoformat()
        }

class MockOrchestratorAgent:
    def __init__(self):
        self.name = "OrchestratorAgent"
        self.role = "协调所有代理"
        self.interviewer = MockInterviewerAgent()
        self.topic_manager = MockTopicManagerAgent()
        self.evaluator = MockEvaluatorAgent()
        self.session_data = {}
    
    async def coordinate_interview(self, session_id: str, action: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """协调面试流程"""
        if session_id not in self.session_data:
            self.session_data[session_id] = {
                "question_count": 0,
                "topic_index": 0,
                "responses": [],
                "scores": []
            }
        
        session = self.session_data[session_id]
        
        if action == "start_interview":
            # 开始面试
            question_result = await self.interviewer.generate_question(session)
            topic_result = await self.topic_manager.manage_topic_flow(session)
            
            return {
                "session_id": session_id,
                "orchestrator": self.name,
                "action": "interview_started",
                "question": question_result["question"],
                "topic": topic_result["current_topic"],
                "agents_used": [self.interviewer.name, self.topic_manager.name],
                "timestamp": datetime.now().isoformat()
            }
        
        elif action == "submit_response":
            # 提交回答
            response = data.get("response", "")
            session["responses"].append(response)
            
            # 评估回答
            evaluation = await self.evaluator.evaluate_response(response, session)
            session["scores"].append(evaluation["score"])
            
            # 生成下一个问题
            session["question_count"] += 1
            next_question = await self.interviewer.generate_question(session)
            
            # 管理话题流转
            topic_management = await self.topic_manager.manage_topic_flow(session)
            session["topic_index"] = topic_management["topic_index"]
            
            return {
                "session_id": session_id,
                "orchestrator": self.name,
                "action": "response_evaluated",
                "evaluation": evaluation,
                "next_question": next_question["question"],
                "topic": topic_management["current_topic"],
                "agents_used": [self.evaluator.name, self.interviewer.name, self.topic_manager.name],
                "timestamp": datetime.now().isoformat()
            }
        
        elif action == "end_interview":
            # 结束面试
            avg_score = sum(session["scores"]) / len(session["scores"]) if session["scores"] else 0
            
            return {
                "session_id": session_id,
                "orchestrator": self.name,
                "action": "interview_ended",
                "final_score": avg_score,
                "total_questions": session["question_count"],
                "responses_count": len(session["responses"]),
                "timestamp": datetime.now().isoformat()
            }

# 全局协调器实例
orchestrator = MockOrchestratorAgent()

# FastAPI应用
app = FastAPI(title="AI Interview System", version="1.0.0")

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Interview System API", "status": "running"}

@app.get("/api/agents/info")
async def get_agents_info():
    """获取所有代理信息"""
    return {
        "agents": [
            {
                "name": orchestrator.interviewer.name,
                "role": orchestrator.interviewer.role,
                "status": "active"
            },
            {
                "name": orchestrator.topic_manager.name,
                "role": orchestrator.topic_manager.role,
                "status": "active"
            },
            {
                "name": orchestrator.evaluator.name,
                "role": orchestrator.evaluator.role,
                "status": "active"
            },
            {
                "name": orchestrator.name,
                "role": orchestrator.role,
                "status": "active"
            }
        ]
    }

@app.post("/api/interview/start")
async def start_interview():
    """开始面试"""
    session_id = str(uuid.uuid4())
    result = await orchestrator.coordinate_interview(session_id, "start_interview")
    return result

@app.post("/api/interview/response")
async def submit_response(session_id: str, response: str):
    """提交回答"""
    result = await orchestrator.coordinate_interview(session_id, "submit_response", {"response": response})
    return result

@app.post("/api/interview/end")
async def end_interview(session_id: str):
    """结束面试"""
    result = await orchestrator.coordinate_interview(session_id, "end_interview")
    return result

@app.get("/api/interview/stream/{session_id}")
async def stream_interview(session_id: str):
    """流式面试接口 - 用于实时演示"""
    async def generate_stream():
        # 开始面试
        start_result = await orchestrator.coordinate_interview(session_id, "start_interview")
        yield f"data: {json.dumps(start_result, ensure_ascii=False)}\n\n"
        
        # 模拟面试流程
        for i in range(3):
            await asyncio.sleep(2)  # 等待用户回答
            
            # 模拟用户回答
            mock_response = f"这是第{i+1}个问题的回答，我详细说明了我的技术经验和解决方案..."
            
            # 提交回答
            response_result = await orchestrator.coordinate_interview(session_id, "submit_response", {"response": mock_response})
            yield f"data: {json.dumps(response_result, ensure_ascii=False)}\n\n"
        
        # 结束面试
        await asyncio.sleep(1)
        end_result = await orchestrator.coordinate_interview(session_id, "end_interview")
        yield f"data: {json.dumps(end_result, ensure_ascii=False)}\n\n"
    
    return StreamingResponse(generate_stream(), media_type="text/plain")

@app.post("/api/upload/resume")
async def upload_resume(file: UploadFile = File(...)):
    """上传简历"""
    return {
        "message": "简历上传成功",
        "filename": file.filename,
        "size": len(await file.read()),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/upload/job-description")
async def upload_job_description(file: UploadFile = File(...)):
    """上传职位描述"""
    return {
        "message": "职位描述上传成功",
        "filename": file.filename,
        "size": len(await file.read()),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
