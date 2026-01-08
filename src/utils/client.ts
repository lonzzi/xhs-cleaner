import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { XhsConfig, NoteItem } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { delay, getRandomDelay } from '../utils/config.js';

export class XhsClient {
  private client: AxiosInstance;
  private cookie: string;
  private userId: string;

  constructor(config: XhsConfig) {
    this.cookie = config.cookie;
    // 从 cookie 中提取 user_id
    this.userId = this.extractUserId(config.cookie);
    this.client = axios.create({
      baseURL: 'https://edith.xiaohongshu.com',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Cookie: this.cookie,
        'Content-Type': 'application/json',
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        origin: 'https://www.xiaohongshu.com',
        referer: 'https://www.xiaohongshu.com/',
      },
    });
  }

  private extractUserId(cookie: string): string {
    // 尝试从 web_session 中提取 user_id，或从 cookie 中查找其他可能的字段
    // 如果找不到，返回空字符串，后续需要用户手动配置
    const match = cookie.match(/web_session=([^;]+)/);
    if (match && match[1]) {
      // web_session 通常包含用户信息，但格式可能不同
      // 这里简化处理，实际可能需要解码
      return '';
    }
    return '';
  }

  /**
   * 获取点赞列表
   */
  async getLikedNotes(
    cursor = '',
    userId?: string,
  ): Promise<{ notes: NoteItem[]; hasMore: boolean; cursor: string }> {
    const uid = userId || this.userId;
    if (!uid) {
      Logger.error('无法获取用户ID，请在配置中添加 user_id');
      return { notes: [], hasMore: false, cursor: '' };
    }
    try {
      const response = await this.client.get<{
        data?: { notes?: unknown[]; has_more?: boolean; cursor?: string };
      }>('/api/sns/web/v1/note/like/page', {
        params: {
          num: 30,
          cursor,
          user_id: uid,
          image_formats: 'jpg,webp,avif',
        },
      });

      const rawNotes = response.data?.data?.notes || [];
      const notes: NoteItem[] = rawNotes.map((note: unknown) => {
        const noteData = note as Record<string, unknown>;
        const noteId = noteData.note_id ?? noteData.id;
        const title = noteData.title;
        const xsecToken = noteData.xsec_token;
        return {
          id:
            typeof noteId === 'string' ? noteId : typeof noteId === 'number' ? String(noteId) : '',
          title: typeof title === 'string' ? title : '无标题',
          type: 'like' as const,
          xsec_token: typeof xsecToken === 'string' ? xsecToken : '',
        };
      });

      return {
        notes,
        hasMore: response.data?.data?.has_more || false,
        cursor: response.data?.data?.cursor || '',
      };
    } catch (error) {
      this.handleError(error, '获取点赞列表失败');
      return { notes: [], hasMore: false, cursor: '' };
    }
  }

  /**
   * 获取收藏列表
   */
  async getCollectedNotes(
    cursor = '',
    userId?: string,
  ): Promise<{ notes: NoteItem[]; hasMore: boolean; cursor: string }> {
    const uid = userId || this.userId;
    if (!uid) {
      Logger.error('无法获取用户ID，请在配置中添加 user_id');
      return { notes: [], hasMore: false, cursor: '' };
    }
    try {
      const response = await this.client.get<{
        data?: { notes?: unknown[]; has_more?: boolean; cursor?: string };
      }>('/api/sns/web/v2/note/collect/page', {
        params: {
          num: 30,
          cursor,
          user_id: uid,
          image_formats: 'jpg,webp,avif',
          xsec_token: '',
          xsec_source: '',
        },
      });

      const rawNotes = response.data?.data?.notes || [];
      const notes: NoteItem[] = rawNotes.map((note: unknown) => {
        const noteData = note as Record<string, unknown>;
        const noteId = noteData.note_id ?? noteData.id;
        const title = noteData.title;
        const xsecToken = noteData.xsec_token;
        return {
          id:
            typeof noteId === 'string' ? noteId : typeof noteId === 'number' ? String(noteId) : '',
          title: typeof title === 'string' ? title : '无标题',
          type: 'collect' as const,
          xsec_token: typeof xsecToken === 'string' ? xsecToken : '',
        };
      });

      return {
        notes,
        hasMore: response.data?.data?.has_more || false,
        cursor: response.data?.data?.cursor || '',
      };
    } catch (error) {
      this.handleError(error, '获取收藏列表失败');
      return { notes: [], hasMore: false, cursor: '' };
    }
  }

  /**
   * 取消点赞
   */
  async unlikeNote(noteId: string): Promise<boolean> {
    try {
      await this.client.post('/api/sns/web/v1/note/like', {
        note_id: noteId,
        type: 'unlike',
      });

      await delay(getRandomDelay());
      return true;
    } catch (error) {
      this.handleError(error, `取消点赞失败 (${noteId})`);
      return false;
    }
  }

  /**
   * 取消收藏
   */
  async uncollectNote(noteId: string): Promise<boolean> {
    try {
      await this.client.post('/api/sns/web/v1/note/uncollect', {
        note_ids: noteId,
      });

      await delay(getRandomDelay());
      return true;
    } catch (error) {
      this.handleError(error, `取消收藏失败 (${noteId})`);
      return false;
    }
  }

  private handleError(error: unknown, message: string): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ msg?: string }>;
      if (axiosError.response) {
        Logger.error(
          `${message}: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`,
        );
      } else {
        Logger.error(`${message}: ${axiosError.message}`);
      }
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error(`${message}: ${errorMessage}`);
    }
  }
}
