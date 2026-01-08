#!/usr/bin/env bun

import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { XhsClient } from './utils/client.js';
import { Logger } from './utils/logger.js';
import { loadConfig, saveConfig } from './utils/config.js';
import { ActionType } from './types/index.js';
import type { XhsConfig } from './types/index.js';

const program = new Command();

program.name('xhs-cleaner').description('批量取消小红书收藏和点赞的 CLI 工具').version('1.0.0');

program
  .command('config')
  .description('配置小红书 Cookie 和 User ID')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'cookie',
        message: '请输入小红书 Cookie:',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return '请输入有效的 Cookie';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'user_id',
        message: '请输入你的 User ID (在个人主页 URL 中可以找到):',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return '请输入有效的 User ID';
          }
          return true;
        },
      },
    ]);

    await saveConfig({ cookie: answers.cookie, user_id: answers.user_id });
    Logger.success('Cookie 和 User ID 配置已保存');
  });

program
  .command('clean')
  .description('批量清理点赞或收藏')
  .action(async () => {
    const config = (await loadConfig()) as XhsConfig | null;

    if (!config?.cookie) {
      Logger.error('请先使用 "xhs-cleaner config" 命令配置 Cookie');
      process.exit(1);
    }

    const actionResult = await inquirer.prompt<{ action: string }>([
      {
        type: 'rawlist',
        name: 'action',
        message: '请选择要清理的内容',
        choices: [
          { name: '取消点赞', value: 'unlike' },
          { name: '取消收藏', value: 'uncollect' },
        ],
      },
    ]);
    const { action } = actionResult;

    const confirmResult = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow('⚠️  此操作将批量清理，是否确认继续？'),
        default: false,
      },
    ]);
    const { confirm } = confirmResult;

    if (!confirm) {
      Logger.info('操作已取消');
      return;
    }

    const client = new XhsClient(config);
    await cleanNotes(client, action as ActionType, config.user_id);
  });

async function cleanNotes(client: XhsClient, action: ActionType, userId?: string): Promise<void> {
  let cursor = '';
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;

  const spinner = ora('正在获取列表...').start();

  try {
    while (true) {
      spinner.text = `正在获取列表... (已处理: ${totalProcessed})`;

      let result;
      if (action === ActionType.UNLIKE) {
        result = await client.getLikedNotes(cursor, userId);
      } else {
        result = await client.getCollectedNotes(cursor, userId);
      }

      const { notes, hasMore, cursor: nextCursor } = result;

      if (notes.length === 0) {
        break;
      }

      spinner.text = `正在处理 ${notes.length} 条内容...`;

      for (const note of notes) {
        let success = false;
        if (action === ActionType.UNLIKE) {
          success = await client.unlikeNote(note.id);
        } else {
          success = await client.uncollectNote(note.id);
        }

        totalProcessed++;
        if (success) {
          totalSuccess++;
          const actionText = action === ActionType.UNLIKE ? '取消点赞' : '取消收藏';
          spinner.text = chalk.green(
            `✔ ${actionText}: ${note.title} (${totalProcessed}/${totalProcessed})`,
          );
        } else {
          totalFailed++;
        }
      }

      if (!hasMore || !nextCursor) {
        break;
      }

      cursor = nextCursor;
    }

    spinner.stop();

    Logger.success(`\n清理完成！`);
    Logger.info(`总计处理: ${totalProcessed}`);
    Logger.success(`成功: ${totalSuccess}`);
    if (totalFailed > 0) {
      Logger.error(`失败: ${totalFailed}`);
    }
  } catch (error) {
    spinner.stop();
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(`清理过程中发生错误: ${errorMessage}`);
  }
}

program.parse();
