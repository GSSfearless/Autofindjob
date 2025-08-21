from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from typing import Dict, Any, List
import json
import asyncio
import structlog

from ..models.schemas import (
    StartInterviewRequest, 
    SubmitAnswerRequest,
    QuestionGenerationRequest,
    WebSocketMessage
)
from ..agents.orchestrator_agent import orchestrator

logger = structlog.get_logger()
router = APIRouter(prefix="/api/interview", tags=["interview"])

# WebSocket连接管理
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        logger.info(f"WebSocket连接建立", session_id=session_id)
    
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            logger.info(f"WebSocket连接断开", session_id=session_id)
    
    async def send_message(self, session_id: str, message: Dict[str, Any]):
        if session_id in self.active_connections:
            try:
                await self.active_connections[session_id].send_text(json.dumps(message, ensure_ascii=False))
            except Exception as e:
                logger.error(f"发送WebSocket消息失败", session_id=session_id, error=str(e))
                self.disconnect(session_id)

manager = ConnectionManager()

@router.post("/create-session")
async def create_interview_session(request: QuestionGenerationRequest):
    """创建面试会话"""
    try:
        logger.info("创建面试会话请求")
        
        result = await orchestrator.process({
            "action": "create_session",
            "resume_analysis": request.resume_analysis or {},
            "job_analysis": request.job_analysis or {},
            "question_count": request.question_count
        })
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "创建会话失败"))
        
        session_data = result.get("session")
        logger.info(f"面试会话创建成功", session_id=session_data.get("id"))
        
        return {
            "success": True,
            "message": "面试会话创建成功",
            "data": session_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("创建面试会话失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"创建会话失败: {str(e)}")

@router.post("/start")
async def start_interview(request: StartInterviewRequest):
    """开始面试"""
    try:
        logger.info(f"开始面试请求", session_id=request.session_id)
        
        result = await orchestrator.process({
            "action": "start_interview",
            "session_id": request.session_id
        })
        
        if not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error", "开始面试失败"))
        
        # 发送WebSocket消息
        await manager.send_message(request.session_id, {
            "type": "interview_started",
            "data": result,
            "session_id": request.session_id
        })
        
        return {
            "success": True,
            "message": "面试已开始",
            "data": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("开始面试失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"开始面试失败: {str(e)}")

@router.post("/submit-answer")
async def submit_answer(request: SubmitAnswerRequest):
    """提交答案"""
    try:
        logger.info(f"提交答案", session_id=request.session_id, question_id=request.question_id)
        
        # 提交答案并获取评估
        eval_result = await orchestrator.process({
            "action": "submit_answer",
            "session_id": request.session_id,
            "answer": {
                "question_id": request.question_id,
                "answer_text": request.answer_text,
                "answer_audio": request.answer_audio
            }
        })
        
        # 发送评估结果
        if eval_result.get("success"):
            await manager.send_message(request.session_id, {
                "type": "evaluation",
                "data": eval_result.get("evaluation"),
                "session_id": request.session_id
            })
        
        return {
            "success": eval_result.get("success", False),
            "message": "答案已提交" if eval_result.get("success") else "答案提交失败",
            "data": eval_result
        }
        
    except Exception as e:
        logger.error("提交答案失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"提交答案失败: {str(e)}")

@router.post("/next-question")
async def get_next_question(request: StartInterviewRequest):
    """获取下一个问题"""
    try:
        logger.info(f"获取下一问题", session_id=request.session_id)
        
        result = await orchestrator.process({
            "action": "get_next_question",
            "session_id": request.session_id
        })
        
        # 发送WebSocket消息
        await manager.send_message(request.session_id, {
            "type": "next_question" if result.get("success") else "interview_complete",
            "data": result,
            "session_id": request.session_id
        })
        
        return {
            "success": result.get("success", False),
            "message": "获取下一问题成功" if result.get("success") else "面试已完成",
            "data": result
        }
        
    except Exception as e:
        logger.error("获取下一问题失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"获取下一问题失败: {str(e)}")

@router.post("/finish")
async def finish_interview(request: StartInterviewRequest):
    """完成面试"""
    try:
        logger.info(f"完成面试", session_id=request.session_id)
        
        result = await orchestrator.process({
            "action": "finish_interview",
            "session_id": request.session_id
        })
        
        # 发送完成消息
        await manager.send_message(request.session_id, {
            "type": "interview_finished",
            "data": result,
            "session_id": request.session_id
        })
        
        return {
            "success": result.get("success", False),
            "message": "面试已完成",
            "data": result
        }
        
    except Exception as e:
        logger.error("完成面试失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"完成面试失败: {str(e)}")

@router.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """获取会话信息"""
    try:
        result = await orchestrator.get_session_status(session_id)
        
        if not result.get("success"):
            raise HTTPException(status_code=404, detail="会话不存在")
        
        return {
            "success": True,
            "data": result.get("session")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("获取会话信息失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"获取会话失败: {str(e)}")

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket连接端点"""
    await manager.connect(websocket, session_id)
    try:
        while True:
            # 保持连接活跃
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # 处理心跳消息
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            
            # 可以在这里添加更多的实时消息处理逻辑
            
    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        logger.error("WebSocket错误", session_id=session_id, error=str(e))
        manager.disconnect(session_id)

@router.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "service": "interview"}