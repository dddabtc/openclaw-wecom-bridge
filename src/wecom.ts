import crypto from 'node:crypto';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { WeComIncomingMessage } from './types';

const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({ ignoreAttributes: false, cdataPropName: '__cdata' });

export function verifySignature(token: string, timestamp: string, nonce: string, signature: string): boolean {
  const sorted = [token, timestamp, nonce].sort().join('');
  const sha1 = crypto.createHash('sha1').update(sorted).digest('hex');
  return sha1 === signature;
}

export function parseWeComXml(xml: string): WeComIncomingMessage {
  const parsed = parser.parse(xml);
  return parsed.xml as WeComIncomingMessage;
}

export function buildReplyXml(to: string, from: string, content: string): string {
  const payload = {
    xml: {
      ToUserName: { __cdata: to },
      FromUserName: { __cdata: from },
      CreateTime: Math.floor(Date.now() / 1000),
      MsgType: { __cdata: 'text' },
      Content: { __cdata: content }
    }
  };
  return builder.build(payload);
}
