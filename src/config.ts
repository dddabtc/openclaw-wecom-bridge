import fs from 'node:fs';

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT || 8080),
  env: process.env.NODE_ENV || 'development',
  wecom: {
    token: required('WECOM_TOKEN'),
    corpId: required('WECOM_CORP_ID'),
    agentId: required('WECOM_AGENT_ID'),
    appSecret: required('WECOM_APP_SECRET'),
    aesKey: process.env.WECOM_AES_KEY || ''
  },
  openclaw: {
    baseUrl: required('OPENCLAW_BASE_URL'),
    apiKey: required('OPENCLAW_API_KEY'),
    timeoutMs: Number(process.env.OPENCLAW_TIMEOUT_MS || 15000),
    retryMax: Number(process.env.OPENCLAW_RETRY_MAX || 3),
    retryBaseMs: Number(process.env.OPENCLAW_RETRY_BASE_MS || 300)
  },
  sessionMapFile: process.env.SESSION_MAP_FILE || './session-map.json',
  logLevel: process.env.LOG_LEVEL || 'info'
};

export function loadSessionMap(path: string): Record<string, string> {
  if (!fs.existsSync(path)) return {};
  const raw = fs.readFileSync(path, 'utf-8');
  return JSON.parse(raw) as Record<string, string>;
}
