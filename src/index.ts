import type { App } from 'vue';

// 导入所有组件
import LiaoButton from './components/LiaoButton/LiaoButton.vue';
import LiaoIcon from './components/LiaoIcon/LiaoIcon.vue';
import LiaoAvatar from './components/LiaoAvatar/LiaoAvatar.vue';
import LiaoMessageList from './components/LiaoMessageList/LiaoMessageList.vue';
import LiaoWindow from './components/LiaoWindow/LiaoWindow.vue';

// 导入AI适配器
export * from './ai-adapter';

// 导入类型定义
export type { 
  WindowInfo as WindowConfig,
  LayoutMode as WindowPosition,
  WindowOperationEvent as WindowState 
} from './types/window';

// 组件列表
const components = [
  LiaoButton,
  LiaoIcon,
  LiaoAvatar,
  LiaoMessageList,
  LiaoWindow,
];

// 全局安装方法
const install = (app: App) => {
  components.forEach(component => {
    const name = component.name || (component as any).__name || (component as any).name;
    if (name) {
      app.component(name, component);
    }
  });
};

// 按需导出
export {
  LiaoButton,
  LiaoIcon,
  LiaoAvatar,
  LiaoMessageList,
  LiaoWindow,
  install
};

// 默认导出，支持 Vue.use()
export default {
  install,
  version: '2.6.1'
};

// 导入样式
import './styles/index.scss'; 