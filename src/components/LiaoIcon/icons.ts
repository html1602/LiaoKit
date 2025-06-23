import type { App } from 'vue';
import { registerSvgIcon as utilsRegisterSvgIcon, getSvgIcon } from '../../utils/icons';

// 通过SVG字符串注册自定义图标的Map
const customSvgIcons: Record<string, string> = {};

// 注册自定义SVG图标
export function registerSvgIcon(name: string, svg: string): void {
  const iconName = `icon-liao-${name.toLowerCase()}`;
  customSvgIcons[iconName] = svg;
  
  // 同时使用utils/icons.ts中的方法注册
  utilsRegisterSvgIcon(name, svg);
}

// 批量注册自定义SVG图标
export function registerSvgIcons(icons: Record<string, string>): void {
  Object.entries(icons).forEach(([name, svg]) => {
    registerSvgIcon(name, svg);
  });
}

// 获取已注册的自定义SVG图标
export function getCustomSvgIcon(name: string): string | undefined {
  // 先尝试从utils/icons.ts中获取
  const svgFromUtils = getSvgIcon(name);
  if (svgFromUtils) {
    return svgFromUtils;
  }
  
  // 再尝试从本地缓存获取
  const iconName = `icon-liao-${name.toLowerCase()}`;
  return customSvgIcons[iconName];
}

// 注册所有图标组件（已废弃，保留向后兼容）
export function registerIconComponents(app: App): void {
  // 现在使用动态加载方式，不需要手动注册
  console.warn('registerIconComponents is deprecated. Icons are now loaded dynamically.');
} 