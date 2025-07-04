# LiaoIcon 组件使用指南

![版本](https://img.shields.io/badge/版本-1.2.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2023--12--13-green.svg)

## 组件介绍

LiaoIcon 是一个灵活的图标组件，支持多种图标源，包括内置SVG图标、Material Design Icons(@iconify/vue)以及自定义SVG字符串。组件提供多种样式定制选项，如大小、颜色、旋转等效果。

## 图标源优先级

组件会按以下优先级选择图标源：
1. 直接传入的 svg 字符串 (props.svg)
2. 内置图标库 (src/assets/icons/ 目录下的SVG文件)
3. Iconify 图标 (需指定完整图标名称)

## 功能特性

- 🎨 **多图标源支持**：内置多种常用图标，同时支持Iconify图标库
- 🎯 **灵活尺寸调整**：支持通过预设尺寸或自定义值调整图标大小
- 🌈 **颜色定制**：可自定义图标颜色
- 🔄 **动画效果**：支持旋转动画
- 🔌 **自定义SVG支持**：可直接传入SVG字符串
- 📏 **多种尺寸预设**：提供small、medium、large等预设尺寸

## 基础用法

```vue
<template>
  <!-- 使用内置图标 -->
  <LiaoIcon name="send" />
  
  <!-- 使用Iconify图标 -->
  <LiaoIcon name="mdi:home" />
  
  <!-- 自定义颜色和预设尺寸 -->
  <LiaoIcon 
    name="error" 
    color="#FF4D4F" 
    size="large" 
  />
  
  <!-- 带旋转效果的加载图标 -->
  <LiaoIcon 
    name="loading" 
    spin 
  />
  
  <!-- 直接使用SVG字符串 -->
  <LiaoIcon 
    :svg="<svg>...</svg>" 
  />
</template>

<script setup>
import { LiaoIcon } from '../components/LiaoIcon';
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| name | `String` | `''` | 图标名称。内置图标使用文件名(不含扩展名)，Iconify图标需使用完整名称 |
| svg | `String` | `''` | 直接传入的SVG字符串，优先级高于name |
| size | `String` | `'medium'` | 预设尺寸，可选值：'small'、'medium'、'large'、'xlarge'、'auto' |
| color | `String` | `''` | 图标颜色，支持CSS颜色值 |
| spin | `Boolean` | `false` | 是否应用旋转动画效果 |
| customClass | `String` | `''` | 自定义CSS类名 |

## 预设尺寸

| 预设尺寸 | 对应像素值 |
|---------|------------|
| small | 18px |
| medium | 20px |
| large | 24px |
| xlarge | 32px |
| auto | 1em (根据上下文自适应) |

## 内置图标使用

LiaoKit会自动扫描`src/assets/icons/`目录下的所有SVG文件，并将它们注册为可用图标。使用时，只需要指定文件名(不含`.svg`扩展名)即可：

```vue
<template>
  <LiaoIcon name="send" />
  <LiaoIcon name="emoji" />
  <LiaoIcon name="microphone" />
</template>
```

> 注意：图标名称不区分大小写，但推荐使用原始文件名的小写形式

## 添加自定义图标

### 方法一：添加到assets/icons目录（推荐）

这是最简单的方法，只需将SVG文件放入`src/assets/icons/`目录：

1. 准备SVG图标文件，推荐使用24x24像素的正方形画布
2. 优化SVG，移除不必要的属性和元数据
3. 确保SVG使用相对大小和currentColor颜色
4. 将SVG文件保存在`src/assets/icons/`目录下，如`my-icon.svg`
5. 直接使用：`<LiaoIcon name="my-icon" />`

系统会自动扫描该目录并加载所有SVG文件，不需要手动注册。

### 方法二：直接传入SVG字符串

如果只在特定组件中使用某个图标，可以直接传入SVG字符串：

```vue
<template>
  <LiaoIcon :svg="mySvgString" />
</template>

<script setup>
import { ref } from 'vue';

const mySvgString = ref('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg>');
</script>
```

### 方法三：使用utils/icons.ts注册

对于需要动态注册的图标，可以使用`utils/icons.ts`中提供的方法：

```typescript
import { registerSvgIcon, registerSvgIcons } from '../utils/icons';

// 注册单个图标
registerSvgIcon('custom-icon', '<svg>...</svg>');

// 批量注册多个图标
registerSvgIcons({
  'icon1': '<svg>...</svg>',
  'icon2': '<svg>...</svg>'
});

// 然后在组件中使用
// <LiaoIcon name="custom-icon" />
```

### 方法四：在npm包中使用自定义图标

如果您通过npm安装了LiaoKit，需要在自己的项目中添加自定义图标，可以采用以下方法：

#### A. 创建图标扩展文件

```typescript
// src/icons/customIcons.ts
import { registerSvgIcon } from 'liaokat/utils/icons';

// 注册自定义图标
export function registerCustomIcons() {
  // 方式1：直接注册SVG字符串
  registerSvgIcon('my-custom-icon', '<svg viewBox="0 0 24 24">...</svg>');
  
  // 方式2：从本地文件导入SVG（需要配置Vite/Webpack支持导入SVG）
  import myIcon from './icons/my-icon.svg?raw';
  registerSvgIcon('my-icon', myIcon);
}
```

#### B. 在应用入口处注册

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import LiaoKit from 'liaokat';
import { registerCustomIcons } from './icons/customIcons';

const app = createApp(App);
app.use(LiaoKit);

// 注册自定义图标
registerCustomIcons();

app.mount('#app');
```

#### C. 配置构建工具支持SVG导入

##### Vite配置示例：

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    // 添加raw加载器支持
    {
      name: 'vite-plugin-raw',
      transform(code, id) {
        if (id.endsWith('?raw')) {
          const filePath = id.replace(/\?raw$/, '');
          return `export default ${JSON.stringify(fs.readFileSync(filePath, 'utf-8'))};`;
        }
      }
    }
  ]
});
```

##### Webpack配置示例：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /raw/,
            type: 'asset/source'
          },
          {
            type: 'asset/resource'
          }
        ]
      }
    ]
  }
};
```

