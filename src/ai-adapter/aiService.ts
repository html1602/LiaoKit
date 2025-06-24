/**
 * AI 服务调用模块
 * 负责与通义千问 API 的通信和数据处理
 * 
 * ⚠️ 安全说明：
 * 本模块在浏览器环境中使用 OpenAI SDK，已启用 dangerouslyAllowBrowser 选项。
 * 在生产环境中，建议：
 * 1. 使用环境变量管理 API Key
 * 2. 通过后端代理 API 调用，避免在前端暴露 API Key
 * 3. 实施适当的访问控制和速率限制
 * 4. 定期轮换 API Key
 */

import OpenAI from 'openai';
import type { 
  AiAdapterOptions, 
  AiAdapterResponse, 
  StandardMessage,
  QwenApiRequest,
  QwenApiResponse,
  CacheItem,
  CustomFormatFunction
} from './types';
import { AiAdapterError } from './types';
import { generatePrompt } from './promptTemplates';

/**
 * Unicode 安全的 Base64 编码函数
 * 解决 btoa() 无法处理中文等 Unicode 字符的问题
 */
function safeBase64Encode(str: string): string {
  try {
    // 先尝试直接使用 btoa（适用于纯 ASCII 字符）
    return btoa(str);
  } catch (error) {
    // 如果失败，使用 TextEncoder 处理 Unicode 字符
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    
    // 将字节数组转换为二进制字符串
    let binaryString = '';
    for (let i = 0; i < data.length; i++) {
      binaryString += String.fromCharCode(data[i]);
    }
    
    try {
      return btoa(binaryString);
    } catch (secondError) {
      // 最后的兜底方案：使用简单的哈希算法
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
      }
      return Math.abs(hash).toString(36);
    }
  }
}

// 缓存管理类
class MessageCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 1000; // 最大缓存条目数

  // 生成缓存键
  private generateKey(message: any, options: AiAdapterOptions): string {
    const messageStr = JSON.stringify(message);
    const optionsStr = JSON.stringify({
      model: options.model,
      promptTemplate: options.promptTemplate
    });
    
    const combinedStr = messageStr + optionsStr;
    return safeBase64Encode(combinedStr).replace(/[^a-zA-Z0-9]/g, '');
  }

  // 获取缓存
  get(message: any, options: AiAdapterOptions): StandardMessage | null {
    if (!options.enableCache) return null;

    const key = this.generateKey(message, options);
    const item = this.cache.get(key);

    if (!item) return null;

    // 检查是否过期
    if (Date.now() > item.expireAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  // 设置缓存
  set(message: any, options: AiAdapterOptions, result: StandardMessage): void {
    if (!options.enableCache) return;

    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const keys = Array.from(this.cache.keys());
      const firstKey = keys[0];
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const key = this.generateKey(message, options);
    const expireMs = options.cacheExpireMs || 60 * 60 * 1000; // 默认1小时过期
    
    this.cache.set(key, {
      key,
      value: result,
      timestamp: Date.now(),
      expireAt: Date.now() + expireMs
    });
  }

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (now > item.expireAt) {
        this.cache.delete(key);
      }
    }
  }

  // 清空缓存
  clear(): void {
    this.cache.clear();
  }
}

// 全局缓存实例
const messageCache = new MessageCache();

// 默认配置
const DEFAULT_OPTIONS: Required<AiAdapterOptions> = {
  enabled: true,
  apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: '',
  model: 'qwen-turbo-2025-04-28',
  promptTemplate: '',
  timeoutMs: 10000,
  extraHeaders: {},
  retryCount: 2,
  enableCache: true,
  cacheExpireMs: 60 * 60 * 1000 // 1小时
};

/**
 * AI 消息格式适配服务类
 */
export class AiMessageAdapterService {
  private options: Required<AiAdapterOptions>;
  private openaiClient: OpenAI;

