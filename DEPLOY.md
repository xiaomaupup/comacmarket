# 部署指南 - 阿里云部署

## 📋 部署前准备

### 1. 配置环境变量（重要！）

⚠️ **安全警告**：API Key 需要配置，否则应用无法正常工作。

**步骤：**
1. 复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的 DeepSeek API Key：
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   ```

3. 注意：`.env.local` 文件已经在 `.gitignore` 中，不会被提交到 Git。

⚠️ **重要提示**：即使使用环境变量，前端代码中的 API Key 仍然会被暴露在浏览器中。这是前端应用的限制。如果需要更高的安全性，请使用后端代理方案（见下方）。

### 2. 项目构建

构建生产版本：

```bash
# 安装依赖（如果还没安装）
npm install

# 构建生产版本
npm run build
# 或者使用部署脚本
./deploy.sh
```

构建完成后，会在项目根目录生成 `dist` 文件夹，这就是需要部署的静态文件。

### 3. 验证构建结果

构建完成后，可以本地预览：
```bash
npm run preview
```

访问 `http://localhost:4173` 检查应用是否正常。

## 🚀 阿里云部署方案

### 方案一：阿里云 OSS + CDN（推荐，成本低）

#### 步骤 1：创建 OSS 存储桶
1. 登录阿里云控制台
2. 进入 **对象存储 OSS** 服务
3. 创建存储桶（Bucket）
   - 区域：选择离用户最近的区域（如：华东1-杭州）
   - 读写权限：**公共读**（必须，否则无法访问）
   - 存储类型：标准存储

#### 步骤 2：上传文件
1. 进入创建的存储桶
2. 点击 **文件管理** > **上传文件**
3. 将 `dist` 文件夹中的所有文件上传到存储桶根目录
4. 确保 `index.html` 在根目录

#### 步骤 3：开启静态网站托管
1. 在存储桶中，点击 **基础设置** > **静态网站托管**
2. 开启静态网站托管
3. 设置：
   - 默认首页：`index.html`
   - 默认 404 页：`index.html`（用于 Vue Router 的 history 模式）

#### 步骤 4：配置 CDN（可选但推荐）
1. 进入 **CDN** 服务
2. 添加加速域名
   - 加速域名：填写你购买的域名（如：`www.yourdomain.com`）
   - 源站信息：选择 OSS 域名
   - 加速区域：根据用户分布选择
3. 配置完成后，等待 CDN 生效（通常几分钟到几小时）

#### 步骤 5：域名解析
1. 进入 **云解析 DNS** 服务
2. 找到你的域名，点击 **解析设置**
3. 添加解析记录：
   - 记录类型：`CNAME`
   - 主机记录：`www`（或 `@` 表示根域名）
   - 记录值：CDN 提供的 CNAME 地址（如果使用 CDN）
   - 或直接指向 OSS 的访问域名（如果不使用 CDN）

#### 步骤 6：HTTPS 配置（必须）
1. 在 CDN 控制台，找到你的域名
2. 点击 **HTTPS配置**
3. 开启 HTTPS，选择：
   - **免费证书**：阿里云提供免费 SSL 证书
   - 或上传自己的证书
4. 开启 **强制跳转 HTTPS**

### 方案二：阿里云 ECS 服务器部署

#### 步骤 1：购买 ECS 服务器
1. 选择配置（建议最低 1核2G）
2. 选择操作系统：Ubuntu 20.04 或 CentOS 7
3. 配置安全组：开放 80 和 443 端口

#### 步骤 2：服务器环境配置
```bash
# 连接服务器后，安装 Nginx
# Ubuntu/Debian:
sudo apt update
sudo apt install nginx -y

# CentOS:
sudo yum install nginx -y
```

#### 步骤 3：上传文件
```bash
# 方式1：使用 scp 命令（在本地执行）
scp -r dist/* root@your-server-ip:/var/www/html/

# 方式2：使用 Git（如果项目在 Git 仓库）
# 在服务器上克隆项目，然后构建
```

#### 步骤 4：配置 Nginx
编辑 Nginx 配置文件：
```bash
sudo nano /etc/nginx/sites-available/default
```

配置内容：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

重启 Nginx：
```bash
sudo systemctl restart nginx
```

#### 步骤 5：配置 SSL 证书
1. 在阿里云申请免费 SSL 证书
2. 下载证书文件
3. 上传到服务器并配置 Nginx

### 方案三：使用 Vercel/Netlify（最简单，但域名需要配置）

如果不想配置服务器，可以使用这些平台：
1. 将代码推送到 GitHub
2. 在 Vercel 或 Netlify 导入项目
3. 配置自定义域名

## 🔒 安全建议

### 当前情况
使用环境变量后，API Key 仍然会被打包到前端代码中，任何人都可以在浏览器开发者工具中看到。这是前端应用的固有限制。

### 解决方案

#### 方案 A：后端代理（最安全，推荐用于生产环境）

创建一个简单的 Node.js 后端服务来代理 API 请求，API Key 只保存在服务器端。

**步骤：**

1. 创建后端服务（在项目根目录创建 `server/` 文件夹）：
```javascript
// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`代理服务器运行在端口 ${PORT}`);
});
```

2. 修改前端代码，将 API 调用改为调用自己的后端。

3. 部署后端服务到服务器（如阿里云 ECS），并配置环境变量。

#### 方案 B：使用环境变量（当前方案）
- ✅ 优点：简单，不需要后端服务器
- ⚠️ 缺点：API Key 仍然暴露在前端代码中
- 💡 适用场景：个人项目、测试环境、API Key 有使用限制的情况

**注意**：如果使用此方案，建议：
- 在 DeepSeek 控制台设置 API Key 的使用限制（如 IP 白名单、请求频率限制）
- 定期更换 API Key
- 监控 API 使用情况

## 📝 部署检查清单

### 部署前
- [ ] 已配置 `.env.local` 文件，包含 `VITE_DEEPSEEK_API_KEY`
- [ ] 项目已构建（`npm run build`）
- [ ] `dist` 文件夹已生成
- [ ] 本地预览测试通过（`npm run preview`）

### 部署中
- [ ] 已选择部署方案（OSS/CDN 或 ECS）
- [ ] 文件已上传到服务器/OSS
- [ ] 域名已解析（等待 DNS 生效，通常几分钟到几小时）
- [ ] HTTPS 已配置（SSL 证书）

### 部署后验证
- [ ] 网站可以正常访问（HTTP 和 HTTPS）
- [ ] 页面加载正常，无 404 错误
- [ ] API 调用正常（检查浏览器控制台 Network 标签）
- [ ] 移动端访问正常
- [ ] 页面刷新不会出现 404（SPA 路由配置正确）

## 🐛 常见问题

### 1. 页面刷新 404
**原因**：Vue Router 使用 history 模式，需要服务器配置。

**解决**：
- OSS：确保 404 页面指向 `index.html`
- Nginx：添加 `try_files $uri $uri/ /index.html;`

### 2. API 调用失败（CORS 错误）
**原因**：跨域问题。

**解决**：DeepSeek API 应该支持 CORS，如果不行，使用后端代理。

### 3. 资源加载失败
**原因**：路径配置问题。

**解决**：检查 `vite.config.ts` 中的 `base` 配置，如果部署在子目录需要设置。

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查浏览器控制台的错误信息
2. 检查服务器日志
3. 确认域名解析是否生效（使用 `ping` 命令）

