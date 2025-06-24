/**
 * AI 消息适配器类型定义
 * 用于处理不同业务侧消息格式的自动转换
 */

// 标准消息结构 - LiaoKit 组件要求的格式
export interface StandardMessage {
  id?: string | number;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system' | 'plugin' | string;
  isSelf?: boolean;
  avatar?: string;
  name?: string;
  time?: string | Date | number;
  status?: 'sending' | 'sent' | 'failed' | 'streaming';
  role?: 'user' | 'assistant' | 'system';
  
  // 插件相关
  pluginType?: string;
  pluginData?: any;
  pluginRequired?: boolean;
  
  // 文件相关
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  fileStatus?: 'waiting' | 'uploading' | 'success' | 'error';
  fileProgress?: number;
  fileError?: string;
  
  // 快捷操作
  quickActions?: Array<{id: string, text: string, label: string}>;
  
  // 扩展字段
  [key: string]: any;
}

// AI 适配器配置选项
export interface AiAdapterOptions {
  /** 是否启用 AI 格式化 */
  enabled?: boolean;
  
  /** LLM API 接口地址 */
  apiUrl?: string;
  
  /** LLM API Key */
  apiKey?: string;
  
  /** 选用的模型名 */
  model?: string;
  
  /** Prompt 模板 */
  promptTemplate?: string;
  
  /** 最大请求超时时间（毫秒） */
  timeoutMs?: number;
  
  /** 需要注入的额外 Header */
  extraHeaders?: Record<string, string>;
  
  /** 重试次数 */
  retryCount?: number;
  
  /** 是否启用缓存 */
  enableCache?: boolean;
  
  /** 缓存过期时间（毫秒） */
  cacheExpireMs?: number;
}

// AI 适配器响应结果
export interface AiAdapterResponse {
  /** 是否成功 */
  success: boolean;
  
  /** 标准化后的消息 */
  message?: StandardMessage;
  
  /** 错误信息 */
  error?: string;
  
  /** 原始 AI 响应 */
  rawResponse?: any;
  
  /** 是否使用了缓存 */
  fromCache?: boolean;
  
  /** 处理耗时（毫秒） */
  processingTime?: number;
}

// 通义千问 API 请求格式
export interface QwenApiRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

// 通义千问 API 响应格式
export interface QwenApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 缓存项结构
export interface CacheItem {
  key: string;
  value: StandardMessage;
  timestamp: number;
  expireAt: number;
}

// 本地适配器函数类型
export type CustomFormatFunction = (message: any) => StandardMessage | null;

// AI 适配器错误类型
export class AiAdapterError extends Error {
  public code: string;
  public originalError?: any;
  
  constructor(message: string, code: string, originalError?: any) {
    super(message);
    this.name = 'AiAdapterError';
    this.code = code;
    this.originalError = originalError;
  }
} 