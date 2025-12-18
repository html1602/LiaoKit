---
title: LiaoFormPlugin（表单插件）
description: 在消息中收集结构化数据并提交
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoFormPlugin, Plugin]
---

# LiaoFormPlugin（表单插件）

## 简介
- 提供表单字段渲染、校验与提交事件

## 使用示例

### 基础用法

渲染一个简单的收集表单。

```vue
<template>
  <LiaoFormPlugin 
    :plugin-data="formData" 
    @action="handleSubmit" 
  />
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  title: '请填写联系方式',
  submitText: '提交信息',
  fields: [
    { 
      name: 'name', 
      label: '姓名', 
      type: 'text', 
      required: true,
      placeholder: '请输入您的真实姓名'
    },
    { 
      name: 'phone', 
      label: '手机号', 
      type: 'tel', 
      required: true,
      pattern: '^1[3-9]\\d{9}$'
    },
    {
      name: 'type',
      label: '咨询类型',
      type: 'select',
      options: [
        { label: '售前咨询', value: 'pre-sales' },
        { label: '售后服务', value: 'after-sales' }
      ]
    }
  ]
});

const handleSubmit = ({ action, data }) => {
  if (action === 'submit') {
    console.log('表单数据:', data);
    // 提交到后端...
  }
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoFormPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      fields: FormField[];
      submitText?: string;
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |
| disabled | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoFormPlugin.vue`

