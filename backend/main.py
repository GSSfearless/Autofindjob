from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
import uvicorn

from app.core.config import settings
from app.api.upload import router as upload_router
from app.api.interview import router as interview_router
from app.api.debug import router as debug_router

# 配置结构化日志
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="ISO"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(ensure_ascii=False)
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# 创建FastAPI应用
app = FastAPI(
    title="AI面试系统 Backend",
    description="基于多智能体架构的AI驱动面试系统后端API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(upload_router)
app.include_router(interview_router)
app.include_router(debug_router)

@app.on_event("startup")
async def startup_event():
    """应用启动事件"""
    logger.info("AI面试系统后端启动", 
                siliconflow_model=settings.SILICONFLOW_MODEL,
                cors_origins=settings.CORS_ORIGINS)

@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    logger.info("AI面试系统后端关闭")

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "AI面试系统 Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "message": "AI面试系统后端运行正常",
        "version": "1.0.0"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """全局异常处理"""
    logger.error("未处理的异常", 
                url=str(request.url), 
                method=request.method,
                error=str(exc))
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "内部服务器错误",
            "detail": str(exc) if settings.DEBUG else "请联系系统管理员"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="info"
    )