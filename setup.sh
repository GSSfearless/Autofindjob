#!/bin/bash

# AI面试系统初始化脚本

echo "🔧 初始化AI面试系统..."

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装Python 3.8+"
    exit 1
fi

# 检查Node.js环境
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm 未安装，请先安装Node.js"
    exit 1
fi

# 创建Python虚拟环境
echo "🐍 创建Python虚拟环境..."
python3 -m venv backend_venv
source backend_venv/bin/activate

# 安装后端依赖
echo "📦 安装后端依赖..."
pip install --upgrade pip
pip install -r backend/requirements.txt

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install

# 创建上传目录
mkdir -p backend/uploads

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: .env文件不存在，请确保配置了必要的API密钥"
else
    echo "✅ 检测到.env文件"
fi

echo ""
echo "✅ 系统初始化完成！"
echo ""
echo "🚀 使用以下命令启动系统："
echo "   chmod +x start_system.sh"
echo "   ./start_system.sh"
echo ""
echo "📋 系统要求："
echo "   - Python 3.8+"
echo "   - Node.js 16+"
echo "   - 配置.env文件中的API密钥"