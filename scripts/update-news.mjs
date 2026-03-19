#!/usr/bin/env node
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { dedupeNews } from './utils/dedupe.mjs';
import { normalizeNewsInput, nowIso, readJson, sortNews, timestampForFile, writeJson, writeNotification } from './utils/json-store.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const inputPath = process.argv[2];
const notifyPath = process.argv[3];

if (!inputPath) {
  console.error('Usage: node scripts/update-news.mjs <input-json-path> [notification-output-path]');
  process.exit(1);
}

const latestPath = resolve(root, 'public/data/news/latest.json');
const historyPath = resolve(root, `public/data/news/history/${timestampForFile()}.json`);

const incoming = normalizeNewsInput(readJson(resolve(process.cwd(), inputPath), []));
const existingDoc = readJson(latestPath, { updatedAt: nowIso(), items: [] });
const deduped = dedupeNews(incoming, existingDoc.items);
const merged = sortNews([...deduped, ...existingDoc.items]);
const updatedAt = nowIso();

writeJson(latestPath, { updatedAt, items: merged });
writeJson(historyPath, { updatedAt, items: deduped });

const message = [
  '【AI Now 自动更新通知】',
  '类型：AI 新闻',
  `时间：${updatedAt}`,
  `结果：成功`,
  `新增：${deduped.length} 条`,
  `当前总数：${merged.length} 条`,
  deduped[0] ? `最新标题：${deduped[0].title}` : '最新标题：无新增',
  '后续动作：请执行 git add/commit/push 触发 Vercel 自动部署。',
].join('\n');

console.log(message);
writeNotification(notifyPath, message);
