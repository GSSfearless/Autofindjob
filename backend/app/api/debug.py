from fastapi import APIRouter
from ..core.siliconflow import siliconflow_client
import structlog

logger = structlog.get_logger()
router = APIRouter(prefix="/api/debug", tags=["debug"])

@router.get("/test-api")
async def test_siliconflow_api():
    """测试SiliconFlow API连接"""
    try:
        result = await siliconflow_client.chat_completion([
            {'role': 'user', 'content': '你好，这是一个测试'}
        ])
        return {
            "success": True,
            "result": result,
            "message": "API调用成功"
        }
    except Exception as e:
        logger.error("调试API测试失败", error=str(e))
        return {
            "success": False,
            "error": str(e),
            "message": "API调用失败"
        }

@router.post("/test-resume-analysis")
async def test_resume_analysis():
    """测试简历分析"""
    try:
        result = await siliconflow_client.analyze_resume("这是一个测试简历内容")
        return {
            "success": True,
            "result": result,
            "message": "简历分析成功"
        }
    except Exception as e:
        logger.error("简历分析测试失败", error=str(e))
        return {
            "success": False,
            "error": str(e),
            "message": "简历分析失败"
        }