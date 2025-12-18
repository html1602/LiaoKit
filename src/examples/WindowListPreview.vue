<template>
  <div class="window-list-preview">
    <!-- 页面标题 -->
    <div class="preview-header">
      <h1>LiaoWindowList 多窗口管理组件预览</h1>
      <p>体验企业级多窗口/多会话智能客服系统的强大功能</p>
    </div>

    <!-- 功能控制面板 -->
    <div class="control-panel">
      <div class="control-section">
        <h3>窗口操作</h3>
        <div class="control-buttons">
          <LiaoButton @click="createWindow" type="primary">
            <LiaoIcon name="plus" />
            创建窗口
          </LiaoButton>
          <LiaoButton @click="simulateMessage" type="success">
            <LiaoIcon name="message" />
            模拟消息
          </LiaoButton>
          <LiaoButton @click="simulateFileUpload" type="default">
            <LiaoIcon name="file" />
            模拟文件
          </LiaoButton>
          <LiaoButton @click="clearAllUnread" type="warning">
            <LiaoIcon name="check" />
            清空未读
          </LiaoButton>
          <LiaoButton @click="closeAllWindows" type="danger">
            <LiaoIcon name="close" />
            关闭所有
          </LiaoButton>
        </div>
      </div>

      <div class="control-section">
        <h3>布局模式</h3>
        <div class="layout-buttons">
          <LiaoButton 
            v-for="layout in layoutModes" 
            :key="layout.value"
            @click="setLayoutMode(layout.value)"
            :type="currentLayout === layout.value ? 'primary' : 'default'"
            size="small"
          >
            {{ layout.label }}
          </LiaoButton>
        </div>
      </div>

      <div class="control-section">
        <h3>模式切换</h3>
        <div class="mode-buttons">
          <LiaoButton 
            @click="toggleDevice" 
            :type="isMobile ? 'primary' : 'default'"
            size="small"
          >
            <LiaoIcon :name="isMobile ? 'mobile' : 'desktop'" />
            {{ isMobile ? '移动端' : '桌面端' }}
          </LiaoButton>
          <LiaoButton 
            @click="toggleAIMode" 
            :type="isAIMode ? 'success' : 'default'"
            size="small"
          >
            <LiaoIcon name="robot" />
            {{ isAIMode ? 'AI模式' : '人工模式' }}
          </LiaoButton>
        </div>
      </div>
    </div>

    <!-- 状态监控 -->
    <div class="status-panel">
      <div class="status-item">
        <span class="status-label">活跃窗口:</span>
        <span class="status-value">{{ windowStats.totalWindows }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">未读消息:</span>
        <span class="status-value unread">{{ totalUnreadCount }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">布局模式:</span>
        <span class="status-value">{{ layoutModes.find(l => l.value === currentLayout)?.label }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">设备模式:</span>
        <span class="status-value">{{ isMobile ? '移动端' : '桌面端' }}</span>
      </div>
    </div>

    <!-- 真正的LiaoWindowList组件 -->
    <div class="window-container" :class="[
      `layout-${currentLayout}`,
      { 'mobile-mode': isMobile }
    ]">
      <LiaoWindowList
        ref="windowListRef"
        :max-window-count="isMobile ? 3 : 8"
        :default-layout="currentLayout"
        :device-type="isMobile ? 'mobile' : 'desktop'"
        :auto-create-first="true"
        @window-created="onWindowCreated"
        @window-closed="onWindowClosed"
        @window-activated="onWindowActivated"
        @window-minimized="onWindowMinimized"
        @window-restored="onWindowRestored"
        @layout-changed="onLayoutChanged"
      >
        <template #window-content="{ window, isActive }">
          <WindowContent 
            :window="window"
            :is-active="isActive"
            :session-data="getSessionData(window.id)"
            @send-message="handleSendMessage"
            @switch-mode="handleSwitchMode"
          />
        </template>
      </LiaoWindowList>
    </div>

    <!-- 空状态提示 -->
    <div v-if="windowStats.totalWindows === 0" class="empty-state">
      <LiaoIcon name="window" size="xlarge" class="empty-icon" />
      <h3>暂无活跃窗口</h3>
      <p>点击上方"创建窗口"按钮开始体验多窗口管理功能</p>
      <LiaoButton @click="createWindow" type="primary" size="large">
        <LiaoIcon name="plus" />
        创建第一个窗口
      </LiaoButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import LiaoButton from '../components/LiaoButton/LiaoButton.vue';
import LiaoIcon from '../components/LiaoIcon/LiaoIcon.vue';
import LiaoWindowList from '../components/LiaoWindowList/LiaoWindowList.vue';
import WindowContent from './components/WindowContent.vue';
import type { WindowInfo, LayoutMode } from '../types/window';

// 消息接口定义
interface Message {
  id: number;
  type: 'user' | 'agent' | 'ai' | 'system' | 'file';
  content: string;
  timestamp: Date;
  // 文件相关属性
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  fileStatus?: string;
  fileProgress?: number;
  fileError?: string;
}

// 会话数据接口
interface SessionData {
  messages: Message[];
  inputValue: string;
}

// 响应式数据
const windowListRef = ref<any>(null);
const currentLayout = ref<LayoutMode>('free');
const isMobile = ref<boolean>(false);
const isAIMode = ref<boolean>(true);

// 存储会话数据的 Map
const sessionDataMap = ref<Map<string, SessionData>>(new Map());

// 统计数据
const windowStats = ref({
  totalWindows: 0,
  unreadCount: 0,
  activeWindowId: null as string | null
});

// 布局模式配置
const layoutModes = [
  { value: 'free', label: '自由布局' },
  { value: 'grid', label: '网格布局' },
  { value: 'cascade', label: '层叠布局' },
  { value: 'tile', label: '平铺布局' }
];

// 计算总未读数
const totalUnreadCount = computed(() => {
  return windowStats.value.unreadCount;
});

// 用户头像和名字池
const userPool = [
  { name: '张小明', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '李小红', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '王大华', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '刘小美', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '陈小强', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '赵小丽', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '孙小军', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '周小花', avatar: new URL('../static/my.png', import.meta.url).href }
];

const agentPool = [
  { name: 'AI助手小智', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '客服小王', avatar: new URL('../static/my.png', import.meta.url).href },
  { name: '客服小李', avatar: new URL('../static/my.png', import.meta.url).href }
];

// 获取会话数据的辅助函数
const getSessionData = (windowId: string): SessionData => {
  if (!sessionDataMap.value.has(windowId)) {
    console.log('🔧 在getSessionData中为windowId创建会话数据:', windowId);
    
    // 创建默认的会话数据（这应该很少发生，因为onWindowCreated会处理）
    sessionDataMap.value.set(windowId, {
      messages: [
        {
          id: 1,
          type: 'user' as const,
          content: `你好，我想咨询一下产品相关的问题，请问有人在吗？`,
          timestamp: new Date()
        }
      ],
      inputValue: ''
    });
    
    // 强制触发响应式更新
    sessionDataMap.value = new Map(sessionDataMap.value);
    console.log('🔧 已在getSessionData中创建默认会话数据，消息数:', sessionDataMap.value.get(windowId)?.messages.length);
  }
  return sessionDataMap.value.get(windowId)!;
};

// 窗口操作函数
const createWindow = () => {
  if (windowListRef.value) {
    // 使用LiaoWindowList的createWindow方法
    windowListRef.value.createWindow();
  }
};

const simulateMessage = () => {
  if (windowStats.value.totalWindows === 0) {
    createWindow();
    return;
  }

  // 模拟向当前活跃窗口发送消息
  if (windowStats.value.activeWindowId) {
    const messages = [
      '请问这个产品的价格是多少？',
      '我遇到了技术问题，能帮我解决一下吗？',
      '我的订单什么时候能发货？',
      '能详细介绍一下产品功能吗？',
      '现在有什么优惠活动吗？',
      '你们的退换货政策是怎样的？',
      '还有客服在线吗？',
      '好的，我明白了，谢谢！'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const sessionData = getSessionData(windowStats.value.activeWindowId);
    
    const newMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: randomMessage,
      timestamp: new Date()
    };

    sessionData.messages.push(newMessage);
    windowStats.value.unreadCount += 1;
    
    // 强制触发响应式更新
    sessionDataMap.value = new Map(sessionDataMap.value);
    
    console.log('模拟消息:', randomMessage);
  }
};

const simulateFileUpload = () => {
  if (windowStats.value.totalWindows === 0) {
    createWindow();
    return;
  }

  // 模拟向当前活跃窗口上传文件
  if (windowStats.value.activeWindowId) {
    const sessionData = getSessionData(windowStats.value.activeWindowId);
    
    // 模拟不同类型的文件
    const mockFiles = [
      {
        fileName: '常见问题.md',
        fileSize: 15 * 1024, // 15KB
        fileType: 'text/markdown',
        fileUrl: 'data:text/plain;base64,IyDluLjop4HplK7psbgg5rS7Vkljdm9jZQ==', // 模拟base64数据
      },
      {
        fileName: '产品介绍.pdf',
        fileSize: 2.5 * 1024 * 1024, // 2.5MB
        fileType: 'application/pdf',
        fileUrl: '#', // 模拟PDF文件
      },
      {
        fileName: '客户截图.png',
        fileSize: 890 * 1024, // 890KB
        fileType: 'image/png',
        fileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1像素透明图片
      },
      {
        fileName: '演示视频.mp4',
        fileSize: 10.2 * 1024 * 1024, // 10.2MB
        fileType: 'video/mp4',
        fileUrl: '#', // 模拟视频文件
      },
      {
        fileName: '订单数据.xlsx',
        fileSize: 456 * 1024, // 456KB
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileUrl: '#', // 模拟Excel文件
      }
    ];
    
    // 随机选择一个文件类型
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    
    const fileMessage = {
      id: Date.now(),
      type: 'file' as const,  // 文件类型消息
      content: '',
      timestamp: new Date(),
      fileName: randomFile.fileName,
      fileSize: randomFile.fileSize,
      fileType: randomFile.fileType,
      fileUrl: randomFile.fileUrl,
      fileStatus: 'success',
      fileProgress: 100,
      fileError: ''
    };

    sessionData.messages.push(fileMessage);
    
    // 强制触发响应式更新
    sessionDataMap.value = new Map(sessionDataMap.value);
    
    console.log('模拟文件上传:', randomFile.fileName);
    
    // 模拟AI回复
    if (isAIMode.value) {
      setTimeout(() => {
        const aiReply = {
          id: Date.now() + 1,
          type: 'ai' as const,
          content: `我已经收到了您发送的文件"${randomFile.fileName}"，正在为您分析处理中...`,
          timestamp: new Date()
        };
        
        sessionData.messages.push(aiReply);
        sessionDataMap.value = new Map(sessionDataMap.value);
      }, 1000);
    }
  }
};

const clearAllUnread = () => {
  windowStats.value.unreadCount = 0;
  console.log('清空所有未读消息');
};

const closeAllWindows = () => {
  if (windowListRef.value) {
    // 这里需要通过windowManager来关闭所有窗口
    // 暂时使用简单的重新加载
    windowStats.value.totalWindows = 0;
    windowStats.value.activeWindowId = null;
    sessionDataMap.value.clear();
  }
  console.log('关闭所有窗口');
};

// 布局和模式切换
const setLayoutMode = (layout: string) => {
  currentLayout.value = layout as LayoutMode;
  if (windowListRef.value) {
    windowListRef.value.applyLayout(layout);
  }
  console.log('切换布局模式:', layout);
};

const toggleDevice = () => {
  isMobile.value = !isMobile.value;
  console.log('切换设备模式:', isMobile.value ? '移动端' : '桌面端');
};

const toggleAIMode = () => {
  isAIMode.value = !isAIMode.value;
  console.log('切换AI模式:', isAIMode.value ? 'AI模式' : '人工模式');
};

// 窗口事件处理
const onWindowCreated = (window: WindowInfo) => {
  console.log('✅ 窗口创建事件:', window);
  windowStats.value.totalWindows++;
  windowStats.value.activeWindowId = window.id;
  
  // 为新窗口设置用户信息（如果还没有的话）
  if (!window.userInfo) {
    const user = userPool[Math.floor(Math.random() * userPool.length)];
    window.userInfo = {
      id: `user-${Date.now()}`,
      name: user.name,
      avatar: user.avatar
    };
  }
  
  if (!window.agentInfo) {
    const agent = agentPool[Math.floor(Math.random() * agentPool.length)];
    window.agentInfo = {
      id: `agent-${Date.now()}`,
      name: agent.name,
      avatar: agent.avatar,
      status: 'online'
    };
  }
  
  // 更新窗口标题为更有意义的名称
  if (window.title && window.title.startsWith('新对话')) {
    window.title = `与 ${window.userInfo.name} 的对话`;
  }
  
  // 创建初始会话数据，使用真实的用户名
  if (!sessionDataMap.value.has(window.id)) {
    sessionDataMap.value.set(window.id, {
      messages: [
        {
          id: 1,
          type: 'user' as const,
          content: `你好，我想咨询一下产品相关的问题，请问有人在吗？`,
          timestamp: new Date()
        }
      ],
      inputValue: ''
    });
    
    // 强制触发响应式更新
    sessionDataMap.value = new Map(sessionDataMap.value);
    console.log('✅ 已为窗口创建初始会话数据:', window.id);
  }
};

const onWindowClosed = (windowId: string) => {
  console.log('窗口关闭事件:', windowId);
  windowStats.value.totalWindows--;
  if (windowStats.value.activeWindowId === windowId) {
    windowStats.value.activeWindowId = null;
  }
  
  // 清理会话数据
  sessionDataMap.value.delete(windowId);
};

const onWindowActivated = (windowId: string) => {
  console.log('窗口激活事件:', windowId);
  windowStats.value.activeWindowId = windowId;
};

const onWindowMinimized = (windowId: string) => {
  console.log('窗口最小化事件:', windowId);
};

const onWindowRestored = (windowId: string) => {
  console.log('窗口恢复事件:', windowId);
};

const onLayoutChanged = (layout: LayoutMode) => {
  console.log('布局更改事件:', layout);
  currentLayout.value = layout;
};

const handleSendMessage = (windowId: string, message: string) => {
  console.log('=== WindowListPreview 处理消息开始 ===');
  console.log('1. 接收到消息:', message);
  console.log('2. 目标窗口ID:', windowId);
  console.log('🔧 当前windowsData中的所有ID:', Array.from(sessionDataMap.value.keys()));
  console.log('🔧 当前windowsData完整信息:', Array.from(sessionDataMap.value.values()));
  console.log('🔧 目标窗口ID长度:', windowId.length);
  console.log('🔧 现有窗口ID长度:', Array.from(sessionDataMap.value.keys()).map(id => ({ id, length: id.length })));
  
  const sessionData = getSessionData(windowId);
  console.log('3. 获取的会话数据:', sessionData);
  console.log('4. 添加消息前的消息数量:', sessionData.messages.length);
  
  // 添加客服消息
  const newMessage = {
    id: Date.now(),
    type: 'agent' as const,  // 客服发送的消息
    content: message,
    timestamp: new Date()
  };
  
  sessionData.messages.push(newMessage);
  console.log('5. 新消息已添加:', newMessage);
  console.log('6. 添加消息后的消息数量:', sessionData.messages.length);

  // 强制触发响应式更新
  sessionDataMap.value = new Map(sessionDataMap.value);
  console.log('7. 响应式更新已触发');

  console.log('用户消息已添加:', message, '当前消息数:', sessionData.messages.length);

  // 模拟自动回复
  if (isAIMode.value) {
    console.log('8. AI模式开启，准备自动回复');
    setTimeout(() => {
      const aiReplies = [
        '您好！我来帮您查询一下相关信息。',
        '好的，我会立即为您处理这个问题。',
        '根据您的情况，我建议您可以尝试以下方案...',
        '感谢您的咨询，我很乐意为您解答。',
        '我已经为您记录了这个问题，稍后会有专人跟进。',
        '这个产品确实很不错，让我为您详细介绍一下。',
        '关于这个问题，我们有专门的解决方案。',
        '不客气！还有其他问题请随时咨询。'
      ];
      
      const aiReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai' as const,
        content: aiReply,
        timestamp: new Date()
      };
      
      sessionData.messages.push(aiMessage);
      console.log('9. AI回复已添加:', aiMessage);

      // 再次强制触发响应式更新
      sessionDataMap.value = new Map(sessionDataMap.value);
      console.log('10. AI回复响应式更新已触发');
      
      console.log('AI回复已添加:', aiReply, '当前消息数:', sessionData.messages.length);
    }, 1000 + Math.random() * 2000);
  }
  console.log('=== WindowListPreview 处理消息结束 ===');
};

const handleSwitchMode = (windowId: string) => {
  // 由于我们不再直接管理窗口对象，这个功能需要通过其他方式实现
  // 暂时只记录日志
  console.log('切换窗口模式:', windowId);
};

// 初始化
onMounted(() => {
  console.log('多窗口预览页面已加载 - 使用真正的LiaoWindowList组件');
  
  // 注释掉手动创建，因为LiaoWindowList设置了auto-create-first="true"
  // setTimeout(() => {
  //   createWindow();
  // }, 500);
});
</script>

<style lang="scss" scoped>
.window-list-preview {
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.preview-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  h1 {
    font-size: 32px;
    color: #1e293b;
    margin-bottom: 10px;
    font-weight: 700;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 16px;
    color: #64748b;
    margin: 0;
  }
}

.control-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  .control-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.05);

    h3 {
      margin: 0 0 15px 0;
      color: #374151;
      font-size: 16px;
      font-weight: 600;
    }

    .control-buttons,
    .layout-buttons,
    .mode-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  }
}

