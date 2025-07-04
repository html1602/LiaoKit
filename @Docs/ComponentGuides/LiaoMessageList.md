# LiaoMessageList 组件使用指南

![版本](https://img.shields.io/badge/版本-2.8.3-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--27-green.svg)

## 组件介绍

LiaoMessageList 是一个功能强大的消息列表组件，专为聊天应用和消息展示场景设计。组件支持多种消息类型、智能滚动控制、新消息提醒、插件消息渲染等功能，并提供优秀的用户体验和性能优化。

✨ **v2.6.0 新增**: 集成 AI 智能消息格式适配器，自动转换各种业务侧消息格式为标准格式，大幅简化集成复杂度。

## 功能特性

- **多消息类型支持**：文本、图片、插件消息等多种类型
- **智能滚动管理**：自动滚动、手动滚动、滚动位置记忆
- **新消息提醒**：智能新消息提示和快速定位
- **插件消息集成**：无缝支持各种插件类型消息
- **快捷操作栏**：消息级别的快捷操作支持
- **日期分组显示**：按日期自动分组消息
- **加载更多**：支持历史消息分页加载
- **响应式设计**：适配各种屏幕尺寸和设备
- **性能优化**：虚拟滚动、DOM监听、智能更新
- 🤖 **AI智能适配**：自动识别和转换各种消息格式为标准格式（v2.6.0+）

## 基础用法

### 简单消息列表

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    @send="handleSend"
  />
</template>

<script setup>
import { ref } from 'vue';
import LiaoMessageList from '@/components/LiaoMessageList/LiaoMessageList.vue';

const messages = ref([
  {
    id: 1,
    content: '你好，欢迎使用聊天系统！',
    type: 'text',
    isSelf: false,
    avatar: '/avatar1.jpg',
    name: 'AI助手',
    time: new Date()
  },
  {
    id: 2,
    content: '谢谢，界面很棒！',
    type: 'text',
    isSelf: true,
    avatar: '/avatar2.jpg',
    time: new Date()
  }
]);

const handleSend = (message) => {
  console.log('发送消息:', message);
};
</script>
```

### 完整功能配置

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    :loading="isLoading"
    :loading-more="isLoadingMore"
    :has-more="hasMoreMessages"
    :show-avatar="true"
    :show-avatar-self="true"
    :show-name="true"
    :show-time="true"
    :show-date-divider="true"
    :scroll-to-bottom="true"
    :scroll-threshold="100"
    :unread-count="unreadCount"
    :empty-text="'暂无消息，开始聊天吧！'"
    :load-more-text="'查看更多历史消息'"
    :date-divider-format="'YYYY年MM月DD日'"
    @load-more="handleLoadMore"
    @scroll="handleScroll"
    @scroll-to-top="handleScrollToTop"
    @scroll-to-bottom="handleScrollToBottom"
    @read-all="handleReadAll"
    @quick-action-click="handleQuickAction"
    @plugin-action="handlePluginAction"
    @plugin-complete="handlePluginComplete"
    @plugin-cancel="handlePluginCancel"
    @plugin-error="handlePluginError"
  >
    <!-- 自定义空状态 -->
    <template #empty>
      <div class="custom-empty">
        <img src="/empty-chat.svg" alt="空状态" />
        <p>还没有消息，快来聊天吧！</p>
      </div>
    </template>
    
    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="custom-loading">
        <span>正在加载消息...</span>
      </div>
    </template>
  </LiaoMessageList>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const hasMoreMessages = ref(true);
const unreadCount = ref(0);

const handleLoadMore = () => {
  console.log('加载更多历史消息');
  isLoadingMore.value = true;
  // 模拟加载
  setTimeout(() => {
    isLoadingMore.value = false;
  }, 1000);
};

const handleScroll = (scrollInfo) => {
  console.log('滚动事件:', scrollInfo);
};

const handleQuickAction = (action) => {
  console.log('快捷操作:', action);
};

const handlePluginAction = (data) => {
  console.log('插件操作:', data);
};
</script>
```

### AI 智能消息适配（v2.6.0+）

```vue
<template>
  <LiaoMessageList
    :messages="originalMessages"
    :use-ai-adapter="true"
    :ai-adapter-options="aiAdapterOptions"
    :enable-adapter-cache="true"
    :adapter-timeout="10000"
    :custom-format="customFormatFunction"
    @adapter-success="handleAdapterSuccess"
    @adapter-error="handleAdapterError"
    @adapter-fallback="handleAdapterFallback"
  />
</template>

<script setup>
import { ref } from 'vue';

// 原始格式的消息数据（可以是任意格式）
const originalMessages = ref([
  {
    // 业务系统A的消息格式
    text: "用户询问产品信息",
    sender: "user123", 
    timestamp: 1640995200000,
    user_name: "张三"
  },
  {
    // 业务系统B的消息格式
    content: "AI回复内容",
    from: "assistant",
    time: "2024-01-01 10:30:00",
    type: "response"
  },
  {
    // 业务系统C的消息格式
    message: "这是一条图片消息",
    userId: "user456",
    created: 1640995260000,
    msgType: "image",
    imageUrl: "https://example.com/image.jpg"
  }
]);

// AI 适配器配置
const aiAdapterOptions = ref({
  apiKey: 'sk-your-actual-api-key-here', // 请使用您自己的API Key
  model: 'qwen-turbo-2025-04-28',
  apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  enableCache: true,
  cacheExpireMs: 3600000, // 1小时缓存
  timeoutMs: 10000,
  retryCount: 2,
  
  // 自定义Prompt模板（可选）
  promptTemplate: `
    请将以下消息转换为标准格式：
    原始消息：{rawMessage}
    
    返回格式：
    {
      "id": "消息ID",
      "content": "消息内容", 
      "type": "消息类型(text/image/file等)",
      "isSelf": "是否为当前用户发送",
      "name": "发送者姓名",
      "time": "消息时间",
      "avatar": "头像URL"
    }
  `
});

// 自定义兜底格式化函数（AI失败时使用）
const customFormatFunction = (rawMessage) => {
  return {
    id: rawMessage.id || Date.now(),
    content: rawMessage.text || rawMessage.content || rawMessage.message || '消息解析失败',
    type: rawMessage.type || rawMessage.msgType || 'text',
    isSelf: rawMessage.sender === 'self' || rawMessage.from === 'user',
    name: rawMessage.user_name || rawMessage.senderName || '未知用户',
    time: new Date(rawMessage.timestamp || rawMessage.time || rawMessage.created || Date.now()),
    avatar: rawMessage.avatar || rawMessage.imageUrl || ''
  };
};

// AI 适配成功回调
const handleAdapterSuccess = (event) => {
  const { originalMessage, adaptedMessage, fromCache, processingTime } = event.detail;
  console.log('✅ AI适配成功:', {
    original: originalMessage,
    adapted: adaptedMessage,
    cached: fromCache,
    time: processingTime
  });
};

// AI 适配失败回调
const handleAdapterError = (event) => {
  const { originalMessage, error, fallbackUsed } = event.detail;
  console.log('❌ AI适配失败:', {
    original: originalMessage,
    error: error.message,
    fallback: fallbackUsed
  });
};

// 使用兜底方案回调
const handleAdapterFallback = (event) => {
  const { originalMessage, fallbackMessage, reason } = event.detail;
  console.log('🔄 使用兜底方案:', {
    original: originalMessage,
    fallback: fallbackMessage,
    reason
  });
};
</script>
```

### AI 适配器高级配置

```vue
<template>
  <div class="ai-adapter-demo">
    <!-- 控制面板 -->
    <div class="control-panel">
      <label>
        <input 
          type="checkbox" 
          v-model="useAiAdapter"
        />
        启用 AI 适配器
      </label>
      
      <label>
        <input 
          type="checkbox" 
          v-model="enableCache"
        />
        启用缓存
      </label>
      
      <label>
        超时时间:
        <input 
          type="number" 
          v-model="timeoutMs"
          min="1000"
          max="30000"
          step="1000"
        />ms
      </label>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats-panel" v-if="adapterStats">
      <p>缓存命中率: {{ adapterStats.cacheHitRate }}%</p>
      <p>总请求数: {{ adapterStats.totalRequests }}</p>
      <p>错误率: {{ adapterStats.errorRate }}%</p>
      <p>平均响应时间: {{ adapterStats.avgResponseTime }}ms</p>
    </div>
    
    <!-- 消息列表 -->
    <LiaoMessageList
      :messages="originalMessages"
      :use-ai-adapter="useAiAdapter"
      :ai-adapter-options="{
        apiKey: 'your-api-key',
        enableCache: enableCache,
        timeoutMs: timeoutMs,
        retryCount: 2
      }"
      @adapter-success="updateStats"
      @adapter-error="updateStats"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const useAiAdapter = ref(true);
const enableCache = ref(true);
const timeoutMs = ref(10000);

const adapterStats = reactive({
  cacheHitRate: 0,
  totalRequests: 0,
  errorRate: 0,
  avgResponseTime: 0
});

const updateStats = (event) => {
  // 更新统计信息的逻辑
  // 这里可以根据事件类型更新相应的统计数据
};
</script>

<style scoped>
.control-panel {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
}

.stats-panel {
  padding: 16px;
  background: #e6f7ff;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| messages | Array | [] | 消息数组 |
| loading | Boolean | false | 是否正在加载消息 |
| loadingMore | Boolean | false | 是否正在加载更多历史消息，设置为true时将禁止新消息提示 |
| emptyText | String | '暂无消息' | 空状态提示文本 |
| showAvatar | Boolean | true | 是否显示头像 |
| showAvatarSelf | Boolean | true | 是否显示自己的头像 |
| showName | Boolean | false | 是否显示用户名 |
| showTime | Boolean | false | 是否显示消息时间 |
| hasMore | Boolean | false | 是否还有更多历史消息 |
| loadMoreText | String | '加载更多' | 加载更多按钮文本 |
| scrollToBottom | Boolean | true | 是否自动滚动到底部 |
| scrollThreshold | Number | 100 | 滚动阈值（像素） |
| showDateDivider | Boolean | true | 是否显示日期分割线 |
| dateDividerFormat | String | 'YYYY年MM月DD日' | 日期分割线格式 |
| unreadCount | Number | 0 | 未读消息数量 |
| useAiAdapter | Boolean | false | 是否启用 AI 智能格式适配 (v2.6.0+) |
| aiAdapterOptions | Object | {} | AI 适配器配置选项 (v2.6.0+) |
| customFormat | Function | undefined | 自定义兜底格式化函数 (v2.6.0+) |
| enableAdapterCache | Boolean | true | 是否启用适配器缓存 (v2.6.0+) |
| adapterTimeout | Number | 5000 | 适配器超时时间(ms) (v2.6.0+) |

### AI 适配器配置选项 (aiAdapterOptions)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| enabled | Boolean | true | 是否启用 AI 格式化 |
| apiUrl | String | 'https://dashscope.aliyuncs.com/compatible-mode/v1' | 通义千问兼容 OpenAI 的 API 地址 |
| apiKey | String | - | LLM API Key (必填) |
| model | String | 'qwen-turbo-2025-04-28' | 选用的模型名 |
| promptTemplate | String | - | 自定义 Prompt 模板 |
| timeoutMs | Number | 10000 | 最大请求超时时间(毫秒) |
| extraHeaders | Object | {} | 需要注入的额外 Header |
| retryCount | Number | 2 | 重试次数 |
| enableCache | Boolean | true | 是否启用缓存 |
| cacheExpireMs | Number | 3600000 | 缓存过期时间(毫秒，默认1小时) |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| load-more | () | 需要加载更多历史消息时触发 |
| scroll | (scrollInfo: object) | 滚动时触发 |
| scroll-to-top | () | 滚动到顶部时触发 |
| scroll-to-bottom | () | 滚动到底部时触发 |
| read-all | () | 标记所有消息已读时触发 |
| quick-action-click | (action: object) | 点击快捷操作时触发 |
| plugin-action | (data: object) | 插件操作时触发 |
| plugin-complete | (data: object) | 插件完成时触发 |
| plugin-cancel | (data: object) | 插件取消时触发 |
| plugin-error | (data: object) | 插件错误时触发 |
| **file-preview** | **{ message, file }** | **文件预览时触发** |
| **file-download** | **{ message, file }** | **文件下载时触发** |
| **file-click** | **{ message, file }** | **文件点击时触发** |
| **file-retry** | **{ message, file }** | **文件重试时触发** |
| **file-more** | **{ message, file }** | **文件更多操作时触发** |
| **adapter-success** | **{ originalMessage, adaptedMessage, fromCache, processingTime }** | **AI 适配成功时触发 (v2.6.0+)** |
| **adapter-error** | **{ originalMessage, error, fallbackUsed }** | **AI 适配失败时触发 (v2.6.0+)** |
| **adapter-fallback** | **{ originalMessage, fallbackMessage, reason }** | **使用兜底方案时触发 (v2.6.0+)** |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|-----|---|---|
| before | - | 消息列表前的内容 |
| after | - | 消息列表后的内容 |
| empty | - | 自定义空状态内容 |
| loading | - | 自定义加载状态内容 |
| load-more | - | 自定义加载更多按钮 |
| message | message, index, groupIndex, isLastMessage | 自定义消息渲染 |
| message-{type} | message, index, groupIndex | 自定义特定类型消息渲染 |

## 消息数据结构

### 基础消息接口

```typescript
interface Message {
  id?: string | number;          // 消息唯一标识
  content: string;               // 消息内容
  type?: 'text' | 'image' | 'file' | 'plugin' | string; // 消息类型
  isSelf?: boolean;              // 是否为自己发送的消息
  avatar?: string;               // 用户头像URL
  name?: string;                 // 用户名
  time?: string | Date | number; // 消息时间
  status?: 'sending' | 'sent' | 'failed' | 'streaming'; // 消息状态
  quickActions?: QuickAction[];  // 快捷操作
  pluginType?: string;           // 插件类型（当type为plugin时）
  pluginData?: any;             // 插件数据（当type为plugin时）
  pluginRequired?: boolean;      // 插件是否必须完成
  [key: string]: any;           // 其他自定义字段
}
```

### 快捷操作数据

```typescript
interface QuickAction {
  id: string;                   // 操作唯一标识
  text: string;                 // 操作显示文本
  label: string;                // 操作标签
  icon?: string;                // 操作图标
  type?: 'primary' | 'secondary' | 'danger'; // 操作类型
}
```

## 消息类型支持

### 1. 文本消息

```javascript
const textMessage = {
  id: 1,
  content: '这是一条文本消息',
  type: 'text',
  isSelf: false,
  avatar: '/avatar.jpg',
  name: '用户名',
  time: new Date(),
  status: 'sent'
};
```

### 2. 图片消息

```javascript
const imageMessage = {
  id: 2,
  content: '/path/to/image.jpg', // 图片URL
  type: 'image',
  alt: '图片描述',
  isSelf: true,
  time: new Date()
};
```

### 3. 文件消息

```javascript
// 基础文件消息
const basicFileMessage = {
  id: 3,
  type: 'file',
  content: '发送了一个文件',    // 可选的消息描述
  fileName: '报告.pdf',        // 文件名（必需）
  fileSize: 2048000,          // 文件大小，单位：字节（必需）
  fileType: 'application/pdf', // MIME类型（推荐）
  fileUrl: 'https://example.com/report.pdf',  // 文件下载URL
  fileStatus: 'success',      // 文件状态（必需）
  isSelf: false,
  avatar: '/avatar.jpg',
  name: '同事',
  time: new Date()
};

// 等待上传状态
const waitingFile = {
  id: 4,
  type: 'file',
  fileName: '待上传.docx',
  fileSize: 1024000,
  fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  fileStatus: 'waiting',     // 等待上传
  isSelf: true,
  time: new Date()
};

// 上传中状态
const uploadingFile = {
  id: 5,
  type: 'file',
  fileName: '上传中.mp4',
  fileSize: 25600000,
  fileType: 'video/mp4',
  fileStatus: 'uploading',   // 正在上传
  fileProgress: 45,          // 上传进度 0-100
  isSelf: true,
  time: new Date()
};

// 上传成功状态
const successFile = {
  id: 6,
  type: 'file',
  fileName: '成功上传.xlsx',
  fileSize: 512000,
  fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  fileStatus: 'success',     // 上传成功
  fileUrl: 'https://example.com/file.xlsx',  // 成功后提供下载URL
  isSelf: true,
  time: new Date()
};

// 上传失败状态
const errorFile = {
  id: 7,
  type: 'file',
  fileName: '失败文件.png',
  fileSize: 2048000,
  fileType: 'image/png',
  fileStatus: 'error',       // 上传失败
  fileError: '文件过大，请选择小于2MB的文件',  // 错误信息
  isSelf: true,
  time: new Date()
};
```

### 4. 带快捷操作的消息

```javascript
const messageWithActions = {
  id: 4,
  content: '请选择您需要的服务',
  type: 'text',
  isSelf: false,
  quickActions: [
    { id: 'service1', text: '技术支持', label: '技术支持' },
    { id: 'service2', text: '产品咨询', label: '产品咨询' },
    { id: 'service3', text: '投诉建议', label: '投诉建议' }
  ],
  time: new Date()
};
```

### 5. 插件消息

```javascript
const pluginMessage = {
  id: 3,
  type: 'plugin',
  pluginType: 'vote',
  pluginData: {
    title: '投票调查',
    question: '您更喜欢哪种颜色？',
    options: [
      { id: 'red', text: '红色' },
      { id: 'blue', text: '蓝色' }
    ]
  },
  pluginRequired: true, // 必须完成
  isSelf: false,
  time: new Date()
};
```

## 高级用法

### 实时消息流

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    :scroll-to-bottom="true"
    @scroll-to-bottom="markAsRead"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const messages = ref([]);
let eventSource = null;

onMounted(() => {
  // 建立SSE连接接收实时消息
  eventSource = new EventSource('/api/messages/stream');
  
  eventSource.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    messages.value.push(newMessage);
  };
  
  eventSource.onerror = (error) => {
    console.error('消息流连接错误:', error);
  };
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});

const markAsRead = () => {
  // 标记消息已读
  const unreadMessages = messages.value.filter(m => !m.read);
  if (unreadMessages.length > 0) {
    markMessagesAsRead(unreadMessages.map(m => m.id));
  }
};
</script>
```

### 历史消息分页加载

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    :has-more="hasMore"
    :loading-more="loadingMore"
    @load-more="loadMoreMessages"
  />
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);
const hasMore = ref(true);
const loadingMore = ref(false);
const currentPage = ref(1);
const pageSize = 20;

