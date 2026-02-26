export class IdempotencyStore {
  private readonly seen = new Map<string, number>();

  constructor(private readonly ttlMs = 10 * 60 * 1000) {}

  isDuplicate(id: string): boolean {
    this.gc();
    if (this.seen.has(id)) return true;
    this.seen.set(id, Date.now());
    return false;
  }

  private gc() {
    const now = Date.now();
    for (const [k, ts] of this.seen) {
      if (now - ts > this.ttlMs) this.seen.delete(k);
    }
  }
}