.status-panel {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;

  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .status-label {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }

    .status-value {
      color: #1e293b;
      font-weight: 600;
      font-size: 14px;

      &.unread {
        background: #ef4444;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        min-width: 20px;
        text-align: center;
      }
    }
  }
}

.window-container {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  height: 1000px;
  box-sizing: border-box;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.layout-grid {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(59, 130, 246, 0.2);
  }

  &.layout-cascade {
    background: rgba(16, 185, 129, 0.05);
    border-color: rgba(16, 185, 129, 0.2);
  }

  &.layout-tile {
    background: rgba(245, 158, 11, 0.05);
    border-color: rgba(245, 158, 11, 0.2);
  }

  &.mobile-mode {
    padding: 10px;
    background: rgba(139, 69, 19, 0.05);
    border-color: rgba(139, 69, 19, 0.2);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  .empty-icon {
    margin-bottom: 20px;
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 10px 0;
    color: #374151;
    font-size: 24px;
  }

  p {
    margin: 0 0 30px 0;
    font-size: 16px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .window-list-preview {
    padding: 10px;
  }

  .preview-header {
    padding: 15px;
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
    }
  }

  .control-panel {
    grid-template-columns: 1fr;
  }

  .status-panel {
    flex-direction: column;
    gap: 10px;
  }

  .window-container {
    padding: 10px;
    min-height: 400px;
  }
}
</style> 