然后在代码中使用：
```typescript
import svgContent from './icons/my-icon.svg?raw';
```

#### D. 在组件中使用

```vue
<template>
  <LiaoIcon name="my-custom-icon" />
  <LiaoIcon name="my-icon" />
</template>
```

## 图标库展示

LiaoKit提供了图标库展示页面，可以查看所有可用的内置图标：

1. 访问组件展示中心
2. 点击"图标库"选项卡
3. 浏览所有可用图标
4. 可使用搜索框按名称过滤图标

## 常见问题解答

### Q: 如何查看当前可用的所有图标？
A: 访问组件展示中心的"图标库"选项卡，或使用`getAvailableIcons()`函数获取图标名称列表。

### Q: 图标颜色如何设置？
A: 有两种方式：1) 使用`color`属性设置; 2) 通过CSS设置父元素的`color`，图标会继承该颜色。

### Q: 图标不显示怎么办？
A: 检查以下几点：
   - 确认图标名称是否正确
   - 检查SVG文件是否放在正确目录
   - 确保SVG文件格式正确
   - 查看控制台是否有错误信息

### Q: 如何创建适合LiaoKit的SVG图标？
A: 推荐以下做法：
   - 使用24x24像素的画布
   - 移除所有固定颜色，使用`currentColor`
   - 移除不必要的元数据和属性
   - 使用相对尺寸

## 样式定制

LiaoIcon 组件的样式可以通过CSS变量进行定制：

```scss
:root {
  --icon-size-sm: 18px;
  --icon-size-md: 20px;
  --icon-size-lg: 24px;
  --icon-size-xl: 32px;
}
```

## 性能优化建议

- 对于频繁使用的图标，优先使用内置图标
- 使用预设尺寸而非自定义像素值
- 如需使用大量自定义图标，建议添加到assets/icons目录
- 避免频繁变更SVG内容

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge最新版本）
- 不支持IE浏览器

## 更新日志

### 1.2.0 (2023-12-13)
- 移除了单独的图标组件文件，统一使用SVG文件
- 优化了图标加载方式，提高了性能
- 增强了自定义图标注册功能，支持多种注册方式

### 1.1.0 (2023-12-13)
- 优化图标渲染方式，提高显示可靠性
- 添加图标库展示页面
- 改进SVG内容直接获取方式
- 增强错误处理和日志记录

### 1.0.0 (2023-06-08)
- 初始版本发布
- 支持内置图标和Iconify图标
- 添加自定义图标注册功能
- 实现旋转动画效果 