const loadMoreMessages = async () => {
  if (loadingMore.value || !hasMore.value) return;
  
  loadingMore.value = true;
  
  try {
    const response = await fetch(`/api/messages?page=${currentPage.value}&size=${pageSize}`);
    const data = await response.json();
    
    // 将历史消息插入到列表开头
    messages.value.unshift(...data.messages);
    
    hasMore.value = data.hasMore;
    currentPage.value++;
    
  } catch (error) {
    console.error('加载历史消息失败:', error);
  } finally {
    loadingMore.value = false;
  }
};
</script>
```

### 消息搜索和过滤

```vue
<template>
  <div class="message-container">
    <div class="search-bar">
      <input
        v-model="searchKeyword"
        placeholder="搜索消息..."
        @input="handleSearch"
      />
    </div>
    
    <LiaoMessageList
      :messages="filteredMessages"
      :scroll-to-bottom="!isSearching"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const messages = ref([]);
const searchKeyword = ref('');
const isSearching = ref(false);

const filteredMessages = computed(() => {
  if (!searchKeyword.value.trim()) {
    isSearching.value = false;
    return messages.value;
  }
  
  isSearching.value = true;
  const keyword = searchKeyword.value.toLowerCase();
  
  return messages.value.filter(message => {
    return message.content.toLowerCase().includes(keyword) ||
           message.name?.toLowerCase().includes(keyword);
  });
});

