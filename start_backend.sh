#!/bin/bash

# 启动后端服务脚本
echo "启动AI面试系统后端服务..."

# 激活虚拟环境
source backend_venv/bin/activate

# 进入后端目录
cd backend

# 设置Python路径
export PYTHONPATH=$(pwd):$PYTHONPATH

# 启动服务
python main.py