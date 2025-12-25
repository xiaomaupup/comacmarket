# 航空问答小助手

一个基于 Vue 3 + Vite + DeepSeek API 的智能航空问答助手，提供专业的航空知识解答。

## ✨ 功能特点

- 🤖 基于 DeepSeek AI 的智能问答
- ✈️ 专业的航空知识库
- 💬 流畅的对话体验
- 📱 响应式设计，支持移动端
- 🎨 现代化的 UI 设计
- 📝 Markdown 格式支持

## 🚀 快速开始

### 本地开发

**前置要求：** Node.js 16+ 

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量：
   ```bash
   cp .env.example .env.local
   ```
   然后编辑 `.env.local`，填入你的 DeepSeek API Key：
   ```
   VITE_DEEPSEEK_API_KEY=your_api_key_here
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

构建文件将生成在 `dist/` 目录。

## 📦 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量 `VITE_DEEPSEEK_API_KEY`
4. 点击部署

详细步骤请查看 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

### 其他部署方式

- 阿里云 OSS + CDN：查看 [DEPLOY.md](./DEPLOY.md)
- 其他静态托管服务：查看 [QUICK_START.md](./QUICK_START.md)

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **Markdown 渲染**: marked
- **图标**: lucide-vue-next
- **AI API**: DeepSeek

## 📝 项目结构

```
├── components/          # Vue 组件
│   ├── ChatInput.vue   # 聊天输入框
│   ├── ChatMessage.vue # 聊天消息（支持 Markdown）
│   └── Header.vue      # 页面头部
├── services/           # 服务层
│   └── deepseekService.ts  # DeepSeek API 服务
├── constants.ts        # 常量配置
├── types.ts           # TypeScript 类型定义
└── App.vue            # 主应用组件
```

## 🔒 安全提示

⚠️ **重要**：API Key 会暴露在前端代码中。建议：
- 使用环境变量管理 API Key
- 定期更换 API Key
- 在 DeepSeek 控制台设置使用限制
- 生产环境考虑使用后端代理（见 [DEPLOY.md](./DEPLOY.md)）

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
