import { chromium, type Browser, type BrowserContext, type Page, type Response } from 'playwright';
import chalk from 'chalk';
import type { XhsConfig, NoteItem } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { delay, getRandomDelay } from '../utils/config.js';

interface XhsApiResponse {
  data?: {
    notes?: unknown[];
    has_more?: boolean;
    cursor?: string;
  };
}

export class XhsClient {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private cookie: string;
  private userId: string;

  constructor(config: XhsConfig) {
    this.cookie = config.cookie;
    this.userId = config.user_id || '';
  }

  async init(headless = true): Promise<void> {
    try {
      this.browser = await chromium.launch({ headless });
      this.context = await this.browser.newContext({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      });

      // 解析 Cookie 并添加到 context
      if (this.cookie) {
        const cookies = this.cookie
          .split(';')
          .map((c) => {
            const parts = c.trim().split('=');
            if (parts.length < 2) return null;
            const name = parts[0];
            const value = parts.slice(1).join('=');
            if (!name) return null;
            return {
              name: name.trim(),
              value: value.trim(),
              domain: '.xiaohongshu.com',
              path: '/',
            };
          })
          .filter(
            (c): c is { name: string; value: string; domain: string; path: string } => c !== null,
          );

        await this.context.addCookies(cookies);
      }

      this.page = await this.context.newPage();

      // 访问一次首页以确保环境就绪，使用更宽松的等待条件
      await this.page.goto('https://www.xiaohongshu.com', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
    } catch (error) {
      Logger.error(`初始化浏览器失败: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * 自动登录获取 Cookie
   */
  async login(): Promise<{ cookie: string; user_id: string }> {
    await this.init(false); // 强制非无头模式进行登录
    if (!this.page || !this.context) throw new Error('Client not initialized');

    Logger.info('请在打开的浏览器窗口中完成登录 (扫码登录)...');

    // 等待登录成功的标志：出现特定的 cookie 或者页面跳转
    // 这里等待 web_session 出现，或者用户手动关闭浏览器前一直检查
    // 等待登录成功的标志：特定接口请求成功
    return new Promise((resolve, reject) => {
      const onResponse = async (response: Response) => {
        try {
          const url = response.url();
          if (url.includes('/api/sns/web/v2/user/me') && response.status() === 200) {
            // 解析 JSON 检查真正成功
            const resData = (await response.json()) as {
              success: boolean;
              code: number;
              data?: {
                user_id?: string;
                id?: string;
                guest?: boolean;
                nickname?: string;
              };
            };

            if (resData.success === true && resData.code === 0 && resData.data?.guest !== true) {
              if (this.page) this.page.off('response', onResponse);
              clearInterval(checkInterval);

              const cookies = await (this.context?.cookies() || Promise.resolve([]));
              const cookieStr = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

              const uid = resData.data?.user_id || resData.data?.id || '';
              const nickname = resData.data?.nickname || '未知用户';

              Logger.success(`登录成功！欢迎回来，${chalk.bold(nickname)} (ID: ${uid})`);
              resolve({ cookie: cookieStr, user_id: uid });
            }
          }
        } catch {
          // 忽略响应解析错误
        }
      };

      this.page?.on('response', onResponse);

      const checkInterval = setInterval(() => {
        try {
          if (!this.context) {
            clearInterval(checkInterval);
            if (this.page) this.page.off('response', onResponse);
            reject(new Error('Browser context lost'));
            return;
          }
        } catch {
          clearInterval(checkInterval);
          if (this.page) this.page.off('response', onResponse);
          reject(new Error('浏览器已关闭或发生错误'));
        }
      }, 2000);

      // 监听浏览器关闭
      this.browser?.on('disconnected', () => {
        this.page?.off('response', onResponse);
        clearInterval(checkInterval);
        reject(new Error('浏览器已关闭，登录未完成'));
      });
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
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

    if (!this.page) throw new Error('Client not initialized');

    try {
      const result = await this.page.evaluate(
        async ({ uid, cursor }): Promise<XhsApiResponse> => {
          const url = new URL('https://edith.xiaohongshu.com/api/sns/web/v1/note/like/page');
          url.searchParams.append('num', '30');
          url.searchParams.append('cursor', cursor);
          url.searchParams.append('user_id', uid);
          url.searchParams.append('image_formats', 'jpg,webp,avif');

          const response = await fetch(url.toString());
          return response.json() as Promise<XhsApiResponse>;
        },
        { uid, cursor },
      );

      const rawNotes = result.data?.notes || [];
      const notes: NoteItem[] = (rawNotes as Record<string, unknown>[]).map(
        (note: Record<string, unknown>) => {
          const noteId =
            (note.note_id as string | number | undefined) ??
            (note.id as string | number | undefined);
          return {
            id: String(noteId || ''),
            title: (note.title as string) || '无标题',
            type: 'like' as const,
            xsec_token: (note.xsec_token as string) || '',
          };
        },
      );

      return {
        notes,
        hasMore: result.data?.has_more || false,
        cursor: result.data?.cursor || '',
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

    if (!this.page) throw new Error('Client not initialized');

    try {
      const result = await this.page.evaluate(
        async ({ uid, cursor }): Promise<XhsApiResponse> => {
          const url = new URL('https://edith.xiaohongshu.com/api/sns/web/v2/note/collect/page');
          url.searchParams.append('num', '30');
          url.searchParams.append('cursor', cursor);
          url.searchParams.append('user_id', uid);
          url.searchParams.append('image_formats', 'jpg,webp,avif');

          const response = await fetch(url.toString());
          return response.json() as Promise<XhsApiResponse>;
        },
        { uid, cursor },
      );

      const rawNotes = result.data?.notes || [];
      const notes: NoteItem[] = (rawNotes as Record<string, unknown>[]).map(
        (note: Record<string, unknown>) => {
          const noteId =
            (note.note_id as string | number | undefined) ??
            (note.id as string | number | undefined);
          return {
            id: String(noteId || ''),
            title: (note.title as string) || '无标题',
            type: 'collect' as const,
            xsec_token: (note.xsec_token as string) || '',
          };
        },
      );

      return {
        notes,
        hasMore: result.data?.has_more || false,
        cursor: result.data?.cursor || '',
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
    if (!this.page) throw new Error('Client not initialized');

    try {
      await this.page.evaluate(async (noteId) => {
        await fetch('https://edith.xiaohongshu.com/api/sns/web/v1/note/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note_id: noteId,
            type: 'unlike',
          }),
        });
      }, noteId);

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
    if (!this.page) throw new Error('Client not initialized');

    try {
      await this.page.evaluate(async (noteId) => {
        await fetch('https://edith.xiaohongshu.com/api/sns/web/v1/note/uncollect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note_ids: noteId,
          }),
        });
      }, noteId);

      await delay(getRandomDelay());
      return true;
    } catch (error) {
      this.handleError(error, `取消收藏失败 (${noteId})`);
      return false;
    }
  }

  private handleError(error: unknown, message: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(`${message}: ${errorMessage}`);
  }
}