const handleSearch = () => {
  // 可以添加防抖逻辑
  console.log('搜索关键词:', searchKeyword.value);
};
</script>
```

### 消息状态管理

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    @plugin-complete="handlePluginComplete"
    @plugin-cancel="handlePluginCancel"
  />
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);

// 发送消息
const sendMessage = async (content) => {
  const tempId = `temp-${Date.now()}`;
  
  // 添加临时消息（发送中状态）
  const tempMessage = {
    id: tempId,
    content,
    type: 'text',
    isSelf: true,
    status: 'sending',
    time: new Date()
  };
  
  messages.value.push(tempMessage);
  
  try {
    // 发送到服务器
    const response = await sendMessageToServer(content);
    
    // 更新消息状态
    const messageIndex = messages.value.findIndex(m => m.id === tempId);
    if (messageIndex !== -1) {
      messages.value[messageIndex] = {
        ...tempMessage,
        id: response.id,
        status: 'sent'
      };
    }
    
  } catch (error) {
    // 更新为失败状态
    const messageIndex = messages.value.findIndex(m => m.id === tempId);
    if (messageIndex !== -1) {
      messages.value[messageIndex].status = 'failed';
    }
    
    console.error('消息发送失败:', error);
  }
};

const handlePluginComplete = ({ message, data }) => {
  console.log('插件完成:', message, data);
  
  // 可以在这里添加AI回复或其他业务逻辑
  addAIReply(`收到您的${message.pluginType}操作，正在处理中...`);
};

const addAIReply = (content) => {
  messages.value.push({
    id: `ai-${Date.now()}`,
    content,
    type: 'text',
    isSelf: false,
    avatar: '/ai-avatar.jpg',
    name: 'AI助手',
    time: new Date()
  });
};
</script>
```

