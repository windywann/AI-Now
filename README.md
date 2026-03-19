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

AI Now 是一个现代化的 AI 资讯聚合平台，为开发者和 AI 爱好者提供：

- **每日快讯** — 精选全球 AI 领域重要新闻，涵盖大模型发布、行业动态、产品更新等
- **GitHub Trending** — 实时追踪 AI/ML 领域最热门的开源项目
- **邮箱订阅** — 支持双重确认订阅，每天早晨发送 AI 新闻简报

## 功能特性

- 📰 **时间线式新闻展示** — 按日期分组，清晰展示资讯时间脉络
- 🔗 **一键跳转原文** — 点击卡片直达新闻源或 GitHub 仓库
- 📬 **真实订阅系统** — 订阅、邮箱确认、退订全链路可用
- ⏰ **每日定时简报** — 后端定时任务每天 08:00 自动发送
- 📱 **响应式设计** — 完美适配桌面端与移动端
- ⚡ **极速体验** — 基于 Vite 构建，毫秒级热更新

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | 前端框架 |
| TypeScript | 类型安全 |
| Vite 6 | 构建工具 |
| Tailwind CSS 4 | 样式框架 |
| React Router 7 | 路由管理 |
| Express | 订阅 API 服务 |
| SQLite (better-sqlite3) | 订阅数据存储 |
| Resend | 邮件发送（确认邮件/每日简报） |
| node-cron | 每日定时任务 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm 或 pnpm

### 安装与运行

```bash
# 安装依赖
npm install

# 启动前端 + 后端
npm run dev
```

启动后：
- 前端：http://localhost:3000
- 后端 API：http://localhost:3001

## 订阅功能配置

### 1) 复制环境变量

将 `.env.example` 复制为 `.env.local`（或 `.env`），并填写：

- `APP_URL`：前端地址（本地一般是 `http://localhost:3000`）
- `PORT`：后端端口（默认 `3001`）
- `RESEND_API_KEY`：Resend API Key
- `EMAIL_FROM`：Resend 中验证通过的发信地址，例如 `AI Now <noreply@yourdomain.com>`
- `ADMIN_TOKEN`：手动触发日报接口的令牌

### 2) 准备 Resend 发信域名

在 Resend 控制台完成域名验证（SPF / DKIM），否则邮件可能无法送达。

### 3) 订阅流程

1. 用户在页面输入邮箱并提交
2. 后端写入 SQLite（`data/subscribers.db`）
3. 后端发送确认邮件
4. 用户点击确认链接后状态变为 `active`
5. 每天 08:00（Asia/Shanghai）发送简报

### 4) 手动触发日报（可选）

```bash
curl -X POST "http://localhost:3001/api/send-digest" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

## API 概览

- `POST /api/subscribe`：提交订阅邮箱
- `GET /api/confirm?token=...`：确认订阅
- `GET /api/unsubscribe?token=...`：退订
- `POST /api/send-digest`：手动触发发送（需 `ADMIN_TOKEN`）
- `GET /api/health`：健康检查

## 项目结构

```
src/
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── NewsFeed.tsx
│   └── GithubTrending.tsx
├── data/
│   └── newsData.ts
├── pages/
│   ├── Home.tsx
│   ├── NewsPage.tsx
│   └── TrendingPage.tsx
├── App.tsx
├── main.tsx
└── index.css

server/
└── index.ts            # 订阅 API + SQLite + 邮件发送 + 定时任务

data/
└── subscribers.db      # 运行时自动创建（已加入 .gitignore）
```

## 数据来源

新闻数据来源于可靠的科技媒体与官方渠道：

- OpenAI Blog
- Anthropic
- Google AI
- NVIDIA
- Reuters
- CNBC
- TechCrunch
- GitHub Trending
