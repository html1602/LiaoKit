---
title: LiaoVotePlugin（投票插件）
description: 提供投票与结果展示，支持单选/多选
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoVotePlugin, Plugin]
---

# LiaoVotePlugin（投票插件）

## 简介
- 采集用户投票并展示结果，支持配置项与统计

## 使用示例

### 基础用法

发起一个简单的单选投票。

```vue
<template>
  <LiaoVotePlugin 
    :plugin-data="voteData" 
    @action="handleVote" 
  />
</template>

<script setup>
import { ref } from 'vue';

const voteData = ref({
  title: '满意度调查',
  question: '您对本次服务满意吗？',
  options: ['非常满意', '满意', '一般', '不满意'],
  allowMultiple: false
});

const handleVote = ({ action, data }) => {
  if (action === 'submit') {
    console.log('用户投票:', data.selection);
    // 提交后可以更新数据显示结果
    voteData.value.showResults = true;
    voteData.value.userVote = data.selection;
  }
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoVotePlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      question?: string;
      description?: string;
      options?: (string | VoteOption)[];
      allowMultiple?: boolean;
      showResults?: boolean;
      showPercentage?: boolean;
      results?: VoteResult[];
      totalVotes?: number;
      userVote?: string | string[] | null;
      votingEnabled?: boolean;
      submitText?: string;
    }` | 否 | `() => ({})` |  |
| readonly | `boolean` | 否 | `false` |  |
| disabled | `boolean` | 否 | `false` |  |
| loading | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoVotePlugin.vue`