  constructor(options: AiAdapterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // 初始化 OpenAI 客户端
    this.openaiClient = new OpenAI({
      apiKey: this.options.apiKey,
      baseURL: this.options.apiUrl,
      timeout: this.options.timeoutMs,
      defaultHeaders: this.options.extraHeaders,
      dangerouslyAllowBrowser: true // 允许在浏览器环境中使用
    });
    
    // 定期清理过期缓存
    if (this.options.enableCache) {
      setInterval(() => messageCache.cleanup(), 5 * 60 * 1000); // 每5分钟清理一次
    }
  }

  /**
   * 更新配置
   */
  updateOptions(newOptions: Partial<AiAdapterOptions>): void {
    this.options = { ...this.options, ...newOptions };
    
    // 如果API相关配置发生变化，重新初始化OpenAI客户端
    const hasApiConfigChange = (
      newOptions.apiKey !== undefined ||
      newOptions.apiUrl !== undefined ||
      newOptions.timeoutMs !== undefined ||
      newOptions.extraHeaders !== undefined
    );
    
    if (hasApiConfigChange) {
      this.openaiClient = new OpenAI({
        apiKey: this.options.apiKey,
        baseURL: this.options.apiUrl,
        timeout: this.options.timeoutMs,
        defaultHeaders: this.options.extraHeaders,
        dangerouslyAllowBrowser: true // 允许在浏览器环境中使用
      });
    }
  }

  /**
   * 获取当前配置
   */
  getOptions(): AiAdapterOptions {
    return { ...this.options };
  }

