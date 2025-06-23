<template>
  <div class="message-list-example">
    <h2>消息列表示例</h2>
    
    <div class="example-container">
      <div class="message-list-wrapper">
        <LiaoMessageList
          ref="messageListRef"
          :messages="messages"
          :loading="loading"
          :loadingMore="loadingMore"
          :hasMore="hasMore"
          :unreadCount="unreadCount"
          @load-more="handleLoadMore"
          @scroll-to-bottom="handleScrollToBottom"
        />
        
        <LiaoInputArea
          v-model="inputValue"
          @send="sendMessage"
          placeholder="请输入消息..."
        />
      </div>
      
      <div class="control-panel">
        <div class="control-group">
          <h3>功能控制</h3>
          <button @click="loadOlderMessages">加载历史消息</button>
          <button @click="addRandomMessage">添加随机消息</button>
          <button @click="toggleLoading">{{ loading ? '停止加载' : '开始加载' }}</button>
          <button @click="clearMessages">清空消息</button>
        </div>
        
        <div class="control-group">
          <h3>参数设置</h3>
          <div class="control-item">
            <label for="showAvatar">显示头像</label>
            <input type="checkbox" id="showAvatar" v-model="showAvatar">
          </div>
          <div class="control-item">
            <label for="showTime">显示时间</label>
            <input type="checkbox" id="showTime" v-model="showTime">
          </div>
          <div class="control-item">
            <label for="showDateDivider">显示日期分隔符</label>
            <input type="checkbox" id="showDateDivider" v-model="showDateDivider">
          </div>
          <div class="control-item">
            <label for="scrollToBottom">自动滚动到底部</label>
            <input type="checkbox" id="scrollToBottom" v-model="scrollToBottom">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../components/LiaoInputArea/LiaoInputArea.vue';
import type { Message } from '../components/LiaoMessageList/LiaoMessageList.vue';

// 消息列表引用
const messageListRef = ref(null);

// 状态
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const unreadCount = ref(0);
const inputValue = ref('');

// 选项设置
const showAvatar = ref(true);
const showTime = ref(true);
const showDateDivider = ref(true);
const scrollToBottom = ref(true);

// 示例消息数据
const messages = ref<Message[]>([
  {
    id: '1',
    content: '你好，欢迎使用 LiaoKit 聊天组件库！',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'LiaoKit 助手',
    time: new Date(new Date().getTime() - 86400000 * 2), // 2天前
  },
  {
    id: '2',
    content: '这是一个基于 Vue 3 的聊天界面组件库，旨在提供灵活、美观且易于集成的聊天相关组件。',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'LiaoKit 助手',
    time: new Date(new Date().getTime() - 86400000 * 2 + 60000), // 2天前+1分钟
  },
  {
    id: '3',
    content: '你好，我想了解一下这个组件库的功能特性。',
    isSelf: true,
    time: new Date(new Date().getTime() - 86400000), // 1天前
  },
  {
    id: '4',
    content: '这个组件库支持**Markdown**格式、`代码块`和其他富文本功能！\n\n```js\nconsole.log("Hello LiaoKit!");\n```',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'LiaoKit 助手',
    time: new Date(new Date().getTime() - 86400000 + 120000), // 1天前+2分钟
  },
  {
    id: '5',
    type: 'image',
    content: 'placeholderImages.default_500x300',
    alt: '示例图片',
    isSelf: true,
    time: new Date(new Date().getTime() - 3600000), // 1小时前
  }
]);

// 模拟消息数据生成
const getRandomMessage = (isSelf = false): Message => {
  const messageTypes = ['text', 'image'];
  const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
  
  const now = new Date();
  const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  if (messageType === 'text') {
    const textMessages = [
      '这是一条测试消息',
      '你好，很高兴认识你！',
      '这个聊天组件真不错！',
      '支持多种消息类型，包括文本、图片等',
      'LiaoKit 提供了丰富的自定义选项',
      '使用非常简单，只需几行代码就能集成',
      '希望这个组件库对你有所帮助',
      '如果有任何问题，欢迎反馈'
    ];
    
    return {
      id,
      content: textMessages[Math.floor(Math.random() * textMessages.length)],
      isSelf,
      avatar: isSelf ? '' : 'https://randomuser.me/api/portraits/men/32.jpg',
      name: isSelf ? '我' : 'LiaoKit 助手',
      time: now,
    };
  } else {
    const width = Math.floor(Math.random() * 300) + 200;
    const height = Math.floor(Math.random() * 200) + 150;
    
    return {
      id,
      type: 'image',
      content: `https://picsum.photos/${width}/${height}?random=${id}`,
      alt: '随机图片',
      isSelf,
      avatar: isSelf ? '' : 'https://randomuser.me/api/portraits/men/32.jpg',
      name: isSelf ? '我' : 'LiaoKit 助手',
      time: now,
    };
  }
};