### 自定义消息类型

```vue
<template>
  <LiaoMessageList :messages="messages">
    <!-- 自定义文件消息类型 -->
    <template #message-file="{ message }">
      <div class="file-message">
        <div class="file-icon">📎</div>
        <div class="file-info">
          <div class="file-name">{{ message.fileName }}</div>
          <div class="file-size">{{ formatFileSize(message.fileSize) }}</div>
        </div>
        <button @click="downloadFile(message)" class="download-btn">
          下载
        </button>
      </div>
    </template>
    
    <!-- 自定义系统消息类型 -->
    <template #message-system="{ message }">
      <div class="system-message">
        <span class="system-time">{{ formatTime(message.time) }}</span>
        <span class="system-content">{{ message.content }}</span>
      </div>
    </template>
  </LiaoMessageList>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([
  {
    id: 1,
    type: 'file',
    fileName: '项目文档.pdf',
    fileSize: 1024000,
    fileUrl: '/files/doc.pdf',
    isSelf: true,
    time: new Date()
  },
  {
    id: 2,
    type: 'system',
    content: '用户张三加入了群聊',
    time: new Date()
  }
]);

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const downloadFile = (message) => {
  // 处理文件下载
  const link = document.createElement('a');
  link.href = message.fileUrl;
  link.download = message.fileName;
  link.click();
};
</script>
```

