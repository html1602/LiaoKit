import { logger } from '../logger';

/**
 * 日期格式化工具函数
 */

/**
 * 将日期格式化为指定格式
 * @param date 日期对象或时间戳或日期字符串
 * @param format 格式化模板，支持以下占位符：
 *   - YYYY: 四位年份
 *   - MM: 两位月份
 *   - DD: 两位日期
 *   - HH: 两位小时（24小时制）
 *   - mm: 两位分钟
 *   - ss: 两位秒
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD'): string {
  // 转换为日期对象
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    logger.warn('Invalid date:', date);
    return '';
  }
  
  // 获取日期各部分
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  
  // 格式化日期
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('ss', seconds.toString().padStart(2, '0'));
}

/**
 * 获取友好的相对时间显示
 * @param date 日期对象或时间戳或日期字符串
 * @returns 相对时间字符串，如"刚刚"、"5分钟前"、"昨天"等
 */
export function getFriendlyTime(date: Date | number | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // 一分钟内
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 一小时内
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  
  // 一天内
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }
  
  // 判断是否是昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  ) {
    return '昨天';
  }
  
  // 一周内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dateObj.getDay()];
  }
  
  // 今年内
  if (dateObj.getFullYear() === now.getFullYear()) {
    return formatDate(dateObj, 'MM月DD日');
  }
  
  // 超过一年
  return formatDate(dateObj, 'YYYY年MM月DD日');
}

/**
 * 检查两个日期是否为同一天
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 是否为同一天
 */
export function isSameDay(date1: Date | number | string, date2: Date | number | string): boolean {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
} 