// 示例：在应用程序中使用LiaoKit组件库及其插件系统

import { createApp } from 'vue';
import App from './App.vue';
import LiaoKit from '../index'; // 导入组件库
import MyCustomPlugin from './MyCustomPlugin.vue'; // 导入自定义插件

// 创建Vue应用
const app = createApp(App);

// 方法1：全局安装所有组件和内置插件
app.use(LiaoKit);

// 方法2：按需导入
// import { LiaoWindow, LiaoMessageList, registerPlugin } from '../index';
// app.component('LiaoWindow', LiaoWindow);
// app.component('LiaoMessageList', LiaoMessageList);

// 注册自定义插件
// 可以在任何地方注册，只要在使用前完成注册
import { registerPlugin } from '../index';
registerPlugin('my-custom', MyCustomPlugin);

// 启动应用
app.mount('#app');

/*
 * 自定义插件开发示例：
 * 
 * 1. 创建插件组件，需要接收pluginData作为props
 * ```vue
 * <template>
 *   <div class="my-custom-plugin">
 *     <h3>{{ pluginData.title }}</h3>
 *     <button @click="handleAction">{{ pluginData.buttonText }}</button>
 *   </div>
 * </template>
 * 
 * <script lang="ts" setup>
 * const props = defineProps({
 *   pluginData: {
 *     type: Object,
 *     default: () => ({})
 *   }
 * });
 * 
 * const emit = defineEmits(['action']);
 * 
 * const handleAction = () => {
 *   emit('action', {
 *     type: 'button-click',
 *     data: { id: props.pluginData.id }
 *   });
 * };
 * </script>
 * ```
 * 
 * 2. 在应用中注册插件
 * ```ts
 * import MyCustomPlugin from './MyCustomPlugin.vue';
 * import { registerPlugin } from 'liao-kit';
 * 
 * registerPlugin('my-custom', MyCustomPlugin);
 * ```
 * 
 * 3. 在消息中使用该插件
 * ```ts
 * const customPluginMessage = {
 *   type: 'plugin',
 *   pluginType: 'my-custom',
 *   pluginData: {
 *     title: '自定义插件示例',
 *     buttonText: '点击我',
 *     id: 'custom-1'
 *   }
 * };
 * ```
 */ 