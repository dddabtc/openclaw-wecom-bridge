# openclaw-wecom-bridge

OpenClaw 与企业微信（WeCom）之间的最小可用桥接服务（MVP）。

## 能力边界
### 已支持
- WeCom 回调 URL 验证（GET）
- WeCom 消息接收（POST，文本消息）
- WeCom user/chat 到 OpenClaw session 的映射
- 调用 OpenClaw API 发送消息并回传回复
- 基础幂等（按 MsgId）与重试
- 结构化日志与健康检查端点

### 暂未支持（MVP 限制）
- WeCom AES 解密/加密消息体（当前按明文回调模式）
- 图片/语音/文件等富媒体消息
- 分布式幂等存储（当前为进程内内存）
- 多租户隔离

## 快速开始
```bash
git clone <repo-url>
cd openclaw-wecom-bridge
cp .env.example .env
# 编辑 .env
npm install
npm run build
npm start
```

服务默认监听 `:8080`。

## 配置项
见 `.env.example`，核心项：
- `WECOM_TOKEN`：企业微信回调 token（用于签名验证）
- `WECOM_CORP_ID` / `WECOM_AGENT_ID` / `WECOM_APP_SECRET`
- `OPENCLAW_BASE_URL` / `OPENCLAW_API_KEY`
- `OPENCLAW_RETRY_MAX` / `OPENCLAW_RETRY_BASE_MS`
- `SESSION_MAP_FILE`

## 运行方式
### 开发
```bash
npm run dev
```

### 生产（Docker）
```bash
docker build -t openclaw-wecom-bridge:0.1.0 .
docker run --env-file .env -p 8080:8080 openclaw-wecom-bridge:0.1.0
```

## 回调验证
企业微信配置回调地址：
- URL: `https://<your-domain>/wecom/callback`
- Token: 与 `WECOM_TOKEN` 一致

URL 验证请求示例（企业微信自动触发）：
`GET /wecom/callback?msg_signature=...&timestamp=...&nonce=...&echostr=...`

## 常见问题
1. **返回 invalid signature**：检查 `WECOM_TOKEN` 与企业微信配置是否一致。
2. **消息无回复**：确认 OpenClaw 地址/API Key 正确；查看服务日志。
3. **重复回复**：检查 WeCom 重试；可升级幂等存储到 Redis。

## CI / CD
- CI: `.github/workflows/ci.yml`（lint + test + build）
- CD: `.github/workflows/cd.yml`（Docker 镜像构建并推送 GHCR）

## 版本
当前版本：`0.1.0`
