# LiaoMessageList 组件使用指南

![版本](https://img.shields.io/badge/版本-2.8.5-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--07--03-green.svg)

## 组件介绍

LiaoMessageList 是一个功能强大的消息列表组件，专为聊天应用和消息展示场景设计。组件支持多种消息类型、智能滚动控制、新消息提醒、插件消息渲染等功能，并提供优秀的用户体验和性能优化。

## 功能特性

- **多种消息类型支持**：文本、图片、文件、插件等多种消息类型
- **智能滚动控制**：根据用户行为自动决定是否滚动到底部
- **新消息提醒**：当用户未查看底部时，显示新消息提示
- **历史消息加载**：支持向上加载历史消息，并自动检测历史消息加载
- **日期分组**：按日期对消息进行分组显示
- **AI消息适配**：内置AI消息格式适配器，支持Markdown渲染
- **插件消息渲染**：支持各类交互式插件消息
- **文件消息预览**：支持文件消息的预览和下载
- **高性能渲染**：优化大量消息场景下的渲染性能

### 加载历史消息与新消息提示

在加载历史消息时，组件现在可以**自动检测**是否正在加载历史消息，无需手动设置`loadingMore`属性。组件通过分析消息的变化模式（如消息ID、时间戳、添加位置等）来判断是否是在加载历史消息。

> **最新优化**: 在 v2.8.5 版本中，我们增加了自动检测历史消息加载的功能，组件可以自动识别历史消息加载，无需用户手动设置`loadingMore`属性。同时，我们也保留了手动设置的选项，当您明确设置`loadingMore`属性时，会优先使用您的设置。

```vue
<template>
  <!-- 自动检测历史消息加载（默认开启） -->
  <LiaoMessageList
    :messages="messages"
    @load-more="loadHistoryMessages"
  />
  
  <!-- 或者手动控制历史消息加载状态 -->
  <LiaoMessageList
    :messages="messages"
    :loading-more="isLoadingHistory"
    :auto-detect-history-loading="false"
    @load-more="loadHistoryMessages"
  />
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);
const isLoadingHistory = ref(false);

const loadHistoryMessages = async () => {
  isLoadingHistory.value = true; // 如果禁用自动检测，需要手动设置
  try {
    const historyMessages = await fetchHistoryMessages();
    messages.value = [...historyMessages, ...messages.value]; // 在前面添加历史消息
  } catch (error) {
    console.error('加载历史消息失败:', error);
  } finally {
    isLoadingHistory.value = false; // 加载完成后设置为false
  }
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| messages | Array | [] | 消息数组，每个消息对象应包含id、content、type等属性 |
| loading | Boolean | false | 是否处于加载状态 |
| loadingMore | Boolean | false | 是否正在加载更多历史消息（可选，组件会自动检测） |
| autoDetectHistoryLoading | Boolean | true | 是否启用自动检测历史消息加载功能 |
| emptyText | String | '暂无消息' | 消息列表为空时显示的文本 |
| showAvatar | Boolean | true | 是否显示头像 |
| showAvatarSelf | Boolean | true | 是否显示自己的头像 |
| showName | Boolean | false | 是否显示用户名 |
| showTime | Boolean | false | 是否显示消息时间 |
| hasMore | Boolean | false | 是否还有更多历史消息可加载 |
| loadMoreText | String | '加载更多' | 加载更多按钮的文本 |
| scrollToBottom | Boolean | true | 初始化时是否滚动到底部 |
| scrollThreshold | Number | 100 | 显示滚动到底部按钮的阈值（像素） |
| showDateDivider | Boolean | true | 是否显示日期分割线 |
| dateDividerFormat | String | 'YYYY年MM月DD日' | 日期分割线的日期格式 |
| unreadCount | Number | 0 | 未读消息数量 |
| useAiAdapter | Boolean | false | 是否使用AI消息适配器 |
| aiAdapterOptions | Object | {} | AI适配器配置选项 |
| customFormat | Function | undefined | 自定义格式化函数 |
| enableAdapterCache | Boolean | true | 是否启用适配器缓存 |
| adapterTimeout | Number | 5000 | 适配器超时时间（毫秒） |
| skipUserMessageAdapter | Boolean | false | 是否跳过用户消息的适配 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| load-more | - | 点击加载更多按钮时触发 |
| scroll | { scrollTop, scrollHeight, clientHeight } | 滚动时触发 |
| scroll-to-top | - | 滚动到顶部时触发 |
| scroll-to-bottom | - | 滚动到底部时触发 |
| read-all | - | 所有消息已读时触发 |
| quick-action-click | action | 点击快捷操作时触发 |
| plugin-action | { action, message } | 插件操作事件 |
| plugin-complete | { message, data } | 插件完成事件 |
| plugin-cancel | { message, data } | 插件取消事件 |
| plugin-error | { message, data } | 插件错误事件 |
| file-preview | { message, file } | 文件预览事件 |
| file-download | { message, file } | 文件下载事件 |
| file-click | { message, file } | 文件点击事件 |
| file-retry | { message, file } | 文件重试事件 |
| file-more | { message, file } | 文件更多操作事件 |
| adapter-success | { processed, cached, skipped, streaming, stats } | AI适配成功事件 |
| adapter-error | { error, originalMessages } | AI适配错误事件 |
| adapter-fallback | { failedCount, total } | AI适配回退事件 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|-----|---|---|
| before | - | 消息列表前的内容 |
| after | - | 消息列表后的内容 |
| empty | - | 消息列表为空时的内容 |
| loading | - | 加载状态的内容 |
| load-more | - | 加载更多按钮的内容 |
| message | { message, index, groupIndex, isLastMessage } | 消息项的内容 |
| message-[type] | { message, index, groupIndex } | 特定类型消息的内容 |
| ai-loading | - | AI适配加载状态的内容 |
| ai-error | { error } | AI适配错误状态的内容 |

## 自动检测历史消息加载

组件通过以下几种方式自动检测是否正在加载历史消息：

1. **消息ID比较**：如果新消息列表的第一条消息ID与旧消息列表的第一条消息ID不同，且消息数量增加，可能是加载了历史消息
2. **时间戳比较**：如果新消息列表的第一条消息时间早于旧消息列表的第一条消息时间，可能是加载了历史消息
3. **批量消息检测**：如果一次性添加了多条消息（>=3条），且旧消息列表的最后一条消息与新消息列表中对应位置的消息相同，可能是在开头批量加载了历史消息

自动检测功能默认开启，如果您需要手动控制，可以设置`autoDetectHistoryLoading`为`false`，并手动管理`loadingMore`属性。

## 更新日志

### 2.8.5 (2025-07-03)
- 增加自动检测历史消息加载功能，无需手动设置`loadingMore`属性
- 修复历史消息加载完成后仍显示新消息提示的问题
- 增强历史消息判断逻辑，通过多重条件判断消息添加位置

### 2.8.4 (2025-06-28)
- 优化滚动到底部按钮的显示逻辑
- 改进新消息提示的样式和交互

### 2.8.3 (2025-06-15)
- 增加文件消息的支持
- 优化消息渲染性能 