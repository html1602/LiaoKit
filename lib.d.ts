declare module '@yuandezuohua/liaokit' {
  import { App, Component, Ref } from 'vue';

  // 核心组件
  export const LiaoButton: Component;
  export const LiaoIcon: Component;
  export const LiaoMessageList: Component;
  export const LiaoWindow: Component;

  // 应用容器
  export const LiaoApp: Component;
  export const LiaoWindowList: Component;
  export const LiaoWindowHeader: Component;

  // 消息组件
  export const LiaoMessageBubble: Component;
  export const LiaoImageBubble: Component;
  export const LiaoPluginBubble: Component;
  export const LiaoFileBubble: Component;

  // 输入组件
  export const LiaoInputArea: Component;
  export const LiaoEmojiPicker: Component;
  export const LiaoQuickActionBar: Component;

  // 文件组件
  export const LiaoFileUpload: Component;
  export const LiaoFileChipList: Component;
  export const LiaoFilePreview: Component;

  // 插件组件
  export const LiaoProgressPlugin: Component;
  export const LiaoMediaCarouselPlugin: Component;
  export const LiaoTimelinePlugin: Component;
  export const LiaoFaqCardPlugin: Component;
  export const LiaoActionsPlugin: Component;
  export const LiaoStatsPlugin: Component;
  export const LiaoVotePlugin: Component;
  export const LiaoListPlugin: Component;
  export const LiaoImageCardPlugin: Component;
  export const LiaoInfoPlugin: Component;
  export const LiaoFormPlugin: Component;
  export const LiaoPluginDebugger: Component;

  // AI适配器类型
  export interface AiAdapterOptions {
    apiKey?: string;
    endpoint?: string;
    model?: string;
    maxRetries?: number;
    timeout?: number;
    enableCache?: boolean;
    fallbackAdapter?: Function;
  }

  export interface StandardMessage {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
    type?: string;
    [key: string]: any;
  }

  export interface AiAdapterResponse {
    success: boolean;
    data?: StandardMessage;
    error?: string;
  }

  export interface AiAdapterError {
    code: string;
    message: string;
    details?: any;
  }

  // AI适配器功能
  export class AiMessageAdapterService {
    constructor(options?: AiAdapterOptions);
    adaptMessage(message: any): Promise<StandardMessage>;
    adaptMessages(messages: any[]): Promise<StandardMessage[]>;
  }

  export function adaptMessage(message: any, options?: AiAdapterOptions): Promise<StandardMessage>;
  export function adaptMessages(messages: any[], options?: AiAdapterOptions): Promise<StandardMessage[]>;
  export function useAiMessageAdapter(options?: AiAdapterOptions): {
    processMessage: (message: any) => Promise<StandardMessage>;
    processMessages: (messages: any[]) => Promise<StandardMessage[]>;
    isLoading: Ref<boolean>;
    error: Ref<string | null>;
  };

  // 工具函数
  export function registerPlugin(name: string, component: Component): void;
  export function installPluginRegistry(app: App): void;
  export function registerIconComponents(app: App): void;
  export function registerSvgIconComponents(app: App): void;

  // 指令
  export const directives: {
    ripple: any;
  };

  // 全局安装函数
  export function install(app: App): void;

  // 默认导出
  const LiaoKit: {
    install: (app: App) => void;
    version: string;
  };

  export default LiaoKit;
} 