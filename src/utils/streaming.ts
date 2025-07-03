/**
 * LiaoKit 流式输出工具类
 * 提供流式消息的创建、管理和更新功能
 */

import type { Ref } from 'vue';
import { logger } from './logger';

// 扩展消息状态类型，添加streaming状态
export type StreamingMessageStatus = 'sending' | 'sent' | 'failed' | 'streaming';

// 流式消息接口
export interface StreamingMessage {
  id: string | number;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system' | string;
  isSelf?: boolean;
  avatar?: string;
  name?: string;
  time?: string | Date | number;
  status?: StreamingMessageStatus;
  quickActions?: Array<{id: string, text: string, label: string}>;
  pluginType?: string;
  pluginData?: any;
  [key: string]: any;
}

// 流式API接口
export interface StreamingAPI {
  /**
   * 向指定消息追加内容
   * @param messageId 消息ID
   * @param content 要追加的内容
   */
  appendToMessage(messageId: string | number, content: string): void;
  
  /**
   * 完成流式输出
   * @param messageId 消息ID
   */
  completeStreaming(messageId: string | number): void;
  
  /**
   * 设置流式错误
   * @param messageId 消息ID
   * @param error 错误信息
   */
  setStreamingError(messageId: string | number, error: string): void;
  
  /**
   * 清空消息内容（用于重新开始流式输出）
   * @param messageId 消息ID
   */
  clearMessage(messageId: string | number): void;
}

// 流式消息管理器
export class StreamingMessageManager implements StreamingAPI {
  private messages: Ref<StreamingMessage[]>;
  
  constructor(messages: Ref<StreamingMessage[]>) {
    this.messages = messages;
  }
  
  /**
   * 创建流式消息
   * @param options 消息选项
   * @returns 创建的消息对象
   */
  createStreamingMessage(options: {
    id: string | number;
    initialContent?: string;
    isSelf?: boolean;
    avatar?: string;
    name?: string;
    type?: string;
  }): StreamingMessage {
    const message: StreamingMessage = {
      id: options.id,
      content: options.initialContent || '',
      status: 'streaming',
      isSelf: options.isSelf || false,
      avatar: options.avatar || '',
      name: options.name || '',
      time: new Date(),
      type: options.type || 'text'
    };
    
    return message;
  }
  
  /**
   * 向消息列表添加流式消息
   * @param message 流式消息
   */
  addStreamingMessage(message: StreamingMessage): void {
    this.messages.value.push(message);
  }
  
  /**
   * 查找消息索引
   * @param messageId 消息ID
   * @returns 消息索引，未找到返回-1
   */
  private findMessageIndex(messageId: string | number): number {
    return this.messages.value.findIndex(msg => msg.id === messageId);
  }
  
  /**
   * 向指定消息追加内容
   */
  appendToMessage(messageId: string | number, content: string): void {
    const index = this.findMessageIndex(messageId);
    if (index >= 0) {
      // 使用响应式更新
      this.messages.value[index] = {
        ...this.messages.value[index],
        content: this.messages.value[index].content + content,
        status: 'streaming'
      };
    } else {
      logger.warn(`消息 ${messageId} 未找到，无法追加内容`);
    }
  }
  
  /**
   * 完成流式输出
   */
  completeStreaming(messageId: string | number): void {
    const index = this.findMessageIndex(messageId);
    if (index >= 0) {
      this.messages.value[index] = {
        ...this.messages.value[index],
        status: 'sent'
      };
    } else {
      logger.warn(`消息 ${messageId} 未找到，无法完成流式输出`);
    }
  }
  
  /**
   * 设置流式错误
   */
  setStreamingError(messageId: string | number, error: string): void {
    const index = this.findMessageIndex(messageId);
    if (index >= 0) {
      this.messages.value[index] = {
        ...this.messages.value[index],
        status: 'failed',
        content: this.messages.value[index].content + `\n\n❌ 错误: ${error}`
      };
    } else {
      logger.warn(`消息 ${messageId} 未找到，无法设置错误`);
    }
  }
  
  /**
   * 清空消息内容
   */
  clearMessage(messageId: string | number): void {
    const index = this.findMessageIndex(messageId);
    if (index >= 0) {
      this.messages.value[index] = {
        ...this.messages.value[index],
        content: '',
        status: 'streaming'
      };
    } else {
      logger.warn(`消息 ${messageId} 未找到，无法清空内容`);
    }
  }
  
  /**
   * 获取消息当前状态
   */
  getMessageStatus(messageId: string | number): StreamingMessageStatus | null {
    const message = this.messages.value.find(msg => msg.id === messageId);
    return message?.status || null;
  }
  
  /**
   * 检查消息是否正在流式输出
   */
  isStreaming(messageId: string | number): boolean {
    return this.getMessageStatus(messageId) === 'streaming';
  }
}

// 流式辅助工具类
export class StreamingHelper {
  /**
   * 模拟流式输出（用于演示和测试）
   * @param manager 流式管理器
   * @param messageId 消息ID
   * @param fullText 完整文本
   * @param options 模拟选项
   */
  static async simulateStreaming(
    manager: StreamingAPI,
    messageId: string | number,
    fullText: string,
    options: {
      chunkSize?: number;
      delay?: number;
      onChunk?: (chunk: string, index: number) => void;
      onComplete?: () => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<void> {
    const {
      chunkSize = 1,
      delay = 50,
      onChunk,
      onComplete,
      onError
    } = options;
    
    try {
      // 将文本分割为块
      const chunks: string[] = [];
      for (let i = 0; i < fullText.length; i += chunkSize) {
        chunks.push(fullText.slice(i, i + chunkSize));
      }
      
      // 逐块追加内容
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        manager.appendToMessage(messageId, chunk);
        
        // 调用回调
        if (onChunk) {
          onChunk(chunk, i);
        }
        
        // 等待指定时间
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // 完成流式输出
      manager.completeStreaming(messageId);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      const err = error as Error;
      manager.setStreamingError(messageId, err.message);
      
      if (onError) {
        onError(err);
      }
    }
  }
  
  /**
   * 创建打字机效果的流式输出
   * @param manager 流式管理器
   * @param messageId 消息ID
   * @param text 要显示的文本
   * @param speed 打字速度（毫秒/字符）
   */
  static async typewriterEffect(
    manager: StreamingAPI,
    messageId: string | number,
    text: string,
    speed: number = 50
  ): Promise<void> {
    return this.simulateStreaming(manager, messageId, text, {
      chunkSize: 1,
      delay: speed
    });
  }
  
  /**
   * 创建单词级别的流式输出
   * @param manager 流式管理器
   * @param messageId 消息ID
   * @param text 要显示的文本
   * @param delay 单词间延迟
   */
  static async wordByWordStreaming(
    manager: StreamingAPI,
    messageId: string | number,
    text: string,
    delay: number = 200
  ): Promise<void> {
    const words = text.split(' ');
    
    try {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const content = i === 0 ? word : ` ${word}`;
        manager.appendToMessage(messageId, content);
        
        if (i < words.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      manager.completeStreaming(messageId);
    } catch (error) {
      manager.setStreamingError(messageId, (error as Error).message);
    }
  }
}

// 导出默认工厂函数
export function createStreamingManager(messages: Ref<StreamingMessage[]>): StreamingMessageManager {
  return new StreamingMessageManager(messages);
} 