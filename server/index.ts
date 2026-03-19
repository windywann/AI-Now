import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import Database from 'better-sqlite3';
import cron from 'node-cron';
import { Resend } from 'resend';
import { aiNews } from '../src/data/newsData.ts';

dotenv.config({
  path: fs.existsSync(path.resolve(process.cwd(), '.env.local'))
    ? path.resolve(process.cwd(), '.env.local')
    : path.resolve(process.cwd(), '.env'),
});

const app = express();
const PORT = Number(process.env.PORT || 3001);
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'subscribers.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    confirm_token TEXT,
    unsubscribe_token TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    confirmed_at TEXT,
    last_sent_at TEXT
  );
`);

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

app.use(express.json());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nowIso() {
  return new Date().toISOString();
}

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSortedNews(limit = 8) {
  return [...aiNews]
    .sort((a, b) => {
      const aDate = `${a.date}T${a.time}:00`;
      const bDate = `${b.date}T${b.time}:00`;
      return bDate.localeCompare(aDate);
    })
    .slice(0, limit);
}

function buildDigestHtml(unsubscribeToken: string) {
  const newsItems = getSortedNews(8)
    .map(
      (item) => `
      <li style="margin:0 0 14px;line-height:1.5;">
        <div style="font-size:13px;color:#6b7280;margin-bottom:4px;">${escapeHtml(item.date)} ${escapeHtml(item.time)} · ${escapeHtml(item.source)} · ${escapeHtml(item.category)}</div>
        <a href="${item.url}" style="font-size:16px;color:#111827;text-decoration:none;font-weight:600;">${escapeHtml(item.title)}</a>
        <div style="font-size:14px;color:#374151;margin-top:6px;">${escapeHtml(item.summary)}</div>
      </li>
    `,
    )
    .join('');

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f3f4f6;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;padding:24px;border:1px solid #e5e7eb;">
        <h1 style="margin:0 0 6px;font-size:24px;color:#111827;">AI Now 每日简报</h1>
        <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">每天早晨，将最重要的 AI 资讯直接送达您的邮箱。</p>
        <ul style="padding-left:18px;margin:0;list-style:disc;">
          ${newsItems}
        </ul>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="font-size:12px;color:#6b7280;margin:0;">
          如果你不想再收到邮件，点击
          <a href="${APP_URL}/api/unsubscribe?token=${unsubscribeToken}" style="color:#2563eb;">取消订阅</a>
        </p>
      </div>
    </div>
  `;
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend || !EMAIL_FROM) {
    throw new Error('RESEND_API_KEY 或 EMAIL_FROM 未配置');
  }

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
}

async function sendConfirmationEmail(email: string, token: string) {
  const link = `${APP_URL}/api/confirm?token=${token}`;

  await sendEmail({
    to: email,
    subject: '请确认订阅 AI Now 每日简报',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:24px;background:#f3f4f6;">
        <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;">
          <h2 style="margin:0 0 10px;color:#111827;">确认你的邮箱订阅</h2>
          <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">点击下方按钮后，你将在每天早晨收到 AI Now 每日简报。</p>
          <a href="${link}" style="display:inline-block;padding:10px 16px;background:#111827;color:#fff;text-decoration:none;border-radius:10px;">确认订阅</a>
          <p style="margin-top:16px;font-size:12px;color:#6b7280;word-break:break-all;">如果按钮不可点击，请复制链接到浏览器：${link}</p>
        </div>
      </div>
    `,
  });
}

async function sendDailyDigest() {
  const subscribers = db
    .prepare("SELECT id, email, unsubscribe_token FROM subscribers WHERE status = 'active'")
    .all() as Array<{ id: number; email: string; unsubscribe_token: string }>;

  let sent = 0;

  for (const subscriber of subscribers) {
    try {
      const html = buildDigestHtml(subscriber.unsubscribe_token);
      await sendEmail({
        to: subscriber.email,
        subject: 'AI Now 每日简报',
        html,
      });

      db.prepare('UPDATE subscribers SET last_sent_at = ?, updated_at = ? WHERE id = ?').run(nowIso(), nowIso(), subscriber.id);
      sent += 1;
    } catch (error) {
      console.error('[digest] send failed:', subscriber.email, error);
    }
  }

  return { total: subscribers.length, sent };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'subscription-api' });
});

app.post('/api/subscribe', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: '请输入有效邮箱地址' });
  }

  const existing = db
    .prepare('SELECT id, status FROM subscribers WHERE email = ?')
    .get(email) as { id: number; status: string } | undefined;

  const confirmToken = makeToken();
  const now = nowIso();

  try {
    if (!existing) {
      db.prepare(
        'INSERT INTO subscribers (email, status, confirm_token, unsubscribe_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      ).run(email, 'pending', confirmToken, makeToken(), now, now);
    } else if (existing.status === 'active') {
      return res.json({ message: '该邮箱已订阅，无需重复提交' });
    } else {
      db.prepare('UPDATE subscribers SET status = ?, confirm_token = ?, updated_at = ? WHERE id = ?').run(
        'pending',
        confirmToken,
        now,
        existing.id,
      );
    }

    await sendConfirmationEmail(email, confirmToken);
    return res.json({ message: '确认邮件已发送，请前往邮箱点击确认链接' });
  } catch (error) {
    console.error('[subscribe] failed:', error);
    return res.status(500).json({ message: '订阅失败，请稍后重试' });
  }
});

app.get('/api/confirm', (req, res) => {
  const token = String(req.query.token || '');

  if (!token) {
    return res.status(400).send('缺少确认参数');
  }

  const target = db
    .prepare('SELECT id, email FROM subscribers WHERE confirm_token = ? AND status = ?')
    .get(token, 'pending') as { id: number; email: string } | undefined;

  if (!target) {
    return res.status(404).send('确认链接无效或已过期');
  }

  db.prepare('UPDATE subscribers SET status = ?, confirm_token = NULL, confirmed_at = ?, updated_at = ? WHERE id = ?').run(
    'active',
    nowIso(),
    nowIso(),
    target.id,
  );

  return res.send('订阅成功！你将每天收到 AI Now 每日简报。');
});

app.get('/api/unsubscribe', (req, res) => {
  const token = String(req.query.token || '');

  if (!token) {
    return res.status(400).send('缺少退订参数');
  }

  const target = db
    .prepare('SELECT id FROM subscribers WHERE unsubscribe_token = ?')
    .get(token) as { id: number } | undefined;

  if (!target) {
    return res.status(404).send('退订链接无效');
  }

  db.prepare('UPDATE subscribers SET status = ?, updated_at = ? WHERE id = ?').run('unsubscribed', nowIso(), target.id);
  return res.send('已成功退订。');
});

app.post('/api/send-digest', async (req, res) => {
  const token = String(req.headers['x-admin-token'] || req.query.token || '');

  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await sendDailyDigest();
    return res.json({ message: 'Digest sent', ...result });
  } catch (error) {
    console.error('[digest] manual trigger failed:', error);
    return res.status(500).json({ message: 'Digest failed' });
  }
});

cron.schedule(
  '0 8 * * *',
  async () => {
    try {
      const result = await sendDailyDigest();
      console.log(`[digest] finished: ${result.sent}/${result.total}`);
    } catch (error) {
      console.error('[digest] cron failed:', error);
    }
  },
  { timezone: 'Asia/Shanghai' },
);

app.listen(PORT, () => {
  console.log(`Subscription server running on http://localhost:${PORT}`);
});
