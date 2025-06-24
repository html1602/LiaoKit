import { createApp } from 'vue';
import router from './router';
import LiaoKit from '../index';

// 创建根组件
const App = {
  template: '<router-view />'
};

// 创建应用实例
const app = createApp(App);

// 使用LiaoKit组件库
app.use(LiaoKit);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app'); 