# SSH 密钥设置指南

## ✅ 已完成

1. ✅ SSH 密钥已生成（ed25519 类型）
2. ✅ 密钥已添加到 ssh-agent
3. ✅ 远程仓库地址已修改为 SSH

## 📋 你的 SSH 公钥

请复制以下完整内容（包括开头的 `ssh-ed25519` 和结尾的 `github-comacmarket`）：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIArFuVepuPU/msxX3MFKM3y3BHGKbwumaFRdHE4Uztg2 github-comacmarket
```

## 🔑 添加到 GitHub

### 步骤 1：访问 SSH 密钥设置页面
访问：https://github.com/settings/keys

### 步骤 2：添加新密钥
1. 点击绿色的 **"New SSH key"** 按钮
2. 填写表单：
   - **Title**（标题）：例如 `My Mac - comacmarket` 或 `MacBook Pro`
   - **Key**（密钥）：粘贴上面复制的完整公钥内容
3. 点击 **"Add SSH key"** 按钮

### 步骤 3：验证
添加成功后，你会看到新添加的密钥出现在列表中。

## 🚀 测试连接

添加完公钥后，在终端执行：

```bash
ssh -T git@github.com
```

如果看到类似以下消息，说明配置成功：
```
Hi xiaomaupup! You've successfully authenticated, but GitHub does not provide shell access.
```

## 📤 推送代码

SSH 配置成功后，执行：

```bash
cd "/Users/myt/Desktop/2025年/营销/定制项目-xingwei/航空问答小助手"
git push -u origin main
```

## ❓ 常见问题

### 问题 1：提示 "Permission denied (publickey)"
- 确认公钥已正确添加到 GitHub
- 检查公钥是否完整（包括开头和结尾）
- 尝试重新添加密钥

### 问题 2：提示 "Host key verification failed"
- 执行：`ssh-keyscan github.com >> ~/.ssh/known_hosts`
- 然后重试连接

### 问题 3：仍然无法连接
- 检查网络连接
- 确认 GitHub 用户名正确（xiaomaupup）
- 查看详细错误：`ssh -vT git@github.com`

## 📝 下一步

推送成功后：
1. 在 GitHub 查看代码：https://github.com/xiaomaupup/comacmarket
2. 在 Vercel 部署（参考 `VERCEL_DEPLOY.md`）

