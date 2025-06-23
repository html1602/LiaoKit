/**
 * LiaoKit SSE 流式输出扩展工具
 * 基于 Server-Sent Events 的标准化流式输出实现
 */

import type { StreamingAPI } from './streaming';

// SSE事件类型
export interface SSEEvent {
  id?: string;
  event?: string;
  data: string;
  retry?: number;
}

// SSE配置选项
export interface SSEStreamingOptions {
  /**
   * 最大重连次数
   */
  maxRetries?: number;
  
  /**
   * 重连延迟（毫秒）
   */
  retryDelay?: number;
  
  /**
   * 连接超时时间（毫秒）
   */
  timeout?: number;
  
  /**
   * 是否在页面隐藏时暂停连接
   */
  pauseOnHidden?: boolean;
  
  /**
   * 自定义请求头
   */
  headers?: Record<string, string>;
  
  /**
   * 认证信息
   */
  withCredentials?: boolean;
}

// SSE连接状态
export type SSEConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error' | 'closed';

// SSE事件回调
export interface SSEEventCallbacks {
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event | Error) => void;
  onClose?: () => void;
  onStateChange?: (state: SSEConnectionState) => void;
  onRetry?: (attempt: number, maxRetries: number) => void;
}

/**
 * SSE流式输出管理器
 */
export class SSEStreamingManager {
  private eventSource: EventSource | null = null;
  private streamingAPI: StreamingAPI;
  private options: Required<SSEStreamingOptions>;
  private callbacks: SSEEventCallbacks;
  private currentState: SSEConnectionState = 'disconnected';
  private retryCount = 0;
  private retryTimer: number | null = null;
  private isManualClose = false;
  
  constructor(
    streamingAPI: StreamingAPI,
    options: SSEStreamingOptions = {},
    callbacks: SSEEventCallbacks = {}
  ) {
    this.streamingAPI = streamingAPI;
    this.callbacks = callbacks;
    
    // 设置默认选项
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      pauseOnHidden: true,
      headers: {},
      withCredentials: false,
      ...options
    };
    
    // 监听页面可见性变化
    if (this.options.pauseOnHidden) {
      this.setupVisibilityListener();
    }
  }
  
  /**
   * 开始SSE流式连接
   * @param endpoint SSE端点URL
   * @param messageId 消息ID
   */
  startStreaming(endpoint: string, messageId: string | number): void {
    this.isManualClose = false;
    this.connect(endpoint, messageId);
  }
  
  /**
   * 停止SSE连接
   */
  stopStreaming(): void {
    this.isManualClose = true;
    this.disconnect();
  }
  
  /**
   * 获取当前连接状态
   */
  getState(): SSEConnectionState {
    return this.currentState;
  }
  
  /**
   * 建立SSE连接
   */
  private connect(endpoint: string, messageId: string | number): void {
    try {
      this.setState('connecting');
      
      // 创建EventSource连接
      this.eventSource = new EventSource(endpoint, {
        withCredentials: this.options.withCredentials
      });
      
      // 设置连接超时
      const timeoutId = setTimeout(() => {
        if (this.currentState === 'connecting') {
          this.handleError(new Error('连接超时'));
        }
      }, this.options.timeout);
      
      // 连接打开事件
      this.eventSource.onopen = () => {
        clearTimeout(timeoutId);
        this.setState('connected');
        this.retryCount = 0;
        this.callbacks.onOpen?.();
      };
      
      // 接收消息事件
      this.eventSource.onmessage = (event) => {
        this.handleMessage(event, messageId);
        this.callbacks.onMessage?.(event);
      };
      
      // 错误事件
      this.eventSource.onerror = (event) => {
        clearTimeout(timeoutId);
        this.handleError(event);
      };
      
      // 监听自定义事件
      this.setupCustomEventListeners(messageId);
      
    } catch (error) {
      this.handleError(error as Error);
    }
  }
  
  /**
   * 断开SSE连接
   */
  private disconnect(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.setState('closed');
    this.callbacks.onClose?.();
  }
  
  /**
   * 处理接收到的消息
   */
  private handleMessage(event: MessageEvent, messageId: string | number): void {
    try {
      const data = JSON.parse(event.data);
      
      // 根据消息类型处理
      switch (data.type) {
        case 'content':
          // 追加内容
          if (data.content) {
            this.streamingAPI.appendToMessage(messageId, data.content);
          }
          break;
          
        case 'complete':
          // 完成流式输出
          this.streamingAPI.completeStreaming(messageId);
          this.stopStreaming();
          break;
          
        case 'error':
          // 错误处理
          this.streamingAPI.setStreamingError(messageId, data.error || '未知错误');
          this.stopStreaming();
          break;
          
        case 'clear':
          // 清空消息（重新开始）
          this.streamingAPI.clearMessage(messageId);
          break;
          
        default:
          console.warn('未知的SSE消息类型:', data.type);
      }
    } catch (error) {
      console.error('解析SSE消息失败:', error);
      // 如果解析失败，直接作为文本内容追加
      this.streamingAPI.appendToMessage(messageId, event.data);
    }
  }
  
  /**
   * 处理错误
   */
  private handleError(error: Event | Error): void {
    this.setState('error');
    this.callbacks.onError?.(error);
    
    // 如果不是手动关闭，尝试重连
    if (!this.isManualClose && this.retryCount < this.options.maxRetries) {
      this.scheduleRetry();
    } else {
      this.setState('disconnected');
    }
  }
  
  /**
   * 安排重连
   */
  private scheduleRetry(): void {
    this.retryCount++;
    this.callbacks.onRetry?.(this.retryCount, this.options.maxRetries);
    
    this.retryTimer = window.setTimeout(() => {
      if (!this.isManualClose) {
        // 这里需要保存endpoint和messageId以便重连
        // 实际实现中可能需要重构以支持重连
        console.log(`正在重连... (${this.retryCount}/${this.options.maxRetries})`);
      }
    }, this.options.retryDelay * this.retryCount);
  }
  
  /**
   * 设置连接状态
   */
  private setState(state: SSEConnectionState): void {
    this.currentState = state;
    this.callbacks.onStateChange?.(state);
  }
  
  /**
   * 设置自定义事件监听器
   */
  private setupCustomEventListeners(messageId: string | number): void {
    if (!this.eventSource) return;
    
    // 监听流式内容事件
    this.eventSource.addEventListener('stream', (event) => {
      this.handleMessage(event as MessageEvent, messageId);
    });
    
    // 监听完成事件
    this.eventSource.addEventListener('complete', () => {
      this.streamingAPI.completeStreaming(messageId);
      this.stopStreaming();
    });
    
    // 监听错误事件
    this.eventSource.addEventListener('error', (event) => {
      const data = JSON.parse((event as MessageEvent).data);
      this.streamingAPI.setStreamingError(messageId, data.message || '流式输出错误');
      this.stopStreaming();
    });
  }
  
  /**
   * 设置页面可见性监听
   */
  private setupVisibilityListener(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // 页面隐藏时暂停连接
          if (this.currentState === 'connected') {
            this.eventSource?.close();
            this.setState('disconnected');
          }
        } else {
          // 页面显示时恢复连接
          if (this.currentState === 'disconnected' && !this.isManualClose) {
            // 这里需要重连逻辑
            console.log('页面显示，尝试恢复SSE连接');
          }
        }
      });
    }
  }
}

