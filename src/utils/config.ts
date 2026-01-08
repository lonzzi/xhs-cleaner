import fs from 'fs/promises';
import path from 'path';
import { homedir } from 'os';

const CONFIG_DIR = path.join(homedir(), '.xhs-cleaner');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function ensureConfigDir(): Promise<void> {
  try {
    await fs.access(CONFIG_DIR);
  } catch {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  }
}

export async function saveConfig(config: Record<string, unknown>): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function loadConfig(): Promise<Record<string, unknown> | null> {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomDelay(min = 1000, max = 3000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
