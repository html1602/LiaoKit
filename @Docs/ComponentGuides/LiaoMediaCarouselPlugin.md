# LiaoMediaCarouselPlugin 组件使用指南

![版本](https://img.shields.io/badge/版本-1.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

## 组件介绍

LiaoMediaCarouselPlugin 是一个功能丰富的媒体轮播组件，支持图片和视频的展示，具备无缝循环轮播、自动播放、触摸滑动、点击交互等特性。

## 功能特性

- 🖼️ **多媒体支持** - 支持图片和视频混合展示
- 🔄 **无缝循环** - 真正的无缝循环轮播效果
- ⚡ **自动播放** - 可配置的自动播放功能
- 📱 **触摸支持** - 移动端手势滑动操作
- 🎯 **点击交互** - 可配置的轮播项点击事件
- 🎛️ **控制按钮** - 前进/后退导航箭头
- 📍 **指示器** - 轮播位置指示器
- 🎨 **自定义样式** - 灵活的样式定制选项

## 基础用法

```vue
<template>
  <LiaoMediaCarouselPlugin
    :plugin-data="carouselData"
    @action="handleCarouselAction"
  />
</template>

<script setup>
import { ref } from 'vue'
import LiaoMediaCarouselPlugin from '@/components/LiaoPlugins/LiaoMediaCarouselPlugin.vue'

const carouselData = ref({
  title: '产品展示',
  items: [
    {
      type: 'image',
      url: 'https://example.com/image1.jpg',
      title: '产品正面',
      description: '产品的正面展示图'
    },
    {
      type: 'video',
      url: 'https://example.com/video1.mp4',
      poster: 'https://example.com/poster1.jpg',
      title: '产品演示',
      description: '产品功能演示视频'
    }
  ],
  autoplay: true,
  interval: 3000,
  showControls: true,
  showIndicators: true
})

const handleCarouselAction = (action) => {
  console.log('轮播操作:', action)
}
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| pluginData | Object | {} | 轮播配置数据对象 |
| status | String | 'normal' | 组件状态 |
| loading | Boolean | false | 是否显示加载状态 |
| readonly | Boolean | false | 是否为只读模式 |

### pluginData 配置项

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| title | String | '' | 轮播标题 |
| items | Array | [] | 媒体项目数组 |
| autoplay | Boolean | true | 是否自动播放 |
| interval | Number | 5000 | 自动播放间隔（毫秒） |
| showControls | Boolean | true | 是否显示控制按钮 |
| showIndicators | Boolean | true | 是否显示指示器 |
| enableItemClick | Boolean | true | 是否启用项目点击 |

### MediaItem 数据结构

| 属性名 | 类型 | 必填 | 说明 |
|-----|---|-----|---|
| type | String | ✅ | 媒体类型：'image' 或 'video' |
| url | String | ✅ | 媒体文件URL |
| title | String | ❌ | 媒体标题 |
| description | String | ❌ | 媒体描述 |
| poster | String | ❌ | 视频封面图（仅视频类型） |
| clickable | Boolean | ❌ | 是否可点击（默认true） |
| clickData | Any | ❌ | 点击时传递的自定义数据 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action | ActionData | 轮播操作事件 |

### ActionData 事件数据

#### carousel-change 事件
```javascript
{
  type: 'carousel-change',
  data: {
    index: 0,        // 当前轮播索引
    item: {...}      // 当前轮播项数据
  }
}
```

#### carousel-item-click 事件
```javascript
{
  type: 'carousel-item-click',
  data: {
    index: 0,           // 点击项的索引
    item: {...},        // 点击项的完整数据
    clickData: {...},   // 自定义点击数据
    currentSlide: 0,    // 当前轮播位置
    totalSlides: 5      // 总轮播数量
  }
}
```

## 高级用法

### 1. 带点击交互的轮播

```vue
<template>
  <LiaoMediaCarouselPlugin
    :plugin-data="interactiveCarousel"
    @action="handleInteraction"
  />
</template>

<script setup>
const interactiveCarousel = ref({
  title: '可交互产品展示',
  items: [
    {
      type: 'image',
      url: '/images/product-front.jpg',
      title: '产品正面',
      description: '点击查看详细信息',
      clickable: true,
      clickData: {
        productId: 'prod-001',
        viewType: 'front',
        action: 'view_detail'
      }
    },
    {
      type: 'image',
      url: '/images/product-side.jpg',
      title: '产品侧面',
      description: '点击查看规格参数',
      clickable: true,
      clickData: {
        productId: 'prod-001',
        viewType: 'side',
        action: 'view_specs',
        specs: {
          width: '20cm',
          height: '15cm',
          weight: '500g'
        }
      }
    },
    {
      type: 'image',
      url: '/images/package.jpg',
      title: '包装展示',
      description: '此图片不可点击',
      clickable: false
    }
  ],
  enableItemClick: true,
  autoplay: false
})

const handleInteraction = (action) => {
  if (action.type === 'carousel-item-click') {
    const { clickData, index } = action.data
    
    switch (clickData.action) {
      case 'view_detail':
        // 跳转到详情页
        router.push(`/product/${clickData.productId}/detail`)
        break
      case 'view_specs':
        // 显示规格弹窗
        showSpecsModal(clickData.specs)
        break
    }
  }
}
</script>
```

### 2. 视频轮播配置

```vue
<script setup>
const videoCarousel = ref({
  title: '产品演示视频',
  items: [
    {
      type: 'video',
      url: '/videos/demo1.mp4',
      poster: '/images/video-poster1.jpg',
      title: '功能演示',
      description: '产品核心功能展示',
      clickable: true,
      clickData: {
        videoId: 'demo1',
        action: 'play_fullscreen'
      }
    },
    {
      type: 'video',
      url: '/videos/tutorial.mp4',
      poster: '/images/video-poster2.jpg',
      title: '使用教程',
      description: '详细使用指南',
      clickable: true,
      clickData: {
        videoId: 'tutorial',
        action: 'open_tutorial'
      }
    }
  ],
  autoplay: false, // 视频轮播建议关闭自动播放
  showControls: true,
  showIndicators: true
})
</script>
```

### 3. 自定义样式

```vue
<template>
  <LiaoMediaCarouselPlugin
    :plugin-data="carouselData"
    class="custom-carousel"
    @action="handleAction"
  />
</template>

<style scoped>
.custom-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.custom-carousel :deep(.liao-media-carousel-plugin-caption) {
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 20px;
}

.custom-carousel :deep(.liao-media-carousel-plugin-arrow) {
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  width: 50px;
  height: 50px;
}

.custom-carousel :deep(.liao-media-carousel-plugin-indicator-active) {
  background-color: #ff6b6b;
  transform: scale(1.5);
}
</style>
```

## 样式定制

### CSS 变量

组件支持通过 CSS 变量进行样式定制：

```css
.liao-media-carousel-plugin {
  --carousel-border-radius: 8px;
  --carousel-arrow-size: 40px;
  --carousel-arrow-bg: rgba(0, 0, 0, 0.3);
  --carousel-indicator-size: 8px;
  --carousel-indicator-color: rgba(24, 144, 255, 0.3);
  --carousel-indicator-active-color: #1890ff;
}
```

### 主要样式类

| 类名 | 说明 |
|-----|---|
| `.liao-media-carousel-plugin` | 根容器 |
| `.liao-media-carousel-plugin-header` | 标题区域 |
| `.liao-media-carousel-plugin-container` | 轮播容器 |
| `.liao-media-carousel-plugin-items` | 轮播项容器 |
| `.liao-media-carousel-plugin-item` | 单个轮播项 |
| `.liao-media-carousel-plugin-item-clickable` | 可点击的轮播项 |
| `.liao-media-carousel-plugin-arrow` | 导航箭头 |
| `.liao-media-carousel-plugin-indicators` | 指示器容器 |
| `.liao-media-carousel-plugin-indicator` | 单个指示器 |
| `.liao-media-carousel-plugin-caption` | 标题描述区域 |

## 注意事项

1. **性能优化**：
   - 大量图片时建议使用懒加载
   - 视频文件建议提供合适的 poster 封面
   - 自动播放时注意内存占用

2. **无障碍访问**：
   - 为图片提供有意义的 alt 属性
   - 确保键盘导航可用
   - 提供适当的 ARIA 标签

3. **移动端适配**：
   - 组件已支持触摸滑动
   - 在移动端建议适当调整控制按钮大小
   - 注意视频在移动端的播放策略

4. **浏览器兼容性**：
   - 支持现代浏览器
   - IE11+ 需要 polyfill 支持
   - 视频格式建议使用 MP4

## 最佳实践

1. **图片优化**：
   ```javascript
   // 建议的图片配置
   {
     type: 'image',
     url: '/images/product-large.jpg',
     title: '产品展示',
     description: '高清产品图片',
     clickData: {
       largeImageUrl: '/images/product-xl.jpg', // 点击查看大图
       action: 'view_large'
     }
   }
   ```

2. **视频配置**：
   ```javascript
   // 建议的视频配置
   {
     type: 'video',
     url: '/videos/demo.mp4',
     poster: '/images/video-cover.jpg', // 重要：提供封面
     title: '产品演示',
     clickData: {
       duration: '2:30',
       quality: '1080p',
       action: 'track_play'
     }
   }
   ```

3. **点击事件处理**：
   ```javascript
   const handleCarouselAction = (action) => {
     if (action.type === 'carousel-item-click') {
       // 统计点击事件
       analytics.track('carousel_item_click', {
         index: action.data.index,
         itemType: action.data.item.type,
         customAction: action.data.clickData?.action
       })
       
       // 执行相应操作
       executeAction(action.data.clickData)
     }
   }
   ```

## 更新日志

### 1.0.0 (2025-06-16)
- ✨ 新增轮播项点击事件功能
- ✨ 支持自定义点击数据传递
- ✨ 实现无缝循环轮播效果
- ✨ 添加触摸滑动支持
- ✨ 支持图片和视频混合展示
- 🎨 优化可点击项的视觉反馈
- 📚 完善组件文档和示例 