/**
 * SSE流式输出工具类
 */
export class SSEStreamingHelper {
  /**
   * 创建SSE流式输出管理器
   * @param streamingAPI 流式API实例
   * @param options SSE选项
   * @param callbacks 事件回调
   * @returns SSE管理器实例
   */
  static create(
    streamingAPI: StreamingAPI,
    options?: SSEStreamingOptions,
    callbacks?: SSEEventCallbacks
  ): SSEStreamingManager {
    return new SSEStreamingManager(streamingAPI, options, callbacks);
  }
  
  /**
   * 快速创建SSE流式输出
   * @param streamingAPI 流式API实例
   * @param endpoint SSE端点
   * @param messageId 消息ID
   * @param options 配置选项
   * @returns 管理器实例
   */
  static quickStart(
    streamingAPI: StreamingAPI,
    endpoint: string,
    messageId: string | number,
    options?: SSEStreamingOptions & SSEEventCallbacks
  ): SSEStreamingManager {
    const { onOpen, onMessage, onError, onClose, onStateChange, onRetry, ...sseOptions } = options || {};
    
    const callbacks: SSEEventCallbacks = {
      onOpen,
      onMessage,
      onError,
      onClose,
      onStateChange,
      onRetry
    };
    
    const manager = new SSEStreamingManager(streamingAPI, sseOptions, callbacks);
    manager.startStreaming(endpoint, messageId);
    
    return manager;
  }
  
  /**
   * 解析SSE事件数据
   * @param eventData 事件数据字符串
   * @returns 解析后的事件对象
   */
  static parseEventData(eventData: string): SSEEvent {
    const lines = eventData.split('\n');
    const event: SSEEvent = { data: '' };
    
    for (const line of lines) {
      if (line.startsWith('id:')) {
        event.id = line.slice(3).trim();
      } else if (line.startsWith('event:')) {
        event.event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        event.data += line.slice(5).trim() + '\n';
      } else if (line.startsWith('retry:')) {
        event.retry = parseInt(line.slice(6).trim(), 10);
      }
    }
    
    // 移除末尾的换行符
    event.data = event.data.replace(/\n$/, '');
    
    return event;
  }
}

// 导出工厂函数
export function createSSEStreaming(
  streamingAPI: StreamingAPI,
  options?: SSEStreamingOptions,
  callbacks?: SSEEventCallbacks
): SSEStreamingManager {
  return SSEStreamingHelper.create(streamingAPI, options, callbacks);
} 