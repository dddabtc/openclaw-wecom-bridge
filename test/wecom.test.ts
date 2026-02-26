import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildReplyXml, verifySignature } from '../src/wecom';

describe('wecom helpers', () => {
  it('verifySignature should work', () => {
    const token = 'abc';
    const timestamp = '123';
    const nonce = '456';
    const sign = crypto
      .createHash('sha1')
      .update([token, timestamp, nonce].sort().join(''))
      .digest('hex');
    expect(verifySignature(token, timestamp, nonce, sign)).toBe(true);
  });

  it('buildReplyXml should contain content', () => {
    const xml = buildReplyXml('u1', 'bot', 'hello');
    expect(xml).toContain('hello');
  });
});