### 4. 文件消息处理

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    @file-preview="handleFilePreview"
    @file-download="handleFileDownload"
    @file-click="handleFileClick"
    @file-retry="handleFileRetry"
    @file-more="handleFileMore"
  />
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([
  {
    id: 1,
    type: 'file',
    fileName: '设计文档.pdf',
    fileSize: 2048000,
    fileType: 'application/pdf',
    fileUrl: 'https://example.com/design.pdf',
    fileStatus: 'success',
    isSelf: false,
    avatar: '/avatar.jpg',
    name: '设计师',
    time: new Date()
  },
  {
    id: 2,
    type: 'file',
    fileName: '上传失败.jpg',
    fileSize: 1536000,
    fileType: 'image/jpeg',
    fileStatus: 'error',
    fileError: '文件过大，请重新选择',
    isSelf: true,
    time: new Date()
  }
]);

// 文件预览处理
const handleFilePreview = ({ message, file }) => {
  console.log('预览文件:', file);
  // 文件预览功能已内置在组件中，通常不需要额外处理
  // 但可以在这里添加统计或日志记录
};

// 文件下载处理
const handleFileDownload = ({ message, file }) => {
  console.log('下载文件:', file);
  // 创建下载链接
  const link = document.createElement('a');
  link.href = file.url || message.fileUrl;
  link.download = file.name || message.fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
};

