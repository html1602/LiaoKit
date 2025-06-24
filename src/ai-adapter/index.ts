/**
 * AI 消息格式适配模块主入口
 * 提供统一的 API 接口和便捷的使用方式
 */

// 导出类型定义
export type {
  StandardMessage,
  AiAdapterOptions,
  AiAdapterResponse,
  CustomFormatFunction,
  QwenApiRequest,
  QwenApiResponse,
  CacheItem
} from './types';

export { AiAdapterError } from './types';

// 导出服务类和实例
export {
  AiMessageAdapterService,
  defaultAiAdapter,
  createAiAdapter
} from './aiService';

// 导出 Prompt 模板相关
export {
  PROMPT_TEMPLATES,
  BUSINESS_TEMPLATES,
  getPromptTemplate,
  generatePrompt,
  getBusinessPrompt
} from './promptTemplates';

// 便捷的适配函数
import { defaultAiAdapter, createAiAdapter } from './aiService';
import type { AiAdapterOptions, CustomFormatFunction } from './types';

/**
 * 快速适配单个消息
 * @param rawMessage 原始消息数据
 * @param options 可选的配置参数
 * @param customFormat 可选的自定义格式化函数
 */
export async function adaptMessage(
  rawMessage: any,
  options?: Partial<AiAdapterOptions>,
  customFormat?: CustomFormatFunction
) {
  if (options) {
    const adapter = createAdapterWithOptions(options);
    return adapter.adaptMessage(rawMessage, customFormat);
  }
  
  return defaultAiAdapter.adaptMessage(rawMessage, customFormat);
}

/**
 * 快速适配消息数组
 * @param rawMessages 原始消息数组
 * @param options 可选的配置参数
 * @param customFormat 可选的自定义格式化函数
 */
export async function adaptMessages(
  rawMessages: any[],
  options?: Partial<AiAdapterOptions>,
  customFormat?: CustomFormatFunction
) {
  if (options) {
    const adapter = createAdapterWithOptions(options);
    return adapter.adaptMessages(rawMessages, customFormat);
  }
  
  return defaultAiAdapter.adaptMessages(rawMessages, customFormat);
}

/**
 * 创建带有自定义配置的适配器实例
 */
function createAdapterWithOptions(options: Partial<AiAdapterOptions>) {
  return createAiAdapter({
    apiKey: '',
    model: 'qwen-turbo-2025-04-28',
    ...options
  });
}

/**
 * 更新默认适配器配置
 * @param options 新的配置选项
 */
export function updateDefaultAdapterOptions(options: Partial<AiAdapterOptions>) {
  defaultAiAdapter.updateOptions(options);
}

/**
 * 获取默认适配器配置
 */
export function getDefaultAdapterOptions() {
  return defaultAiAdapter.getOptions();
}

/**
 * 清空默认适配器缓存
 */
export function clearDefaultCache() {
  defaultAiAdapter.clearCache();
}

/**
 * 获取默认适配器缓存统计
 */
export function getDefaultCacheStats() {
  return defaultAiAdapter.getCacheStats();
}

// Vue 组件使用的组合式函数
import { ref, reactive, readonly } from 'vue';

/**
 * Vue 组合式函数：使用 AI 消息适配器
 * @param initialOptions 初始配置选项
 */
export function useAiMessageAdapter(initialOptions?: Partial<AiAdapterOptions>) {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const stats = reactive({
    totalProcessed: 0,
    successCount: 0,
    failureCount: 0,
    cacheHits: 0
  });

  // 创建适配器实例
  const adapter = initialOptions 
    ? createAdapterWithOptions(initialOptions) 
    : defaultAiAdapter;

  /**
   * 适配单个消息
   */
  const adaptMessage = async (
    rawMessage: any, 
    customFormat?: CustomFormatFunction
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await adapter.adaptMessage(rawMessage, customFormat);
      
      stats.totalProcessed++;
      if (result.success) {
        stats.successCount++;
        if (result.fromCache) {
          stats.cacheHits++;
        }
      } else {
        stats.failureCount++;
        error.value = result.error || '适配失败';
      }

      return result;
    } catch (err) {
      stats.totalProcessed++;
      stats.failureCount++;
      error.value = err instanceof Error ? err.message : '未知错误';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 适配消息数组
   */
  const adaptMessages = async (
    rawMessages: any[], 
    customFormat?: CustomFormatFunction
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const results = await adapter.adaptMessages(rawMessages, customFormat);
      
      stats.totalProcessed += results.length;
      results.forEach(result => {
        if (result.success) {
          stats.successCount++;
          if (result.fromCache) {
            stats.cacheHits++;
          }
        } else {
          stats.failureCount++;
        }
      });

      return results;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 更新配置
   */
  const updateOptions = (newOptions: Partial<AiAdapterOptions>) => {
    adapter.updateOptions(newOptions);
  };

  /**
   * 清空缓存
   */
  const clearCache = () => {
    adapter.clearCache();
  };

  /**
   * 重置统计信息
   */
  const resetStats = () => {
    stats.totalProcessed = 0;
    stats.successCount = 0;
    stats.failureCount = 0;
    stats.cacheHits = 0;
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    stats: readonly(stats),
    adaptMessage,
    adaptMessages,
    updateOptions,
    clearCache,
    resetStats
  };
}

// 兼容旧版本的导出（如果需要）
export default {
  adaptMessage,
  adaptMessages,
  defaultAiAdapter,
  createAiAdapter,
  useAiMessageAdapter
}; 