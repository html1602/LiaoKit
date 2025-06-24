import { createRouter, createWebHistory } from 'vue-router';
import ComponentsShowcase from './ComponentsShowcase.vue';
import WindowListPreview from './WindowListPreview.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ComponentsShowcase
  },
  {
    path: '/window-preview',
    name: 'WindowPreview',
    component: WindowListPreview
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 