#!/usr/bin/env node
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { normalizeTrendingInput, nowIso, readJson, writeJson, writeNotification } from './utils/json-store.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const dailyInput = process.argv[2];
const weeklyInput = process.argv[3];
const monthlyInput = process.argv[4];
const notifyPath = process.argv[5];

if (!dailyInput || !weeklyInput || !monthlyInput) {
  console.error('Usage: node scripts/update-trending.mjs <daily-json> <weekly-json> <monthly-json> [notification-output-path]');
  process.exit(1);
}

const dailyItems = normalizeTrendingInput(readJson(resolve(process.cwd(), dailyInput), []));
const weeklyItems = normalizeTrendingInput(readJson(resolve(process.cwd(), weeklyInput), []));
const monthlyItems = normalizeTrendingInput(readJson(resolve(process.cwd(), monthlyInput), []));
const updatedAt = nowIso();

writeJson(resolve(root, 'public/data/trending/daily.json'), { updatedAt, items: dailyItems });
writeJson(resolve(root, 'public/data/trending/weekly.json'), { updatedAt, items: weeklyItems });
writeJson(resolve(root, 'public/data/trending/monthly.json'), { updatedAt, items: monthlyItems });

const message = [
  '【AI Now 自动更新通知】',
  '类型：GitHub Trending',
  `时间：${updatedAt}`,
  '结果：成功',
  `今日：${dailyItems.length} 条`,
  `本周：${weeklyItems.length} 条`,
  `本月：${monthlyItems.length} 条`,
  dailyItems[0] ? `今日榜首：${dailyItems[0].repo}` : '今日榜首：无数据',
  '后续动作：请执行 git add/commit/push 触发 Vercel 自动部署。',
].join('\n');

console.log(message);
writeNotification(notifyPath, message);
