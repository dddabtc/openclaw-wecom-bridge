import axios, { AxiosError } from 'axios';
import { config } from './config';
import { OpenClawSendResponse } from './types';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendToOpenClaw(sessionId: string, text: string): Promise<OpenClawSendResponse> {
  let lastErr: unknown;

  for (let attempt = 1; attempt <= config.openclaw.retryMax; attempt++) {
    try {
      const resp = await axios.post(
        `${config.openclaw.baseUrl}/api/messages`,
        { sessionId, text },
        {
          timeout: config.openclaw.timeoutMs,
          headers: {
            Authorization: `Bearer ${config.openclaw.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return resp.data as OpenClawSendResponse;
    } catch (e) {
      lastErr = e;
      const status = (e as AxiosError).response?.status;
      if (status && status < 500) break;
      if (attempt < config.openclaw.retryMax) {
        const backoff = config.openclaw.retryBaseMs * 2 ** (attempt - 1);
        await sleep(backoff);
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('openclaw request failed');
}
