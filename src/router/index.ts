import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ComponentsShowcase from '../examples/ComponentsShowcase.vue'
import StreamingExample from '../examples/StreamingExample.vue'
import GlobalStateDemo from '../examples/GlobalStateDemo.vue'
import WindowListPreview from '../examples/WindowListPreview.vue'

/**
 * 路由表定义
 *
 * 说明：注册主站页面与演示页面，包括“多窗口预览”。
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/showcase',
    name: 'ComponentsShowcase',
    component: ComponentsShowcase
  },
  {
    path: '/streaming',
    name: 'StreamingExample',
    component: StreamingExample
  },
  {
    path: '/global-state',
    name: 'GlobalStateDemo',
    component: GlobalStateDemo
  }
  ,
  {
    // 多窗口预览演示页面
    path: '/window-preview',
    name: 'WindowListPreview',
    component: WindowListPreview
  }
]

/**
 * 创建并导出应用路由实例
 *
 * 功能：使用 HTML5 History 路由模式，挂载上面的路由表。
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router