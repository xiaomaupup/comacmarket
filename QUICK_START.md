# 🚀 快速部署指南

## 第一步：配置环境变量

1. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local`，填入你的 DeepSeek API Key：
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-api-key-here
   ```

## 第二步：构建项目

```bash
npm install
npm run build
```

构建完成后，`dist/` 文件夹就是需要部署的文件。

## 第三步：选择部署方案

### 方案 A：阿里云 OSS + CDN（推荐，最简单）

**优点**：成本低、配置简单、自动 CDN 加速

**步骤**：
1. 登录阿里云控制台 → 对象存储 OSS
2. 创建存储桶（Bucket），设置**公共读**权限
3. 上传 `dist/` 文件夹中的所有文件到存储桶根目录
4. 开启**静态网站托管**，设置默认首页为 `index.html`
5. 配置 CDN（可选但推荐）：
   - 添加加速域名（你的域名）
   - 源站选择 OSS 域名
6. 在**云解析 DNS** 中添加 CNAME 记录，指向 CDN 地址
7. 在 CDN 控制台配置 HTTPS（使用免费证书）

**详细步骤**：查看 `DEPLOY.md` 文件

### 方案 B：阿里云 ECS 服务器

**优点**：完全控制、可扩展

**步骤**：
1. 购买 ECS 服务器（最低 1核2G）
2. 安装 Nginx：
   ```bash
   sudo apt update && sudo apt install nginx -y
   ```
3. 上传文件到服务器：
   ```bash
   scp -r dist/* root@your-server-ip:/var/www/html/
   ```
4. 配置 Nginx（见 `DEPLOY.md`）
5. 配置域名解析和 SSL 证书

## 第四步：验证部署

1. 访问你的域名，检查网站是否正常加载
2. 打开浏览器开发者工具（F12），检查：
   - 控制台是否有错误
   - Network 标签中 API 请求是否成功
3. 测试聊天功能是否正常

## ⚠️ 重要提示

1. **API Key 安全**：当前方案中，API Key 会暴露在前端代码中。如果需要更高安全性，请使用后端代理方案（见 `DEPLOY.md`）。

2. **HTTPS 必须**：生产环境必须配置 HTTPS，否则浏览器可能阻止某些功能。

3. **域名解析**：DNS 解析可能需要几分钟到几小时才能生效，请耐心等待。

## 📚 更多信息

- 详细部署步骤：查看 `DEPLOY.md`
- 遇到问题：查看 `DEPLOY.md` 中的"常见问题"部分

