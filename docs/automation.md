# AI Now Automation

## 数据结构

- `public/data/news/latest.json`：站点当前新闻源
- `public/data/news/history/*.json`：每次新增新闻快照
- `public/data/trending/daily.json`：今日 Trending
- `public/data/trending/weekly.json`：本周 Trending
- `public/data/trending/monthly.json`：本月 Trending

## 本地更新命令

```bash
node scripts/update-news.mjs /tmp/ai-news.json /tmp/ai-news-notify.txt
node scripts/update-trending.mjs /tmp/trending-daily.json /tmp/trending-weekly.json /tmp/trending-monthly.json /tmp/trending-notify.txt
```

## OpenClaw 定时任务

- 新闻：`09:00 / 12:00 / 18:00`
- Trending：`12:00`

使用提示词文件：
- `prompts/openclaw/news-update.prompt.md`
- `prompts/openclaw/trending-update.prompt.md`

## 固定通知模板

新闻与 Trending 更新脚本都会生成固定格式通知，例如：

```text
【AI Now 自动更新通知】
类型：AI 新闻
时间：2026-03-19T12:00:00.000Z
结果：成功
新增：3 条
当前总数：15 条
最新标题：xxx
后续动作：请执行 git add/commit/push 触发 Vercel 自动部署。
```
