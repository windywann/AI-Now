#!/usr/bin/env node
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 新闻去重：title + url + date 三字段标准化比对
 * @param {Array} candidates - 待检查的新新闻数组
 * @param {Array} existing - 现有新闻数组
 * @returns {Array} 去重后的新新闻
 */
export function dedupeNews(candidates, existing) {
  const existingSet = new Set();
  
  // 构建现有新闻指纹集合
  existing.forEach(item => {
    const normalizedTitle = item.title
      .toLowerCase()
      .replace(/[\s\p{P}]+/gu, ' ')
      .trim();
    const fingerprint = `${normalizedTitle}|${item.url}|${item.date}`;
    existingSet.add(fingerprint);
  });
  
  // 过滤候选新闻
  return candidates.filter(candidate => {
    const normalizedTitle = candidate.title
      .toLowerCase()
      .replace(/[\s\p{P}]+/gu, ' ')
      .trim();
    const fingerprint = `${normalizedTitle}|${candidate.url}|${candidate.date}`;
    
    if (existingSet.has(fingerprint)) {
      console.log(`⚠️  跳过重复新闻: ${candidate.title.substring(0, 50)}...`);
      return false;
    }
    return true;
  });
}

/**
 * GitHub Trending 去重：基于 owner/repo
 * @param {Array} candidates - 待检查的新 Trending 数组
 * @param {Array} existing - 现有 Trending 数组
 * @returns {Array} 去重后的新 Trending
 */
export function dedupeTrending(candidates, existing) {
  const existingSet = new Set(existing.map(item => item.id));
  
  return candidates.filter(candidate => {
    if (existingSet.has(candidate.id)) {
      console.log(`⚠️  跳过重复仓库: ${candidate.repo}`);
      return false;
    }
    return true;
  });
}
