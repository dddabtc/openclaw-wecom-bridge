"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
const vitest_1 = require("vitest");
const wecom_1 = require("../src/wecom");
(0, vitest_1.describe)('wecom helpers', () => {
    (0, vitest_1.it)('verifySignature should work', () => {
        const token = 'abc';
        const timestamp = '123';
        const nonce = '456';
        const sign = node_crypto_1.default
            .createHash('sha1')
            .update([token, timestamp, nonce].sort().join(''))
            .digest('hex');
        (0, vitest_1.expect)((0, wecom_1.verifySignature)(token, timestamp, nonce, sign)).toBe(true);
    });
    (0, vitest_1.it)('buildReplyXml should contain content', () => {
        const xml = (0, wecom_1.buildReplyXml)('u1', 'bot', 'hello');
        (0, vitest_1.expect)(xml).toContain('hello');
    });
});
