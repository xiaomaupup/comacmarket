# 推送到 GitHub 指南

## 当前状态

✅ Git 仓库已初始化
✅ 代码已提交（27 个文件）
✅ 远程仓库已配置：`https://github.com/xiaomaupup/comacmarket.git`

## 推送代码的两种方式

### 方式一：使用 Personal Access Token（推荐）

1. **创建 Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写名称（如：`comacmarket-push`）
   - 选择过期时间
   - 勾选权限：`repo`（完整仓库权限）
   - 点击 "Generate token"
   - **重要**：复制生成的 token（只显示一次）

2. **推送代码**：
   ```bash
   git push -u origin main
   ```
   当提示输入用户名和密码时：
   - Username: 输入你的 GitHub 用户名（`xiaomaupup`）
   - Password: 输入刚才复制的 Personal Access Token（不是 GitHub 密码）

### 方式二：使用 SSH（更安全，推荐长期使用）

1. **检查是否已有 SSH 密钥**：
   ```bash
   ls -al ~/.ssh
   ```

2. **如果没有，生成 SSH 密钥**：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # 按 Enter 使用默认路径
   # 可以设置密码或直接按 Enter
   ```

3. **复制公钥**：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # 复制输出的内容
   ```

4. **添加到 GitHub**：
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - Title: 填写名称（如：`My Mac`）
   - Key: 粘贴刚才复制的公钥
   - 点击 "Add SSH key"

5. **修改远程仓库地址为 SSH**：
   ```bash
   git remote set-url origin git@github.com:xiaomaupup/comacmarket.git
   ```

6. **推送代码**：
   ```bash
   git push -u origin main
   ```

### 方式三：使用 GitHub CLI（如果已安装）

```bash
# 登录 GitHub
gh auth login

# 推送代码
git push -u origin main
```

## 验证推送

推送成功后，访问 https://github.com/xiaomaupup/comacmarket 查看你的代码。

## 常见问题

### 问题 1：提示 "Authentication failed"
- 确保使用 Personal Access Token 而不是密码
- 检查 token 是否过期
- 确认 token 有 `repo` 权限

### 问题 2：提示 "Permission denied"
- 确认你有该仓库的写入权限
- 检查仓库是否为私有（需要相应权限）

### 问题 3：网络连接超时
- 检查网络连接
- 尝试使用代理或 VPN
- 考虑使用 SSH 方式

## 推送成功后

1. ✅ 在 GitHub 上查看代码
2. ✅ 继续在 Vercel 部署（参考 `VERCEL_DEPLOY.md`）
3. ✅ 配置 Vercel 环境变量并部署

