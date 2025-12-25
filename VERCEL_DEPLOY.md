# Vercel 部署指南

## 📋 部署前准备

### 1. 确保代码已推送到 GitHub

如果还没有初始化 Git 仓库，请执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件（.gitignore 会自动排除敏感文件）
git add .

# 提交代码
git commit -m "Initial commit: 航空问答小助手"

# 在 GitHub 上创建新仓库，然后添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送代码
git branch -M main
git push -u origin main
```

### 2. 检查敏感文件

确保以下文件不会被提交到 Git（已在 `.gitignore` 中）：
- `.env.local` ✅
- `.env` ✅
- `dist/` ✅
- `node_modules/` ✅

## 🚀 Vercel 部署步骤

### 步骤 1：登录 Vercel

1. 访问 [Vercel 官网](https://vercel.com)
2. 使用 GitHub 账号登录（推荐）

### 步骤 2：导入项目

1. 在 Vercel 控制台，点击 **"Add New..."** → **"Project"**
2. 选择 **"Import Git Repository"**
3. 选择你的 GitHub 仓库
4. 点击 **"Import"**

### 步骤 3：配置项目

Vercel 会自动检测到这是一个 Vite 项目，配置如下：

**Framework Preset**: `Vite`（自动检测）

**Build Settings**:
- **Build Command**: `npm run build`（自动填充）
- **Output Directory**: `dist`（自动填充）
- **Install Command**: `npm install`（自动填充）

**Root Directory**: `./`（如果项目在仓库根目录）

### 步骤 4：配置环境变量（重要！）

在部署前，必须配置环境变量：

1. 在项目配置页面，找到 **"Environment Variables"** 部分
2. 点击 **"Add"** 添加环境变量
3. 添加以下变量：

   **变量名**: `VITE_DEEPSEEK_API_KEY`
   
   **变量值**: `sk-fe6c23670a3b4f479e53bad409020c88`（你的 API Key）
   
   **环境**: 选择所有环境（Production, Preview, Development）

4. 点击 **"Save"**

⚠️ **重要**：环境变量配置后，Vercel 会在下次部署时自动使用这些变量。

### 步骤 5：部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（通常 1-2 分钟）
3. 部署成功后，Vercel 会提供一个预览 URL（如：`your-project.vercel.app`）

### 步骤 6：配置自定义域名（可选）

如果你有域名，可以：

1. 在项目设置中，进入 **"Domains"** 页面
2. 添加你的域名（如：`www.yourdomain.com`）
3. 按照提示配置 DNS 记录：
   - 添加 CNAME 记录
   - 主机记录：`www`（或 `@` 表示根域名）
   - 记录值：Vercel 提供的 CNAME 地址
4. 等待 DNS 生效（通常几分钟到几小时）
5. Vercel 会自动配置 HTTPS 证书

## 🔄 自动部署

Vercel 会自动：
- ✅ 监听 GitHub 仓库的推送
- ✅ 自动触发新的部署
- ✅ 为每个 Pull Request 创建预览环境
- ✅ 自动配置 HTTPS

## 📝 部署后验证

1. **访问部署的网站**，检查是否正常加载
2. **测试聊天功能**，确保 API 调用正常
3. **检查浏览器控制台**，确保没有错误
4. **测试移动端**，确保响应式设计正常

## 🐛 常见问题

### 1. 构建失败：找不到环境变量

**原因**：环境变量未配置或配置错误

**解决**：
- 检查 Vercel 项目设置中的环境变量
- 确保变量名是 `VITE_DEEPSEEK_API_KEY`（注意 `VITE_` 前缀）
- 重新部署项目

### 2. API 调用失败

**原因**：可能是 CORS 问题或 API Key 错误

**解决**：
- 检查环境变量是否正确配置
- 检查 DeepSeek API 是否支持从你的域名调用
- 查看浏览器控制台的错误信息

### 3. 页面刷新 404

**原因**：Vercel 需要配置重写规则

**解决**：创建 `vercel.json` 文件（见下方）

### 4. 部署后样式丢失

**原因**：可能是路径配置问题

**解决**：检查 `vite.config.ts` 中的 `base` 配置，确保是 `/`

## 📄 vercel.json 配置（可选）

如果需要自定义配置，可以创建 `vercel.json` 文件：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

这个配置会确保所有路由都指向 `index.html`，适合 Vue Router 的 history 模式。

## 🔒 安全建议

1. **不要将 API Key 提交到 Git**：确保 `.env.local` 在 `.gitignore` 中
2. **使用环境变量**：在 Vercel 中配置环境变量，而不是硬编码
3. **定期更换 API Key**：如果 API Key 泄露，及时更换
4. **监控 API 使用**：在 DeepSeek 控制台监控 API 使用情况

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [环境变量配置](https://vercel.com/docs/concepts/projects/environment-variables)

