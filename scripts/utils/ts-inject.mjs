#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 安全注入 TS 数组元素
 * @param {string} filePath - TS 文件路径
 * @param {string} arrayName - 数组变量名（如 'aiNews'）
 * @param {object} newItem - 要插入的新对象
 */
export function injectToArray(filePath, arrayName, newItem) {
  const content = readFileSync(filePath, 'utf8');
  
  // 查找数组声明：export const arrayName = [
  // 精确匹配 export const aiNews = [ ... ];
  const arrayRegex = new RegExp(`export const ${arrayName} = \[([\s\S]*?)\];`, 'm');
  const match = content.match(arrayRegex);
  
  if (!match) {
    throw new Error(`Array '${arrayName}' not found in ${filePath}`);
  }
  
  // 获取数组内容（不含括号）
  let arrayContent = match[1].trim();
  
  // 生成新项的字符串表示（保持格式）
  const newItemStr = JSON.stringify(newItem, null, 2)
    .replace(/"(\w+)":/g, '$1:') // 移除键的引号
    .replace(/,\s*$/, ''); // 移除末尾逗号
  
  // 如果原数组为空，直接写入；否则在末尾添加逗号和新行
  let newContent;
  if (arrayContent === '') {
    newContent = `  ${newItemStr}`;
  } else {
    newContent = `\n  ${newItemStr},\n  ` + arrayContent;
  }
  
  // 替换原数组内容
  const updatedContent = content.replace(
    arrayRegex,
    `export const ${arrayName} = [${newContent}\n];`
  );
  
  writeFileSync(filePath, updatedContent);
  console.log(`✅ Injected to ${arrayName} in ${filePath}`);
}

// CLI usage: node ts-inject.mjs <file> <array> <json>
if (process.argv[1].includes('ts-inject.mjs')) {
  const [,, filePath, arrayName, jsonStr] = process.argv;
  if (!filePath || !arrayName || !jsonStr) {
    console.error('Usage: node ts-inject.mjs <file> <array> <json>');
    process.exit(1);
  }
  try {
    const newItem = JSON.parse(jsonStr);
    injectToArray(filePath, arrayName, newItem);
  } catch (e) {
    console.error('❌ Injection failed:', e.message);
    process.exit(1);
  }
}
