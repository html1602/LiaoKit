import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入组件
    Components({
      dts: true, // 生成 TypeScript 声明
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          prefix: 'icon', // 使用Icon前缀
          enabledCollections: ['mdi'], // 启用Material Design图标
          customCollections: ['liao'], // 自定义图标集合
        }),
      ],
    }),
    // 配置图标插件
    Icons({
      autoInstall: true, // 自动安装图标集
      compiler: 'vue3', // 使用Vue 3编译器
      customCollections: {
        // 自定义图标集合
        liao: FileSystemIconLoader('./src/assets/icons'),
      },
      scale: 1, // 图标缩放
      defaultClass: 'liao-icon', // 默认类名
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:color";
@use "@/styles/variables.scss" as *;` // 全局导入变量(绝对路径)
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境删除console
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'vue-i18n'],
          'iconify': ['@iconify/vue'],
        }
      }
    }
  }
}); 