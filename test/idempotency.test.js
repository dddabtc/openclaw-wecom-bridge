"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const idempotency_1 = require("../src/idempotency");
(0, vitest_1.describe)('IdempotencyStore', () => {
    (0, vitest_1.it)('should reject duplicate ids', () => {
        const store = new idempotency_1.IdempotencyStore(1000);
        (0, vitest_1.expect)(store.isDuplicate('m1')).toBe(false);
        (0, vitest_1.expect)(store.isDuplicate('m1')).toBe(true);
    });
});
