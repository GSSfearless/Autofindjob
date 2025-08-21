from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any
import structlog

from ..models.schemas import UploadRequest
from ..services.file_service import file_service
from ..core.siliconflow import siliconflow_client

logger = structlog.get_logger()
router = APIRouter(prefix="/api/upload", tags=["upload"])

@router.post("/resume")
async def upload_resume_and_jd(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """上传简历文件和职位描述"""
    try:
        logger.info(f"收到文件上传请求", filename=resume_file.filename, jd_length=len(job_description))
        
        # 验证文件
        file_content = await resume_file.read()
        validation_result = file_service.validate_file(resume_file.filename, len(file_content))
        
        if not validation_result["valid"]:
            raise HTTPException(
                status_code=400, 
                detail=f"文件验证失败: {'; '.join(validation_result['errors'])}"
            )
        
        # 保存文件
        file_path = await file_service.save_uploaded_file(file_content, resume_file.filename)
        
        # 提取简历文本
        resume_text = file_service.extract_text_from_file(file_path)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="无法从简历文件中提取文本内容")
        
        # 并行分析简历和职位描述
        import asyncio
        
        resume_analysis_task = siliconflow_client.analyze_resume(resume_text)
        jd_analysis_task = siliconflow_client.analyze_job_description(job_description)
        
        resume_analysis, jd_analysis = await asyncio.gather(
            resume_analysis_task,
            jd_analysis_task,
            return_exceptions=True
        )
        
        # 检查分析结果
        if isinstance(resume_analysis, Exception):
            logger.error("简历分析失败", error=str(resume_analysis))
            resume_analysis = {"error": str(resume_analysis)}
        
        if isinstance(jd_analysis, Exception):
            logger.error("职位描述分析失败", error=str(jd_analysis))
            jd_analysis = {"error": str(jd_analysis)}
        
        # 清理临时文件
        await file_service.cleanup_file(file_path)
        
        logger.info("文件处理完成", resume_length=len(resume_text))
        
        return {
            "success": True,
            "message": "文件上传和分析成功",
            "data": {
                "resume_text": resume_text[:1000] + "..." if len(resume_text) > 1000 else resume_text,  # 限制返回长度
                "resume_analysis": resume_analysis,
                "job_analysis": jd_analysis,
                "filename": resume_file.filename
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("文件上传处理失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")

@router.post("/analyze-text")
async def analyze_text_only(request: UploadRequest):
    """仅分析文本内容（无文件上传）"""
    try:
        # 分析职位描述
        jd_analysis = await siliconflow_client.analyze_job_description(request.job_description)
        
        return {
            "success": True,
            "message": "文本分析成功",
            "data": {
                "job_analysis": jd_analysis
            }
        }
        
    except Exception as e:
        logger.error("文本分析失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")

@router.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "service": "upload"}