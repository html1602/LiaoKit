declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明模块路径别名
declare module '@/utils/date' {
  export function formatDate(date: Date | number | string, format?: string): string;
  export function getFriendlyTime(date: Date | number | string): string;
  export function isSameDay(date1: Date | number | string, date2: Date | number | string): boolean;
}

// 相对路径模块声明
declare module '../../utils/date' {
  export * from '@/utils/date';
}

declare module '../../utils/date/index.ts' {
  export * from '@/utils/date';
} 