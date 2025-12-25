# GitHub + Vercel 部署检查清单

## ✅ 部署前检查

### 1. 代码准备
- [x] 环境变量已配置（`.env.local` 已创建）
- [x] `.gitignore` 已配置（确保 `.env.local` 不会被提交）
- [x] `vercel.json` 配置文件已创建
- [x] `README.md` 已更新
- [x] 项目可以正常构建（`npm run build` 成功）

### 2. Git 仓库初始化

如果还没有初始化 Git，执行以下命令：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 检查要提交的文件（确保 .env.local 不在列表中）
git status

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "Initial commit: 航空问答小助手"

# 5. 在 GitHub 上创建新仓库（通过网页或 GitHub CLI）
# 网页方式：访问 https://github.com/new
# 或使用 GitHub CLI：
# gh repo create 航空问答小助手 --public

# 6. 添加远程仓库并推送
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 3. Vercel 部署步骤

#### 步骤 1：登录 Vercel
- [ ] 访问 https://vercel.com
- [ ] 使用 GitHub 账号登录

#### 步骤 2：导入项目
- [ ] 点击 "Add New..." → "Project"
- [ ] 选择你的 GitHub 仓库
- [ ] 点击 "Import"

#### 步骤 3：配置项目
- [ ] Framework Preset: `Vite`（自动检测）
- [ ] Build Command: `npm run build`（自动填充）
- [ ] Output Directory: `dist`（自动填充）
- [ ] Root Directory: `./`

#### 步骤 4：配置环境变量（⚠️ 重要！）
- [ ] 在 "Environment Variables" 部分点击 "Add"
- [ ] 添加变量：
  - **Name**: `VITE_DEEPSEEK_API_KEY`
  - **Value**: `sk-fe6c23670a3b4f479e53bad409020c88`
  - **Environment**: 选择所有环境（Production, Preview, Development）
- [ ] 点击 "Save"

#### 步骤 5：部署
- [ ] 点击 "Deploy" 按钮
- [ ] 等待构建完成（1-2 分钟）
- [ ] 检查部署是否成功

#### 步骤 6：验证部署
- [ ] 访问 Vercel 提供的预览 URL
- [ ] 测试聊天功能是否正常
- [ ] 检查浏览器控制台是否有错误
- [ ] 测试移动端显示

### 4. 自定义域名（可选）

- [ ] 在项目设置中进入 "Domains" 页面
- [ ] 添加你的域名
- [ ] 配置 DNS 记录（CNAME）
- [ ] 等待 DNS 生效
- [ ] 验证 HTTPS 证书已自动配置

## 🎉 部署完成后的操作

1. **保存部署 URL**：记录 Vercel 提供的部署地址
2. **测试功能**：全面测试应用的各项功能
3. **监控使用**：在 DeepSeek 控制台监控 API 使用情况
4. **更新文档**：如果需要，更新项目文档中的部署地址

## 🔄 后续更新

每次推送代码到 GitHub 的 `main` 分支，Vercel 会自动：
- ✅ 检测代码变更
- ✅ 自动触发新的部署
- ✅ 更新生产环境

## 📝 注意事项

1. **环境变量安全**：
   - ✅ `.env.local` 已在 `.gitignore` 中，不会被提交
   - ✅ API Key 通过 Vercel 环境变量配置，不会暴露在代码中

2. **自动部署**：
   - Vercel 会自动监听 GitHub 推送
   - 每个 Pull Request 会创建预览环境

3. **构建优化**：
   - Vercel 会自动缓存 `node_modules`
   - 构建时间通常在 1-2 分钟

## 🐛 遇到问题？

查看 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) 中的"常见问题"部分。