// 文件点击处理
const handleFileClick = ({ message, file }) => {
  console.log('点击文件:', file);
  // 根据文件类型执行不同操作
  if (file.type?.startsWith('image/')) {
    // 图片文件自动预览
    return;
  } else if (file.url) {
    // 其他文件类型直接下载
    handleFileDownload({ message, file });
  }
};

// 文件重试处理
const handleFileRetry = ({ message, file }) => {
  console.log('重试上传文件:', file);
  // 重新上传文件的逻辑
  uploadFile(file.file || message.file);
};

// 文件更多操作处理
const handleFileMore = ({ message, file }) => {
  console.log('文件更多操作:', file);
  // 显示更多操作菜单，例如：
  // - 分享文件
  // - 删除文件
  // - 重命名文件
  // - 查看文件信息
  showFileContextMenu(file);
};

// 模拟文件上传函数
const uploadFile = async (file) => {
  try {
    // 更新消息状态为上传中
    const messageIndex = messages.value.findIndex(m => m.file === file);
    if (messageIndex !== -1) {
      messages.value[messageIndex].fileStatus = 'uploading';
      messages.value[messageIndex].fileProgress = 0;
    }
    
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (messageIndex !== -1) {
        messages.value[messageIndex].fileProgress = i;
      }
    }
    
    // 上传成功
    if (messageIndex !== -1) {
      messages.value[messageIndex].fileStatus = 'success';
      messages.value[messageIndex].fileUrl = 'https://example.com/uploaded-file.pdf';
    }
  } catch (error) {
    // 上传失败
    const messageIndex = messages.value.findIndex(m => m.file === file);
    if (messageIndex !== -1) {
      messages.value[messageIndex].fileStatus = 'error';
      messages.value[messageIndex].fileError = '上传失败: ' + error.message;
    }
  }
};

// 显示文件操作菜单
const showFileContextMenu = (file) => {
  // 实现文件右键菜单或操作面板
  const actions = [
    { id: 'share', text: '分享文件', icon: 'share' },
    { id: 'delete', text: '删除文件', icon: 'delete' },
    { id: 'rename', text: '重命名', icon: 'edit' },
    { id: 'info', text: '文件信息', icon: 'info' }
  ];
  
  // 显示操作菜单的实现...
};
</script>
```

### 5. 文件上传集成

```vue
<template>
  <div class="chat-container">
    <LiaoMessageList :messages="messages" />
    <LiaoInputArea
      @send="handleSendMessage"
      @file-upload="handleFileUpload"
      :enable-file-upload="true"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);

