#!/bin/bash

# AI面试系统启动脚本

echo "🚀 启动AI面试系统..."

# 检查后端虚拟环境
if [ ! -d "backend_venv" ]; then
    echo "❌ 后端虚拟环境不存在，请先运行setup.sh"
    exit 1
fi

# 启动后端服务
echo "📡 启动后端API服务 (端口 8000)..."
source backend_venv/bin/activate
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 5

# 检查后端是否启动成功
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ 后端服务启动成功"

# 启动前端服务
echo "🖥️  启动前端开发服务 (端口 8080)..."
npm run dev &
FRONTEND_PID=$!

echo "✅ 系统启动完成！"
echo ""
echo "🌐 访问地址："
echo "   前端界面: http://localhost:8080"
echo "   后端API:  http://localhost:8000"
echo "   API文档:  http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 设置信号处理，确保停止时清理进程
cleanup() {
    echo ""
    echo "🛑 停止所有服务..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 等待用户中断
wait