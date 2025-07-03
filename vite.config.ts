import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'library';

  return {
    plugins: [
      vue(),
      // 自动导入组件
      Components({
        dts: !isLibrary, // 库模式下不生成声明文件，避免冲突
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
    build: isLibrary ? {
      // 库模式构建配置
      lib: {
        entry: path.resolve(__dirname, 'src/lib.ts'),
        name: 'LiaoKit',
        fileName: 'liaokit',
        formats: ['es', 'umd']
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue'
          },
          // 使用命名导出，避免默认导出警告
          exports: 'named',
          // 导出CSS文件
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'liaokit.css';
            return assetInfo.name || 'asset';
          }
        }
      },
      cssCodeSplit: false, // 将所有CSS打包成一个文件
      sourcemap: true, // 生成sourcemap
      // 生成类型定义文件
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境删除console调用
          drop_debugger: true, // 删除debugger语句
        },
      },
    } : {
      // 开发模式构建配置
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
  };
}); 