// 处理文件上传
const handleFileUpload = (files) => {
  files.forEach(file => {
    // 创建文件消息
    const fileMessage = {
      id: Date.now() + Math.random(),
      type: 'file',
      content: `发送了文件: ${file.name}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileStatus: 'uploading',
      fileProgress: 0,
      isSelf: true,
      time: new Date(),
      file: file  // 保存原始文件对象，用于重试上传
    };
    
    // 添加到消息列表
    messages.value.push(fileMessage);
    
    // 开始上传
    uploadFileToServer(file, fileMessage);
  });
};

// 上传文件到服务器
const uploadFileToServer = async (file, message) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // 使用XMLHttpRequest以便监听上传进度
    const xhr = new XMLHttpRequest();
    
    // 监听上传进度
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        message.fileProgress = progress;
      }
    });
    
    // 处理上传完成
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        message.fileStatus = 'success';
        message.fileUrl = response.url;
        message.fileProgress = 100;
      } else {
        message.fileStatus = 'error';
        message.fileError = '上传失败: ' + xhr.statusText;
      }
    });
    
    // 处理上传错误
    xhr.addEventListener('error', () => {
      message.fileStatus = 'error';
      message.fileError = '网络错误，上传失败';
    });
    
    // 发送请求
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
    
  } catch (error) {
    message.fileStatus = 'error';
    message.fileError = '上传异常: ' + error.message;
  }
};
</script>
```

## 滚动控制详解

### 智能滚动策略

组件实现了智能的滚动控制策略：

1. **自动滚动条件**：
   - 用户在底部时新消息自动滚动到底部
   - 自己发送的消息总是自动滚动到底部
   - 初始加载时滚动到底部（可配置）

2. **手动滚动控制**：
   - 用户主动滚动时停止自动滚动
   - 提供"回到底部"按钮
   - 显示未读消息数量

3. **新消息提醒**：
   - 不在底部时显示新消息提示
   - 点击提示快速定位到新消息
   - 智能计算新消息数量

### 滚动事件处理

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    :scroll-threshold="100"
    @scroll="handleScroll"
    @scroll-to-top="loadMoreMessages"
    @scroll-to-bottom="markAsRead"
  />
</template>

<script setup>
const handleScroll = (scrollInfo) => {
  const { scrollTop, scrollHeight, clientHeight } = scrollInfo;
  
  // 计算滚动百分比
  const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  
  // 根据滚动位置执行不同操作
  if (scrollPercent < 10) {
    // 接近顶部，可以预加载更多消息
    preloadMoreMessages();
  } else if (scrollPercent > 90) {
    // 接近底部，标记消息已读
    markRecentMessagesAsRead();
  }
};
</script>
```

## 性能优化

### 虚拟滚动（大量消息）

```vue
<template>
  <LiaoMessageList
    :messages="visibleMessages"
    @scroll="handleVirtualScroll"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const allMessages = ref([]); // 所有消息
const scrollTop = ref(0);
const containerHeight = ref(600);
const itemHeight = 80; // 平均消息高度
const bufferSize = 5; // 缓冲区大小

const visibleMessages = computed(() => {
  const startIndex = Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferSize);
  const endIndex = Math.min(
    allMessages.value.length,
    startIndex + Math.ceil(containerHeight.value / itemHeight) + bufferSize * 2
  );
  
  return allMessages.value.slice(startIndex, endIndex);
});

const handleVirtualScroll = (scrollInfo) => {
  scrollTop.value = scrollInfo.scrollTop;
};
</script>
```

### 消息缓存策略

```javascript
// 消息缓存管理
class MessageCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  set(key, message) {
    if (this.cache.size >= this.maxSize) {
      // 删除最旧的消息
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, message);
  }
  
  get(key) {
    const message = this.cache.get(key);
    if (message) {
      // 更新访问顺序
      this.cache.delete(key);
      this.cache.set(key, message);
    }
    return message;
  }
  
  has(key) {
    return this.cache.has(key);
  }
}

const messageCache = new MessageCache();
```

## 样式定制

### CSS 变量

```scss
.liao-message-list {
  --message-list-bg: #f8f9fa;
  --message-list-padding: 16px;
  --message-spacing: 8px;
  --date-divider-color: #999;
  --date-divider-bg: #fff;
  --new-message-tip-bg: #1890ff;
  --new-message-tip-color: #fff;
  --scroll-button-bg: #fff;
  --scroll-button-shadow: 0 2px 8px rgba(0,0,0,0.15);
  --unread-badge-bg: #ff4d4f;
  --unread-badge-color: #fff;
}
```

### 自定义主题

```vue
<template>
  <div class="dark-message-theme">
    <LiaoMessageList :messages="messages" />
  </div>
</template>

<style scoped>
.dark-message-theme {
  .liao-message-list {
    --message-list-bg: #1a1a1a;
    --date-divider-color: #666;
    --date-divider-bg: #2a2a2a;
    --new-message-tip-bg: #3b82f6;
    --scroll-button-bg: #2a2a2a;
    color: #fff;
  }
}
</style>
```

## 注意事项

1. **消息ID唯一性**：确保每条消息都有唯一的ID，避免渲染问题
2. **内存管理**：大量消息时考虑使用虚拟滚动或分页加载
3. **图片加载**：图片消息建议使用懒加载和占位符
4. **插件性能**：复杂插件可能影响滚动性能，建议优化
5. **移动端适配**：注意移动端的触摸滚动和虚拟键盘处理
6. **无障碍支持**：为屏幕阅读器用户提供适当的ARIA标签
7. **🤖 AI 适配器安全 (v2.6.0+)**：
   - **API Key 保护**: 在生产环境中避免在前端暴露 API Key，建议使用后端代理
   - **网络依赖**: AI 适配需要网络连接，确保有合适的兜底方案
   - **性能考虑**: 启用缓存以减少不必要的 API 调用
   - **错误处理**: 妥善处理网络错误和 AI 服务不可用的情况
8. **🔧 AI 适配器配置 (v2.6.0+)**：
   - **超时设置**: 根据网络环境调整合适的超时时间
   - **重试机制**: 在不稳定网络环境中适当增加重试次数
   - **缓存策略**: 合理设置缓存过期时间，平衡性能和数据新鲜度
   - **自定义格式**: 为特殊业务场景提供自定义兜底格式化函数

## 浏览器兼容性

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- 移动端：iOS Safari 12+, Android Chrome 70+

## 最佳实践

### 加载历史消息

加载历史消息时，请务必设置`loadingMore`属性为`true`，以防止历史消息被错误地识别为新消息：

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    :loading-more="isLoadingMore"
    @load-more="handleLoadMore"
  />
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);
const isLoadingMore = ref(false);

const handleLoadMore = async () => {
  // 1. 设置加载状态为true
  isLoadingMore.value = true;
  
  try {
    // 2. 加载历史消息
    const historyMessages = await fetchHistoryMessages();
    
    // 3. 将历史消息添加到消息数组前面
    messages.value = [...historyMessages, ...messages.value];
  } catch (error) {
    console.error('加载历史消息失败:', error);
  } finally {
    // 4. 重置加载状态
    isLoadingMore.value = false;
  }
};
</script>
```

这样可以确保在加载历史消息期间不会触发"有 X 条新消息"的提示，提升用户体验。

### 优化大量消息的性能

当消息列表需要展示大量消息时，可以考虑以下优化策略：

1. **分页加载**：使用`load-more`事件结合`hasMore`属性实现分页加载
2. **定期清理**：保持合理的消息数量，定期清理过旧的消息
3. **避免频繁更新**：批量更新消息，减少渲染次数
4. **使用唯一ID**：确保每条消息都有唯一的`id`属性，帮助Vue优化渲染

### 自定义消息渲染

对于特殊类型的消息，可以使用命名插槽进行自定义渲染：

```vue
<LiaoMessageList :messages="messages">
  <!-- 自定义特殊消息类型 -->
  <template #message-custom="{ message }">
    <div class="custom-message">
      <!-- 自定义消息内容 -->
      <div class="custom-content">{{ message.content }}</div>
      <!-- 自定义交互元素 -->
      <button @click="handleCustomAction(message)">
        特殊操作
      </button>
    </div>
  </template>
</LiaoMessageList>
```

## 更新日志

### 2.8.3 (2025-06-27)
- 修复加载历史消息时误显示"有 X 条新消息"提示的问题
- 优化消息处理逻辑，完善历史消息加载机制
- 更新文档，添加历史消息加载最佳实践

### 2.8.2 (2025-06-26)
// ... existing code ...

### 2.8.1 (2025-06-25)
- 🚀 **SDK 升级**: AI 适配器升级使用 OpenAI SDK 调用通义千问 API
  - 更好的类型安全和错误处理
  - 官方维护的 API 客户端
  - 自动处理请求重试和超时
- 🔒 **浏览器兼容性**: 添加 `dangerouslyAllowBrowser` 支持
  - 解决 SDK 在浏览器环境中的限制
  - 完善的安全使用指南
  - 生产环境安全建议
- 🛡️ **安全增强**: 
  - 创建专门的安全配置文档
  - 提供后端代理方案示例
  - 环境变量管理最佳实践
- 🐛 **问题修复**:
  - 修复 Unicode 字符编码问题
  - 优化 Map 迭代器兼容性
  - 改进错误处理机制

### 2.8.0 (2025-06-24)
- 🤖 **AI 智能适配器**: 集成 AI 智能消息格式适配功能
  - 自动识别和转换各种业务侧消息格式
  - 支持通义千问大模型 API 调用
  - LRU 缓存机制提升性能
  - 本地兜底适配器确保稳定性
- ✨ **新增属性**:
  - `useAiAdapter`: 启用/禁用 AI 适配
  - `aiAdapterOptions`: AI 适配器配置选项
  - `customFormat`: 自定义兜底格式化函数
  - `enableAdapterCache`: 适配器缓存控制
  - `adapterTimeout`: 适配器超时设置
- 📡 **新增事件**:
  - `adapter-success`: AI 适配成功时触发
  - `adapter-error`: AI 适配失败时触发  
  - `adapter-fallback`: 使用兜底方案时触发
- 🔧 **功能特性**:
  - 支持自定义 Prompt 模板
  - 智能缓存和重试机制
  - 详细的使用统计和监控
  - 完整的错误处理和日志记录

### 2.7.0 (2025-06-16)
- 🔧 修复Vue Script Setup导出错误
- 🔄 重构类型系统，使用独立的session.ts类型文件
- ✨ 完善插件消息状态管理集成
- 🎯 优化新消息提醒算法和交互
- 📱 改进移动端滚动性能

### 2.6.0 (2025-06-15)
- ✨ 新增插件消息必须完成控制
- 🔒 集成全局状态管理，支持插件锁定输入
- 📊 优化消息状态管理和事件处理
- 🎨 改进快捷操作栏样式和交互

### 2.5.0 (2025-06-14)
- 🚀 新增快捷操作栏功能
- ✨ 完善插件消息渲染和事件系统
- 🎯 优化滚动控制和新消息提醒
- 📱 改进移动端触摸交互体验

### 2.4.0 (2025-06-13)
- ✨ 新增图片消息支持
- 🎨 优化消息气泡样式和动画
- 📅 完善日期分组显示功能
- �� 修复滚动位置记忆问题

### 2.3.0 (2025-06-12)
- ✨ 新增多种消息类型支持
- 🎯 实现智能滚动控制机制
- 📝 完善消息数据结构定义
- 🚀 优化渲染性能和内存使用 