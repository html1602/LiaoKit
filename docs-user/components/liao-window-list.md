---
title: LiaoWindowList（窗口列表）
description: 多窗口管理与布局展示容器
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoWindowList, Component]
---

# LiaoWindowList（窗口列表）

## 简介
- 管理并展示多个窗口实例，支持布局与切换

## 使用示例

### 基础用法

展示一个窗口列表（通常作为侧边栏），点击切换激活窗口。

```vue
<template>
  <div class="layout">
    <div class="sidebar">
      <LiaoWindowList 
        :initial-windows="windows"
        @window-activated="handleActivate"
      />
    </div>
    <div class="main">
      <!-- 这里渲染当前激活的 LiaoWindow -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const windows = ref([
  { id: '1', title: '客户 A', type: 'chat' },
  { id: '2', title: '订单处理', type: 'tool' }
]);

const handleActivate = (windowId) => {
  console.log('切换到窗口:', windowId);
};
</script>
```

### 结合 LiaoApp 使用

通常配合 `LiaoApp` 的 `window-mode` 使用。

```vue
<LiaoApp :window-mode="true">
  <template #sidebar>
    <LiaoWindowList ... />
  </template>
  ...
</LiaoApp>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoWindowList\LiaoWindowList.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| initialWindows | `Partial<WindowInfo>[]` | 否 | `() => []` |  |
| maxWindowCount | `number` | 否 | `10` |  |
| defaultLayout | `LayoutMode` | 否 | `free` |  |
| config | `Partial<WindowManagerConfig>` | 否 | `() => ({})` |  |
| mobileBreakpoint | `number` | 否 | `768` |  |
| autoCreateFirst | `boolean` | 否 | `true` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| window-created | `(...) => void` |
| window-closed | `(...) => void` |
| window-activated | `(...) => void` |
| window-minimized | `(...) => void` |
| window-restored | `(...) => void` |
| layout-changed | `(...) => void` |
| device-type-changed | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoWindowList/LiaoWindowList.vue`

