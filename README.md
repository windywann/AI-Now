<div align="center">

# AI Now - 每日AI简报

**聚合全球最新 AI 资讯、前沿研究与开源趋势**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 简介

AI Now 是一个静态部署的 AI 资讯聚合网站，聚焦两类内容：

- **每日快讯**：AI / LLM / Agent / 芯片 / 行业动态
- **GitHub Trending**：AI 相关热门开源项目

## 功能特性

- 📰 时间线式新闻展示
- 🔗 点击卡片直达原文
- 📈 支持今日 / 本周 / 本月 Trending
- 📦 基于 `public/data/*.json` 的数据驱动
- 🤖 支持 OpenClaw 定时更新 JSON 数据
- ⚡ Vercel 静态部署

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | 前端框架 |
| TypeScript | 类型安全 |
| Vite 6 | 构建工具 |
| Tailwind CSS 4 | 样式框架 |
| React Router 7 | 路由管理 |
| OpenClaw | 定时抓取与自动化更新 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm

### 安装与运行

```bash
npm install
npm run dev
```

启动后访问：
- http://localhost:3000

## 数据结构

```text
public/
└── data/
    ├── news/
    │   ├── latest.json
    │   └── history/
    └── trending/
        ├── daily.json
        ├── weekly.json
        └── monthly.json
```

## 自动化更新

新闻更新：
```bash
node scripts/update-news.mjs /tmp/ai-news.json /tmp/ai-news-notify.txt
```

Trending 更新：
```bash
node scripts/update-trending.mjs /tmp/trending-daily.json /tmp/trending-weekly.json /tmp/trending-monthly.json /tmp/trending-notify.txt
```

更多说明见：`docs/automation.md`

## 项目结构

```text
src/
├── components/
├── lib/
├── pages/
├── types/
└── main.tsx

public/data/
scripts/
prompts/openclaw/
docs/
```

## 数据来源

新闻与趋势数据来自公开可访问的新闻源、官方渠道与 GitHub Trending 页面，经人工规则过滤与去重后写入 JSON。
