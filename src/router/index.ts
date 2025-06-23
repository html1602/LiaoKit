import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ComponentsShowcase from '../examples/ComponentsShowcase.vue'
import StreamingExample from '../examples/StreamingExample.vue'
import GlobalStateDemo from '../examples/GlobalStateDemo.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 