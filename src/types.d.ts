// LiaoKit 组件库类型声明
declare module '@liaokit/components' {
  import { App, Plugin } from 'vue';
  
  // 组件类型声明
  const LiaoButton: Plugin;
  const LiaoIcon: Plugin;
  const LiaoAvatar: Plugin;
  const LiaoMessageList: Plugin;
  const LiaoWindow: Plugin;
  
  // 安装函数
  function install(app: App): void;
  
  // 默认导出
  const LiaoKit: Plugin & {
    version: string;
    install: typeof install;
  };
  
  export {
    LiaoButton,
    LiaoIcon,
    LiaoAvatar,
    LiaoMessageList,
    LiaoWindow,
    install
  };
  
  export default LiaoKit;
}

// Vue 组件类型声明
declare module 'vue' {
  interface GlobalComponents {
    LiaoButton: any;
    LiaoIcon: any;
    LiaoAvatar: any;
    LiaoMessageList: any;
    LiaoWindow: any;
  }
} 