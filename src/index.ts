import type { App, Component } from 'vue';

// 导入组件
import LiaoApp from './components/LiaoApp/LiaoApp.vue';
import LiaoWindow from './components/LiaoWindow/LiaoWindow.vue';
import LiaoWindowHeader from './components/LiaoWindowHeader/LiaoWindowHeader.vue';
import LiaoMessageList from './components/LiaoMessageList/LiaoMessageList.vue';
import LiaoMessageBubble from './components/LiaoMessageBubble/LiaoMessageBubble.vue';
import LiaoTextBubble from './components/LiaoMessageBubble/LiaoTextBubble.vue';
import LiaoPluginBubble from './components/LiaoMessageBubble/LiaoPluginBubble.vue';
import LiaoImageBubble from './components/LiaoMessageBubble/LiaoImageBubble.vue';
import LiaoInputArea from './components/LiaoInputArea/LiaoInputArea.vue';
import LiaoQuickActionBar from './components/LiaoQuickActionBar/LiaoQuickActionBar.vue';
import LiaoIcon from './components/LiaoIcon/LiaoIcon.vue';
import LiaoEmojiPicker from './components/LiaoEmojiPicker/LiaoEmojiPicker.vue';

// 导入内置插件
import {
  LiaoFaqCardPlugin,
  LiaoFormPlugin,
  LiaoListPlugin,
  LiaoImageCardPlugin,
  LiaoActionsPlugin,
  LiaoVotePlugin,
  LiaoInfoPlugin,
  LiaoProgressPlugin,
  LiaoStatsPlugin,
  LiaoTimelinePlugin,
  LiaoMediaCarouselPlugin,
  LiaoPluginDebugger
} from './components/LiaoPlugins';

// 导入插件注册机制
import { 
  registerPlugin, 
  registerPlugins, 
  getPlugin, 
  installPluginRegistry, 
  hasPlugin 
} from './utils/pluginRegistry';

// 导入流式输出工具
import {
  createStreamingManager,
  StreamingMessageManager,
  StreamingHelper,
  type StreamingAPI,
  type StreamingMessage,
  type StreamingMessageStatus
} from './utils/streaming';

import {
  createSSEStreaming,
  SSEStreamingManager,
  SSEStreamingHelper,
  type SSEStreamingOptions,
  type SSEEventCallbacks,
  type SSEConnectionState,
  type SSEEvent
} from './utils/streaming-sse';

// 导入指令
import directives from './utils/directives';

// 组件列表
const components = {
  LiaoApp,
  LiaoWindow,
  LiaoWindowHeader,
  LiaoMessageList,
  LiaoMessageBubble,
  LiaoTextBubble,
  LiaoPluginBubble,
  LiaoImageBubble,
  LiaoInputArea,
  LiaoQuickActionBar,
  LiaoIcon,
  LiaoEmojiPicker
};

// 预先注册所有内置插件，确保在任何组件初始化前插件已注册
const initializePlugins = () => {
  const plugins = {
    'faq-card': LiaoFaqCardPlugin,
    'form': LiaoFormPlugin,
    'list': LiaoListPlugin,
    'image-card': LiaoImageCardPlugin,
    'actions': LiaoActionsPlugin,
    'vote': LiaoVotePlugin,
    'info': LiaoInfoPlugin,
    'progress': LiaoProgressPlugin,
    'stats': LiaoStatsPlugin,
    'timeline': LiaoTimelinePlugin,
    'media-carousel': LiaoMediaCarouselPlugin,
    'debugger': LiaoPluginDebugger
  };
  
  // 同时注册无连字符版本，增加兼容性
  const aliasPlugins = {
    'faqcard': LiaoFaqCardPlugin,
    'imagecard': LiaoImageCardPlugin,
    'mediacarousel': LiaoMediaCarouselPlugin
  };
  
  registerPlugins(plugins);
  registerPlugins(aliasPlugins);
  
  return plugins;
};

// 立即注册所有内置插件
const builtinPlugins = initializePlugins();

// 安装函数
const install = (app: App): void => {
  // 注册所有组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component as Component);
  });
  
  // 注册所有指令
  Object.entries(directives).forEach(([name, directive]) => {
    app.directive(name, directive);
  });
  
  // 安装插件注册表
  installPluginRegistry(app);
};

// 默认导出
export default {
  install,
  ...components,
  registerPlugin,
  registerPlugins,
  builtinPlugins
};

// 命名导出
export {
  // 组件
  LiaoApp,
  LiaoWindow,
  LiaoWindowHeader,
  LiaoMessageList,
  LiaoMessageBubble,
  LiaoTextBubble,
  LiaoImageBubble,
  LiaoPluginBubble,
  LiaoInputArea,
  LiaoQuickActionBar,
  LiaoIcon,
  LiaoEmojiPicker,
  
  // 内置插件
  LiaoFaqCardPlugin,
  LiaoFormPlugin,
  LiaoListPlugin,
  LiaoImageCardPlugin,
  LiaoActionsPlugin,
  LiaoVotePlugin,
  LiaoInfoPlugin,
  LiaoProgressPlugin,
  LiaoStatsPlugin,
  LiaoTimelinePlugin,
  LiaoMediaCarouselPlugin,
  LiaoPluginDebugger,
  
  // 插件注册机制
  registerPlugin,
  registerPlugins,
  getPlugin,
  hasPlugin,
  builtinPlugins
};

// 流式输出工具导出
export {
  createStreamingManager,
  StreamingMessageManager,
  StreamingHelper,
  type StreamingAPI,
  type StreamingMessage,
  type StreamingMessageStatus
} from './utils/streaming';

export {
  createSSEStreaming,
  SSEStreamingManager,
  SSEStreamingHelper,
  type SSEStreamingOptions,
  type SSEEventCallbacks,
  type SSEConnectionState,
  type SSEEvent
} from './utils/streaming-sse'; 