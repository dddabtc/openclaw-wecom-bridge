import { loadSessionMap } from './config';

export class SessionMapper {
  private map: Record<string, string>;

  constructor(path: string) {
    this.map = loadSessionMap(path);
  }

  resolve(fromUser: string, chatId?: string): string {
    const key = chatId ? `chat:${chatId}` : `user:${fromUser}`;
    return this.map[key] || key;
  }
}
