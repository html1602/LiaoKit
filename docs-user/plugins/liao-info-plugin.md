---
title: LiaoInfoPlugin（信息插件）
description: 结构化信息展示与动作触发
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoInfoPlugin, Plugin]
---

# LiaoInfoPlugin（信息插件）

## 简介
- 展示结构化信息字段与操作按钮，支持点击事件

## 使用示例

### 基础用法

展示订单详情、用户信息等键值对结构数据。

```vue
<template>
  <LiaoInfoPlugin 
    :plugin-data="infoData" 
    @action="handleAction" 
  />
</template>

<script setup>
import { ref } from 'vue';

const infoData = ref({
  title: '订单详情',
  subtitle: 'OD20231218001',
  theme: 'info',
  items: [
    { label: '商品总额', value: '¥ 299.00' },
    { label: '运费', value: '¥ 0.00' },
    { label: '实付金额', value: '¥ 299.00', highlight: true }
  ],
  actions: [
    { id: 'logistics', label: '查看物流', type: 'primary' },
    { id: 'contact', label: '联系卖家' }
  ]
});

const handleAction = ({ action }) => {
  console.log('点击操作:', action.label);
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoInfoPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title: string;
      subtitle?: string;
      content?: string;
      items?: InfoItem[];
      sections?: InfoSection[];
      actions?: InfoAction[];
      icon?: string;
      theme?: 'default' | 'info' | 'warning' | 'success' | 'error';
      statusColor?: 'success' | 'warning' | 'error';
      footerText?: string;
      buttonText?: string;
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoInfoPlugin.vue`

