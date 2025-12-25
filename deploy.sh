#!/bin/bash

# 部署脚本 - 用于构建和准备部署文件

echo "🚀 开始构建项目..."

# 检查环境变量
if [ -z "$VITE_DEEPSEEK_API_KEY" ]; then
    echo "⚠️  警告: 未设置 VITE_DEEPSEEK_API_KEY 环境变量"
    echo "   如果 .env.local 文件存在，Vite 会自动读取"
    echo ""
fi

# 构建项目
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "📦 构建文件位于 dist/ 目录"
    echo ""
    echo "📋 下一步："
    echo "   1. 将 dist/ 目录中的所有文件上传到你的服务器或 OSS"
    echo "   2. 配置域名解析"
    echo "   3. 配置 HTTPS"
    echo ""
    echo "📖 详细部署步骤请查看 DEPLOY.md 文件"
else
    echo ""
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

