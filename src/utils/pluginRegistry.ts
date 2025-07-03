import { inject, provide } from 'vue';
import type { App, Component } from 'vue';
import { logger } from './logger';

// 插件注册表键名
export const PLUGIN_REGISTRY_KEY = 'liaoPlugins';

// 插件注册表类型
export type PluginRegistry = Record<string, Component>;

// 全局插件注册表
let globalPluginRegistry: PluginRegistry = {};

// 应用级注册（用户使用）
export function installPluginRegistry(app: App) {
  app.provide(PLUGIN_REGISTRY_KEY, globalPluginRegistry);
  return globalPluginRegistry;
}

// 组件级注册（内部预览使用）
export function usePluginRegistry() {
  // 尝试获取上层提供的注册表
  const existingRegistry = inject<PluginRegistry | null>(PLUGIN_REGISTRY_KEY, null);
  
  if (existingRegistry) {
    return {
      registry: existingRegistry,
      registerPlugin: (type: string, component: Component) => {
        existingRegistry[type] = component;
      }
    };
  }
  
  // 如果没有上层注册表，创建局部注册表
  const localRegistry: PluginRegistry = {};
  provide(PLUGIN_REGISTRY_KEY, localRegistry);
  
  return {
    registry: localRegistry,
    registerPlugin: (type: string, component: Component) => {
      localRegistry[type] = component;
    }
  };
}

// 注册单个插件
export function registerPlugin(type: string, component: Component) {
  if (!type || !component) {
    logger.warn('插件注册失败：类型或组件无效', { type, component });
    return component;
  }
  
  globalPluginRegistry[type] = component;
  return component;
}

// 批量注册插件
export function registerPlugins(plugins: Record<string, Component>) {
  if (!plugins || typeof plugins !== 'object') {
    logger.warn('批量注册插件失败：插件对象无效', plugins);
    return;
  }
  
  Object.entries(plugins).forEach(([type, component]) => {
    if (type && component) {
      registerPlugin(type, component);
    }
  });
}

/**
 * 根据类型获取插件
 * @param type 插件类型
 * @returns 插件组件
 */
export function getPlugin(type: string): Component | undefined {
  return type ? globalPluginRegistry[type] : undefined;
}

/**
 * 检查插件是否存在
 * @param type 插件类型
 * @returns 是否存在
 */
export function hasPlugin(type: string): boolean {
  return !!type && !!globalPluginRegistry[type];
}

/**
 * 获取所有已注册的插件信息
 * @returns 包含所有已注册插件的对象
 */
export function getRegisteredPlugins(): string[] {
  return Object.keys(globalPluginRegistry);
}

/**
 * 获取插件注册表状态信息（调试用）
 * @returns 注册表信息
 */
export function getPluginRegistryDebugInfo(): Record<string, any> {
  return {
    registeredPlugins: Object.keys(globalPluginRegistry),
    count: Object.keys(globalPluginRegistry).length,
    registry: globalPluginRegistry
  };
}

export default {
  registerPlugin,
  getPlugin,
  hasPlugin,
  installPluginRegistry,
  usePluginRegistry,
  registerPlugins,
  getRegisteredPlugins,
  getPluginRegistryDebugInfo
}; 