// 发送消息
const sendMessage = (content: string) => {
  if (!content.trim()) return;
  
  // 添加用户消息
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    content,
    isSelf: true,
    time: new Date(),
    status: 'sending',
  };
  
  messages.value.push(newMessage);
  
  // 模拟发送延迟
  setTimeout(() => {
    // 更新消息状态为已发送
    const lastIndex = messages.value.length - 1;
    messages.value[lastIndex] = {
      ...messages.value[lastIndex],
      status: 'sent',
    };
    
    // 模拟助手回复
    setTimeout(() => {
      const reply = getRandomMessage(false);
      messages.value.push(reply);
      
      // 如果用户不在底部，增加未读计数
      if (!scrollToBottom.value) {
        unreadCount.value += 1;
      }
    }, 1000);
  }, 500);
};

// 添加随机消息
const addRandomMessage = () => {
  const message = getRandomMessage(Math.random() > 0.5);
  messages.value.push(message);
};

// 加载更多消息
const handleLoadMore = () => {
  loadingMore.value = true;
  
  // 模拟加载延迟
  setTimeout(() => {
    // 添加历史消息
    const historicalMessages: Message[] = [];
    for (let i = 0; i < 5; i++) {
      const isSelf = Math.random() > 0.5;
      const messageTime = new Date(
        new Date().getTime() - 86400000 * 3 - Math.random() * 86400000 * 7
      );
      
      historicalMessages.push({
        id: `history-${Date.now()}-${i}`,
        content: `这是历史消息 ${i + 1}`,
        isSelf,
        avatar: isSelf ? '' : 'https://randomuser.me/api/portraits/men/32.jpg',
        name: isSelf ? '我' : 'LiaoKit 助手',
        time: messageTime,
      });
    }
    
    messages.value = [...historicalMessages, ...messages.value];
    loadingMore.value = false;
    
    // 如果历史消息已加载完毕
    if (messages.value.length > 30) {
      hasMore.value = false;
    }
  }, 1000);
};

// 加载历史消息
const loadOlderMessages = () => {
  handleLoadMore();
};

// 切换加载状态
const toggleLoading = () => {
  loading.value = !loading.value;
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
};

// 滚动到底部事件处理
const handleScrollToBottom = () => {
  // 重置未读计数
  unreadCount.value = 0;
};

onMounted(() => {
  // 模拟初始加载
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style lang="scss" scoped>
.message-list-example {
  padding: $spacing-lg;
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    margin-bottom: $spacing-lg;
    color: $text-primary;
  }
  
  .example-container {
    display: flex;
    gap: $spacing-xl;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .message-list-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 600px;
    border: 1px solid $border-color;
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $shadow-sm;
  }
  
  .control-panel {
    width: 300px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  .control-group {
    background-color: $bg-primary;
    border: 1px solid $border-color;
    border-radius: $border-radius-md;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    
    h3 {
      margin-top: 0;
      margin-bottom: $spacing-md;
      font-size: $font-size-md;
      color: $text-primary;
    }
    
    button {
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius-sm;
      padding: $spacing-sm $spacing-md;
      margin-right: $spacing-sm;
      margin-bottom: $spacing-sm;
      cursor: pointer;
      transition: background-color $transition-duration $transition-timing-function;
      
      &:hover {
        background-color: color.adjust($primary-color, $lightness: -10%);
      }
    }
  }
  
  .control-item {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-sm;
    
    label {
      flex: 1;
      color: $text-primary;
    }
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }
  }
}
</style> 