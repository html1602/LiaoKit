/**
 * 图标工具函数
 */

import { logger } from './logger';

// 自定义SVG图标缓存
const svgIconCache: Record<string, string> = {};

/**
 * 注册自定义SVG图标
 * @param name 图标名称
 * @param svg SVG内容
 */
export function registerSvgIcon(name: string, svg: string): void {
  if (svgIconCache[name]) {
    logger.warn(`LiaoIcon: 图标 ${name} 已存在，将被覆盖`);
  }
  svgIconCache[name] = svg;
}

/**
 * 批量注册自定义SVG图标
 * @param icons 图标对象，key为图标名称，value为SVG内容
 */
export function registerSvgIcons(icons: Record<string, string>): void {
  Object.entries(icons).forEach(([name, svg]) => {
    registerSvgIcon(name, svg);
  });
}

/**
 * 获取自定义SVG图标
 * @param name 图标名称
 * @returns SVG内容
 */
export function getSvgIcon(name: string): string | null {
  return svgIconCache[name] || null;
}

/**
 * 检查自定义SVG图标是否存在
 * @param name 图标名称
 * @returns 是否存在
 */
export function hasSvgIcon(name: string): boolean {
  return !!svgIconCache[name];
}

/**
 * 删除自定义SVG图标
 * @param name 图标名称
 */
export function removeSvgIcon(name: string): void {
  delete svgIconCache[name];
}

/**
 * 获取所有自定义SVG图标名称
 * @returns 图标名称数组
 */
export function getAllSvgIconNames(): string[] {
  return Object.keys(svgIconCache);
}

/**
 * 清空所有自定义SVG图标
 */
export function clearAllSvgIcons(): void {
  Object.keys(svgIconCache).forEach((key) => {
    delete svgIconCache[key];
  });
} 