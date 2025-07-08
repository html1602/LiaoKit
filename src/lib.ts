// LiaoKit 组件库 - 完整版入口，包含所有功能

// 导入核心组件
import LiaoButton from './components/LiaoButton/LiaoButton.vue';
import LiaoIcon from './components/LiaoIcon/LiaoIcon.vue';
import LiaoMessageList from './components/LiaoMessageList/LiaoMessageList.vue';
import LiaoWindow from './components/LiaoWindow/LiaoWindow.vue';

// 导入应用容器和窗口管理
import LiaoApp from './components/LiaoApp/LiaoApp.vue';
import LiaoWindowList from './components/LiaoWindowList/LiaoWindowList.vue';
import LiaoWindowHeader from './components/LiaoWindowHeader/LiaoWindowHeader.vue';

// 导入消息气泡组件
import LiaoMessageBubble from './components/LiaoMessageBubble/LiaoMessageBubble.vue';
import LiaoImageBubble from './components/LiaoMessageBubble/LiaoImageBubble.vue';
import LiaoPluginBubble from './components/LiaoMessageBubble/LiaoPluginBubble.vue';
import LiaoFileBubble from './components/LiaoMessageBubble/LiaoFileBubble.vue';

// 导入输入和交互组件
import LiaoInputArea from './components/LiaoInputArea/LiaoInputArea.vue';
import LiaoEmojiPicker from './components/LiaoEmojiPicker/LiaoEmojiPicker.vue';
import LiaoQuickActionBar from './components/LiaoQuickActionBar/LiaoQuickActionBar.vue';

// 导入文件处理组件
import LiaoFileUpload from './components/LiaoFileUpload/LiaoFileUpload.vue';
import LiaoFileChipList from './components/LiaoFileChipList/LiaoFileChipList.vue';
import LiaoFilePreview from './components/LiaoFilePreview/LiaoFilePreview.vue';

// 导入所有插件组件
import LiaoProgressPlugin from './components/LiaoPlugins/LiaoProgressPlugin.vue';
import LiaoMediaCarouselPlugin from './components/LiaoPlugins/LiaoMediaCarouselPlugin.vue';
import LiaoTimelinePlugin from './components/LiaoPlugins/LiaoTimelinePlugin.vue';
import LiaoFaqCardPlugin from './components/LiaoPlugins/LiaoFaqCardPlugin.vue';
import LiaoActionsPlugin from './components/LiaoPlugins/LiaoActionsPlugin.vue';
import LiaoStatsPlugin from './components/LiaoPlugins/LiaoStatsPlugin.vue';
import LiaoVotePlugin from './components/LiaoPlugins/LiaoVotePlugin.vue';
import LiaoListPlugin from './components/LiaoPlugins/LiaoListPlugin.vue';
import LiaoImageCardPlugin from './components/LiaoPlugins/LiaoImageCardPlugin.vue';
import LiaoInfoPlugin from './components/LiaoPlugins/LiaoInfoPlugin.vue';
import LiaoFormPlugin from './components/LiaoPlugins/LiaoFormPlugin.vue';
import LiaoPluginDebugger from './components/LiaoPlugins/LiaoPluginDebugger.vue';

// 导入工具函数和系统
import { registerPlugin, installPluginRegistry } from './utils/pluginRegistry';
import directives from './utils/directives';
import { registerIconComponents } from './components/LiaoIcon';
import { registerSvgIconComponents } from './utils/importIcons';

// 导入AI适配器核心功能
export {
  AiMessageAdapterService,
  adaptMessage,
  adaptMessages,
  useAiMessageAdapter
} from './ai-adapter';

// 导出类型
export type { 
  AiAdapterOptions,
  AiAdapterResponse,
  StandardMessage,
  AiAdapterError
} from './ai-adapter/types';

// 导出工具函数和系统
export { registerPlugin, installPluginRegistry } from './utils/pluginRegistry';
export { default as directives } from './utils/directives';
export { registerIconComponents } from './components/LiaoIcon';
export { registerSvgIconComponents } from './utils/importIcons';

// 完整组件列表
const components = [
  // 核心组件
  LiaoButton,
  LiaoIcon,
  LiaoMessageList,
  LiaoWindow,
  
  // 应用容器和窗口管理
  LiaoApp,
  LiaoWindowList,
  LiaoWindowHeader,
  
  // 消息气泡组件
  LiaoMessageBubble,
  LiaoImageBubble,
  LiaoPluginBubble,
  LiaoFileBubble,
  
  // 输入和交互组件
  LiaoInputArea,
  LiaoEmojiPicker,
  LiaoQuickActionBar,
  
  // 文件处理组件
  LiaoFileUpload,
  LiaoFileChipList,
  LiaoFilePreview,
  
  // 插件组件
  LiaoProgressPlugin,
  LiaoMediaCarouselPlugin,
  LiaoTimelinePlugin,
  LiaoFaqCardPlugin,
  LiaoActionsPlugin,
  LiaoStatsPlugin,
  LiaoVotePlugin,
  LiaoListPlugin,
  LiaoImageCardPlugin,
  LiaoInfoPlugin,
  LiaoFormPlugin,
  LiaoPluginDebugger,
];

// 全局安装方法
const install = (app: any) => {
  // 注册所有组件
  components.forEach(component => {
    const name = component.name || (component as any).__name;
    if (name) {
      app.component(name, component);
    }
  });
  
  // 注册图标组件
  registerIconComponents(app);
  
  // 注册SVG图标组件
  registerSvgIconComponents(app);
  
  // 注册内置插件
  registerPlugin('progress', LiaoProgressPlugin);
  registerPlugin('media-carousel', LiaoMediaCarouselPlugin);
  registerPlugin('info', LiaoInfoPlugin);
  registerPlugin('timeline', LiaoTimelinePlugin);
  registerPlugin('faq', LiaoFaqCardPlugin);
  registerPlugin('actions', LiaoActionsPlugin);
  registerPlugin('stats', LiaoStatsPlugin);
  registerPlugin('vote', LiaoVotePlugin);
  registerPlugin('list', LiaoListPlugin);
  registerPlugin('image-card', LiaoImageCardPlugin);
  
  // 注册全局指令
  app.directive('ripple', directives.ripple);
  
  // 安装插件注册表
  installPluginRegistry(app);
};

// 按需导出
export {
  // 核心组件
  LiaoButton,
  LiaoIcon,
  LiaoMessageList,
  LiaoWindow,
  
  // 应用容器和窗口管理
  LiaoApp,
  LiaoWindowList,
  LiaoWindowHeader,
  
  // 消息气泡组件
  LiaoMessageBubble,
  LiaoImageBubble,
  LiaoPluginBubble,
  LiaoFileBubble,
  
  // 输入和交互组件
  LiaoInputArea,
  LiaoEmojiPicker,
  LiaoQuickActionBar,
  
  // 文件处理组件
  LiaoFileUpload,
  LiaoFileChipList,
  LiaoFilePreview,
  
  // 插件组件
  LiaoProgressPlugin,
  LiaoMediaCarouselPlugin,
  LiaoTimelinePlugin,
  LiaoFaqCardPlugin,
  LiaoActionsPlugin,
  LiaoStatsPlugin,
  LiaoVotePlugin,
  LiaoListPlugin,
  LiaoImageCardPlugin,
  LiaoInfoPlugin,
  LiaoFormPlugin,
  LiaoPluginDebugger,
  
  install
};

// 默认导出
export default {
  install,
  version: '2.8.6'
}; 