  /**
   * 主要的消息适配方法
   */
  async adaptMessage(
    rawMessage: any, 
    customFormat?: CustomFormatFunction
  ): Promise<AiAdapterResponse> {
    const startTime = Date.now();

    try {
      // 如果未启用 AI 适配，直接使用自定义格式器或返回原始消息
      if (!this.options.enabled) {
        return this.handleWithoutAi(rawMessage, customFormat);
      }

      // 检查 API Key 是否配置
      if (!this.options.apiKey || this.options.apiKey.trim() === '') {
        console.info('API Key 未配置，使用兜底方案处理消息');
        return this.handleWithoutAi(rawMessage, customFormat);
      }

      // 检查缓存
      const cachedResult = messageCache.get(rawMessage, this.options);
      if (cachedResult) {
        return {
          success: true,
          message: cachedResult,
          fromCache: true,
          processingTime: Date.now() - startTime
        };
      }

      // 使用 AI 进行格式适配
      const result = await this.callAiAdapter(rawMessage);
      
      // 缓存结果
      if (result.success && result.message) {
        messageCache.set(rawMessage, this.options, result.message);
      }

      return {
        ...result,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.warn('AI 消息适配失败，尝试使用兜底方案:', error);
      
      // AI 失败时的兜底处理
      const fallbackResult = this.handleWithoutAi(rawMessage, customFormat);
      return {
        ...fallbackResult,
        error: error instanceof Error ? error.message : '未知错误',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * 批量适配消息
   */
  async adaptMessages(
    rawMessages: any[], 
    customFormat?: CustomFormatFunction
  ): Promise<AiAdapterResponse[]> {
    const promises = rawMessages.map(message => 
      this.adaptMessage(message, customFormat)
    );

    return Promise.all(promises);
  }

  /**
   * 调用 AI 进行消息适配
   */
  private async callAiAdapter(rawMessage: any): Promise<AiAdapterResponse> {
    let lastError: Error | null = null;

    // 重试机制
    for (let attempt = 0; attempt <= this.options.retryCount; attempt++) {
      try {
        // 生成 Prompt
        const prompt = generatePrompt(rawMessage, this.options.promptTemplate);

        // 构建请求数据
        const requestData: QwenApiRequest = {
          model: this.options.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1, // 低温度保证输出稳定性
          max_tokens: 1000,
          stream: false
        };

        // 发送请求
        const response = await this.makeApiRequest(requestData);
        
        // 解析响应
        const standardMessage = this.parseAiResponse(response, rawMessage);
        
        return {
          success: true,
          message: standardMessage,
          rawResponse: response
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('未知错误');
        
        if (attempt < this.options.retryCount) {
          // 重试前等待一段时间
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new AiAdapterError(
      `AI 适配失败，已重试 ${this.options.retryCount} 次: ${lastError?.message}`,
      'AI_ADAPTER_FAILED',
      lastError
    );
  }

  /**
   * 发送 API 请求（使用 OpenAI SDK）
   */
  private async makeApiRequest(requestData: QwenApiRequest): Promise<QwenApiResponse> {
    try {
      // 使用 OpenAI SDK 调用通义千问 API，确保非流式响应
      const completion = await this.openaiClient.chat.completions.create({
        model: requestData.model,
        messages: requestData.messages,
        temperature: requestData.temperature,
        max_tokens: requestData.max_tokens,
        stream: false // 强制非流式响应
      });

      // 类型断言，确保是非流式响应
      const chatCompletion = completion as OpenAI.Chat.Completions.ChatCompletion;

      // 将 OpenAI 格式的响应转换为我们的 QwenApiResponse 格式
      const response: QwenApiResponse = {
        id: chatCompletion.id,
        object: chatCompletion.object,
        created: chatCompletion.created,
        model: chatCompletion.model,
        choices: chatCompletion.choices.map((choice, index) => ({
          index: choice.index ?? index,
          message: {
            role: choice.message.role,
            content: choice.message.content || ''
          },
          finish_reason: choice.finish_reason || 'stop'
        })),
        usage: chatCompletion.usage ? {
          prompt_tokens: chatCompletion.usage.prompt_tokens,
          completion_tokens: chatCompletion.usage.completion_tokens,
          total_tokens: chatCompletion.usage.total_tokens
        } : {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };

      return response;

    } catch (error) {
      // 处理 OpenAI SDK 的错误
      if (error instanceof Error) {
        // 检查是否为超时错误
        if (error.message.includes('timeout') || error.message.includes('ECONNABORTED')) {
          throw new AiAdapterError(
            `请求超时 (${this.options.timeoutMs}ms)`,
            'REQUEST_TIMEOUT'
          );
        }
        
        // 检查是否为API错误
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          throw new AiAdapterError(
            'API Key 无效或已过期',
            'INVALID_API_KEY'
          );
        }
        
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          throw new AiAdapterError(
            'API 调用频率超限',
            'RATE_LIMIT_EXCEEDED'
          );
        }
        
        // 其他 API 错误
        throw new AiAdapterError(
          `API 请求失败: ${error.message}`,
          'API_REQUEST_FAILED'
        );
      }
      
      throw error;
    }
  }

  /**
   * 解析 AI 响应
   */
  private parseAiResponse(response: QwenApiResponse, originalMessage: any): StandardMessage {
    try {
      const content = response.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new AiAdapterError('AI 响应内容为空', 'EMPTY_AI_RESPONSE');
      }

      // 尝试解析 JSON
      let parsedMessage: StandardMessage;
      
      try {
        // 清理响应内容，移除可能的 markdown 格式
        const cleanContent = content
          .replace(/```json\s*/g, '')
          .replace(/```\s*$/g, '')
          .trim();
          
        parsedMessage = JSON.parse(cleanContent);
      } catch (parseError) {
        // JSON 解析失败，创建基础消息格式
        parsedMessage = {
          content: content,
          type: 'text',
          isSelf: false
        };
      }

      // 验证和修正必要字段
      return this.validateAndFixMessage(parsedMessage, originalMessage);

    } catch (error) {
      throw new AiAdapterError(
        `解析 AI 响应失败: ${error instanceof Error ? error.message : '未知错误'}`,
        'PARSE_AI_RESPONSE_FAILED',
        error
      );
    }
  }

  /**
   * 验证和修正消息格式
   */
  private validateAndFixMessage(message: any, originalMessage: any): StandardMessage {
    const result: StandardMessage = {
      content: message.content || originalMessage.content || originalMessage.text || originalMessage.msg || '[无内容]',
      type: message.type || 'text',
      isSelf: Boolean(message.isSelf),
    };

    // 复制其他有效字段
    const optionalFields = [
      'id', 'avatar', 'name', 'time', 'status', 'role',
      'pluginType', 'pluginData', 'pluginRequired',
      'fileName', 'fileSize', 'fileType', 'fileUrl', 'fileStatus', 'fileProgress', 'fileError',
      'quickActions'
    ];

    for (const field of optionalFields) {
      if (message[field] !== undefined) {
        result[field] = message[field];
      }
    }

    return result;
  }

  /**
   * 不使用 AI 的处理逻辑
   */
  private handleWithoutAi(
    rawMessage: any, 
    customFormat?: CustomFormatFunction
  ): AiAdapterResponse {
    try {
      // 优先使用自定义格式器
      if (customFormat) {
        const result = customFormat(rawMessage);
        if (result) {
          return {
            success: true,
            message: result
          };
        }
      }

      // 使用简单的本地适配逻辑
      const message = this.simpleMessageAdapter(rawMessage);
      
      return {
        success: true,
        message
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '处理失败'
      };
    }
  }

  /**
   * 简单的本地消息适配器（兜底方案）
   */
  private simpleMessageAdapter(rawMessage: any): StandardMessage {
    // 如果已经是标准格式，直接返回
    if (this.isStandardMessage(rawMessage)) {
      return rawMessage;
    }

    // 基础的格式转换逻辑
    const result: StandardMessage = {
      content: this.extractContent(rawMessage),
      type: this.guessMessageType(rawMessage),
      isSelf: this.guessSender(rawMessage),
    };

    // 提取其他字段
    this.extractOptionalFields(rawMessage, result);

    return result;
  }

  /**
   * 检查是否已经是标准消息格式
   */
  private isStandardMessage(message: any): boolean {
    return message && 
           typeof message === 'object' && 
           typeof message.content === 'string';
  }

  /**
   * 提取消息内容
   */
  private extractContent(message: any): string {
    const contentFields = ['content', 'text', 'message', 'msg', 'data', 'body'];
    
    for (const field of contentFields) {
      if (message[field] && typeof message[field] === 'string') {
        return message[field];
      }
    }

    return JSON.stringify(message);
  }

  /**
   * 猜测消息类型
   */
  private guessMessageType(message: any): string {
    if (message.type) return message.type;

    // 基于字段推断类型
    if (message.imageUrl || message.image || message.pic) return 'image';
    if (message.fileName || message.file || message.attachment) return 'file';
    if (message.system || message.notice) return 'system';
    if (message.pluginType || message.plugin) return 'plugin';

    return 'text';
  }

  /**
   * 猜测发送者
   */
  private guessSender(message: any): boolean {
    if (typeof message.isSelf === 'boolean') return message.isSelf;

    const role = message.role || message.from || message.sender;
    if (role === 'user' || role === 'self') return true;
    if (role === 'assistant' || role === 'bot' || role === 'ai') return false;

    return false; // 默认为他人消息
  }

  /**
   * 提取可选字段
   */
  private extractOptionalFields(source: any, target: StandardMessage): void {
    const fieldMappings = {
      id: ['id', '_id', 'messageId'],
      avatar: ['avatar', 'avatarUrl', 'profile_pic', 'icon'],
      name: ['name', 'username', 'nickname', 'from_name', 'sender_name'],
      time: ['time', 'timestamp', 'created_at', 'date', 'createdAt'],
      status: ['status', 'state', 'messageStatus'],
      role: ['role', 'userRole']
    };

    for (const [targetField, sourceFields] of Object.entries(fieldMappings)) {
      for (const sourceField of sourceFields) {
        if (source[sourceField] !== undefined) {
          target[targetField] = source[sourceField];
          break;
        }
      }
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    messageCache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { size: number; hits: number } {
    // 这里可以实现更详细的统计信息
    return {
      size: messageCache['cache'].size,
      hits: 0 // 可以添加命中次数统计
    };
  }
}

// 创建默认实例（需要用户配置API Key才能使用）
export const defaultAiAdapter = new AiMessageAdapterService({
  apiKey: '', // 请配置您的 API Key
  model: 'qwen-turbo-2025-04-28'
});

// 导出工厂函数
export function createAiAdapter(options: AiAdapterOptions): AiMessageAdapterService {
  return new AiMessageAdapterService(options);
} 