#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname } from 'path';

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function readJson(path, fallback = null) {
  if (!existsSync(path)) {
    return fallback;
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJson(path, data) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function nowIso() {
  return new Date().toISOString();
}

export function timestampForFile() {
  return nowIso().replace(/[:]/g, '-');
}

export function sortNews(items) {
  return [...items].sort((a, b) => `${b.date}T${b.time}:00`.localeCompare(`${a.date}T${a.time}:00`));
}

export function normalizeNewsInput(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.articles)) return raw.articles;
  return [];
}

export function normalizeTrendingInput(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.repositories)) return raw.repositories;
  return [];
}

export function writeNotification(path, content) {
  if (!path) return;
  ensureDir(dirname(path));
  writeFileSync(path, `${content.trim()}\n`, 'utf8');
}
