import express from 'express';
import pinoHttp from 'pino-http';
import { config } from './config';
import { IdempotencyStore } from './idempotency';
import { logger } from './logger';
import { sendToOpenClaw } from './openclawClient';
import { SessionMapper } from './sessionMap';
import { buildReplyXml, parseWeComXml, verifySignature } from './wecom';

const app = express();
const idem = new IdempotencyStore();
const mapper = new SessionMapper(config.sessionMapFile);

app.use(pinoHttp({ logger }));
app.use(express.text({ type: ['application/xml', 'text/xml', 'text/plain', '*/*'] }));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'openclaw-wecom-bridge', version: '0.1.0' });
});

app.get('/wecom/callback', (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query as Record<string, string>;
  if (!msg_signature || !timestamp || !nonce || !echostr) {
    return res.status(400).send('missing query params');
  }

  if (!verifySignature(config.wecom.token, timestamp, nonce, msg_signature)) {
    return res.status(401).send('invalid signature');
  }

  return res.status(200).send(echostr);
});

app.post('/wecom/callback', async (req, res) => {
  const { msg_signature, timestamp, nonce } = req.query as Record<string, string>;
  if (!msg_signature || !timestamp || !nonce) {
    return res.status(400).send('missing signature params');
  }

  if (!verifySignature(config.wecom.token, timestamp, nonce, msg_signature)) {
    return res.status(401).send('invalid signature');
  }

  const msg = parseWeComXml(req.body || '');
  const messageId = msg.MsgId || `${msg.FromUserName}-${msg.CreateTime}`;

  if (idem.isDuplicate(messageId)) {
    req.log.info({ messageId }, 'duplicate message ignored');
    return res.status(200).send('success');
  }

  if (msg.MsgType !== 'text' || !msg.Content) {
    return res.status(200).send('success');
  }

  const sessionId = mapper.resolve(msg.FromUserName, msg.ChatId);

  try {
    const result = await sendToOpenClaw(sessionId, msg.Content);
    const reply = result.output || result.message || '已收到，OpenClaw 暂无可返回内容。';
    const xml = buildReplyXml(msg.FromUserName, msg.ToUserName, reply);
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  } catch (error) {
    req.log.error({ err: error, messageId, sessionId }, 'failed to process message');
    const xml = buildReplyXml(msg.FromUserName, msg.ToUserName, '系统繁忙，请稍后重试。');
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  }
});

app.listen(config.port, () => {
  logger.info({ port: config.port }, 'bridge service started');
});
