# LiaoWindow 组件使用指南

![版本](https://img.shields.io/badge/版本-2.5.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

## 组件介绍

LiaoWindow 是一个智能窗口容器组件，模拟操作系统窗口体验，提供全局会话状态管理功能。组件支持窗口控制、状态管理、插件系统集成，并为聊天应用和消息交互场景提供完整的基础架构。

## 功能特性

- **窗口控制系统**：支持关闭、最小化、最大化等窗口操作
- **全局状态管理**：统一管理会话模式、输入锁定状态
- **智能锁定机制**：根据业务场景自动锁定/解锁用户输入
- **插件系统集成**：为插件提供状态管理和生命周期控制
- **紧急解锁功能**：防止死锁，确保交互始终可用
- **状态持久化**：支持状态记忆和恢复
- **事件系统**：丰富的事件回调，便于业务集成
- **响应式设计**：适配各种屏幕尺寸和设备类型

## 基础用法

### 简单窗口容器

```vue
<template>
  <LiaoWindow
    title="聊天窗口"
    :width="'500px'"
    :height="'700px'"
    @close="handleClose"
  >
    <p>窗口内容区域</p>
  </LiaoWindow>
</template>

<script setup>
import LiaoWindow from '@/components/LiaoWindow/LiaoWindow.vue';

const handleClose = () => {
  console.log('窗口关闭');
};
</script>
```

### 完整功能配置

```vue
<template>
  <LiaoWindow
    title="智能聊天助手"
    :width="'600px'"
    :height="'800px'"
    :max-width="'1200px'"
    :max-height="'1000px'"
    :min-width="'400px'"
    :min-height="'600px'"
    :rounded="true"
    :shadow="true"
    :show-close="true"
    :show-minimize="true"
    :show-maximize="true"
    :default-session-mode="'human'"
    :enable-emergency-unlock="true"
    :auto-unlock-timeout="30000"
    custom-class="my-window"
    @close="handleClose"
    @minimize="handleMinimize"
    @maximize="handleMaximize"
    @session-mode-change="handleSessionModeChange"
    @input-lock-change="handleLockChange"
    @plugin-complete="handlePluginComplete"
    @plugin-cancel="handlePluginCancel"
    @plugin-error="handlePluginError"
    @emergency-unlock="handleEmergencyUnlock"
  >
    <!-- 主要内容区域 -->
    <template #default="{ 
      sessionMode, 
      isInputLocked, 
      activePlugin, 
      lockReason,
      onLockInput,
      onUnlockInput,
      onPluginComplete,
      onPluginCancel,
      onPluginError,
      onEmergencyUnlock
    }">
      <div class="chat-container">
        <LiaoMessageList 
          :messages="messages"
          @plugin-complete="onPluginComplete"
          @plugin-cancel="onPluginCancel"
          @plugin-error="onPluginError"
        />
        <LiaoInputArea
          v-model="inputText"
          :disabled="isInputLocked"
          :lock-reason="lockReason"
          @send="handleSend"
        />
      </div>
    </template>
    
    <!-- 自定义窗口头部 -->
    <template #header>
      <div class="custom-header">
        <h3>{{ windowTitle }}</h3>
        <div class="status-indicator">
          <span :class="['status', sessionMode]">
            {{ sessionMode === 'AI' ? 'AI模式' : '人工模式' }}
          </span>
        </div>
      </div>
    </template>
    
    <!-- 自定义窗口底部 -->
    <template #footer>
      <div class="window-footer">
        <span class="connection-status">已连接</span>
        <span class="user-info">当前用户: {{ currentUser }}</span>
      </div>
    </template>
  </LiaoWindow>
</template>

<script setup>
import { ref } from 'vue';
import type { SessionMode, LockReason, ActivePlugin } from '@/types/session';

const inputText = ref('');
const messages = ref([]);
const windowTitle = ref('智能聊天助手');
const currentUser = ref('用户123');

const handleClose = () => {
  console.log('关闭窗口');
};

const handleMinimize = () => {
  console.log('最小化窗口');
};

const handleMaximize = () => {
  console.log('最大化窗口');
};

const handleSessionModeChange = ({ oldMode, newMode }) => {
  console.log(`会话模式变更: ${oldMode} -> ${newMode}`);
  windowTitle.value = newMode === 'AI' ? 'AI智能助手' : '人工客服';
};

const handleLockChange = ({ locked, reason, plugin }) => {
  console.log('锁定状态变化:', { locked, reason, plugin });
};

const handleSend = (text) => {
  console.log('发送消息:', text);
  // 处理消息发送逻辑
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| title | String | '' | 窗口标题 |
| width | String/Number | '400px' | 窗口宽度 |
| height | String/Number | '600px' | 窗口高度 |
| maxWidth | String/Number | '800px' | 最大宽度 |
| maxHeight | String/Number | '800px' | 最大高度 |
| minWidth | String/Number | '320px' | 最小宽度 |
| minHeight | String/Number | '500px' | 最小高度 |
| rounded | Boolean | true | 是否显示圆角 |
| shadow | Boolean | true | 是否显示阴影 |
| showClose | Boolean | true | 是否显示关闭按钮 |
| showMinimize | Boolean | true | 是否显示最小化按钮 |
| showMaximize | Boolean | true | 是否显示最大化按钮 |
| customClass | String | '' | 自定义CSS类名 |
| defaultSessionMode | String | 'human' | 默认会话模式（'human'/'AI'） |
| enableEmergencyUnlock | Boolean | true | 是否启用紧急解锁 |
| autoUnlockTimeout | Number | 30000 | 自动解锁超时时间（毫秒） |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| close | () | 点击关闭按钮时触发 |
| minimize | () | 点击最小化按钮时触发 |
| maximize | () | 点击最大化按钮时触发 |
| session-mode-change | ({ oldMode, newMode }) | 会话模式变化时触发 |
| input-lock-change | ({ locked, reason, plugin }) | 输入锁定状态变化时触发 |
| plugin-complete | (data) | 插件完成时触发 |
| plugin-cancel | (data) | 插件取消时触发 |
| plugin-error | (data) | 插件错误时触发 |
| emergency-unlock | () | 紧急解锁时触发 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|-----|---|---|
| default | sessionState | 主要内容区域，提供状态管理上下文 |
| header | - | 自定义窗口头部 |
| footer | - | 自定义窗口底部 |

### 默认插槽参数 (sessionState)

```typescript
interface SessionState {
  sessionMode: 'human' | 'AI';           // 当前会话模式
  isInputLocked: boolean;                // 输入是否被锁定
  activePlugin: ActivePlugin | null;     // 当前活跃的插件
  lockReason: LockReason | null;         // 锁定原因
  onLockInput: (reason, plugin?) => void;    // 锁定输入方法
  onUnlockInput: () => void;             // 解锁输入方法
  onPluginComplete: (data) => void;      // 插件完成处理方法
  onPluginCancel: (data) => void;        // 插件取消处理方法
  onPluginError: (data) => void;         // 插件错误处理方法
  onEmergencyUnlock: () => void;         // 紧急解锁方法
}
```

## 会话状态管理详解

### 会话模式 (SessionMode)

```typescript
type SessionMode = 'human' | 'AI';
```

- **human**: 人工模式，用户与人工客服对话
- **AI**: AI模式，用户与AI助手对话

### 锁定原因 (LockReason)

```typescript
type LockReason = 
  | 'AI_REPLYING'      // AI正在回复中
  | 'PLUGIN_PENDING'   // 插件操作待完成
  | 'FORM_REQUIRED'    // 表单填写必须完成
  | 'VOTE_REQUIRED'    // 投票选择必须完成
  | 'CUSTOM'           // 自定义锁定原因
  | null;
```

### 活跃插件 (ActivePlugin)

```typescript
interface ActivePlugin {
  id: string;          // 插件唯一标识
  type: string;        // 插件类型
  required: boolean;   // 是否必须完成
  data?: any;         // 插件数据
}
```

## 高级用法

### 状态管理器模式

```vue
<template>
  <LiaoWindow
    ref="windowRef"
    :default-session-mode="sessionMode"
    :auto-unlock-timeout="autoUnlockTime"
    @input-lock-change="handleLockChange"
  >
    <template #default="{ onLockInput, onUnlockInput }">
      <ChatApp
        :lock-input="onLockInput"
        :unlock-input="onUnlockInput"
        @send-message="handleSendMessage"
      />
    </template>
  </LiaoWindow>
</template>

<script setup>
import { ref, watch } from 'vue';

const windowRef = ref();
const sessionMode = ref('human');
const autoUnlockTime = ref(30000);

// 动态切换会话模式
const switchToAI = () => {
  windowRef.value.setSessionMode('AI');
  // AI模式下设置较短的超时时间
  autoUnlockTime.value = 15000;
};

const switchToHuman = () => {
  windowRef.value.setSessionMode('human');
  // 人工模式下设置较长的超时时间
  autoUnlockTime.value = 60000;
};

// 监听锁定状态变化
const handleLockChange = ({ locked, reason, plugin }) => {
  if (locked) {
    console.log(`输入已锁定: ${reason}`);
    if (plugin) {
      console.log('活跃插件:', plugin);
    }
  } else {
    console.log('输入已解锁');
  }
};

// 处理消息发送
const handleSendMessage = async (message) => {
  // 如果是AI模式，锁定输入等待AI回复
  if (sessionMode.value === 'AI') {
    windowRef.value.lockInput('AI_REPLYING');
    
    try {
      const response = await sendToAI(message);
      // AI回复完成后自动解锁
      windowRef.value.unlockInput();
    } catch (error) {
      // 错误时也要解锁
      windowRef.value.unlockInput();
      console.error('AI回复失败:', error);
    }
  }
};
</script>
```

### 插件生命周期管理

```vue
<template>
  <LiaoWindow
    :enable-emergency-unlock="true"
    @plugin-complete="handlePluginComplete"
    @plugin-cancel="handlePluginCancel"
    @plugin-error="handlePluginError"
    @emergency-unlock="handleEmergencyUnlock"
  >
    <template #default="{ onLockInput, onUnlockInput, onPluginComplete }">
      <div class="plugin-container">
        <LiaoMessageList 
          :messages="messages"
          @plugin-action="handlePluginAction"
        />
        
        <!-- 插件操作面板 -->
        <div v-if="currentPlugin" class="plugin-panel">
          <h4>{{ currentPlugin.title }}</h4>
          <p>{{ currentPlugin.description }}</p>
          <button @click="completePlugin">完成操作</button>
          <button @click="cancelPlugin">取消操作</button>
        </div>
      </div>
    </template>
  </LiaoWindow>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);
const currentPlugin = ref(null);

const handlePluginAction = (action) => {
  if (action.type === 'start') {
    currentPlugin.value = action.plugin;
    
    // 如果是必须完成的插件，锁定输入
    if (action.plugin.required) {
      onLockInput('PLUGIN_PENDING', action.plugin);
    }
  }
};

const completePlugin = () => {
  if (currentPlugin.value) {
    handlePluginComplete({
      plugin: currentPlugin.value,
      result: 'completed'
    });
    currentPlugin.value = null;
  }
};

const cancelPlugin = () => {
  if (currentPlugin.value) {
    handlePluginCancel({
      plugin: currentPlugin.value,
      result: 'cancelled'
    });
    currentPlugin.value = null;
  }
};

const handlePluginComplete = (data) => {
  console.log('插件完成:', data);
  // 插件完成后自动解锁（如果是必须完成的插件）
};

const handlePluginCancel = (data) => {
  console.log('插件取消:', data);
  // 非必须插件取消后解锁，必须插件保持锁定
};

const handlePluginError = (data) => {
  console.error('插件错误:', data);
  // 错误时解锁，允许用户继续操作
};

const handleEmergencyUnlock = () => {
  console.warn('触发紧急解锁');
  currentPlugin.value = null;
  // 清理所有插件状态，恢复正常交互
};
</script>
```

### 自定义锁定策略

```vue
<template>
  <LiaoWindow
    ref="windowRef"
    :auto-unlock-timeout="0"
    @input-lock-change="handleLockChange"
  >
    <template #default="{ onLockInput, onUnlockInput }">
      <div class="custom-lock-demo">
        <div class="lock-controls">
          <button @click="lockForCustomReason">自定义锁定</button>
          <button @click="lockForForm">表单锁定</button>
          <button @click="lockForVote">投票锁定</button>
          <button @click="unlockManually">手动解锁</button>
        </div>
        
        <div class="lock-status">
          <p>锁定状态: {{ isLocked ? '已锁定' : '未锁定' }}</p>
          <p v-if="lockReason">锁定原因: {{ getLockReasonText(lockReason) }}</p>
        </div>
      </div>
    </template>
  </LiaoWindow>
</template>

<script setup>
import { ref } from 'vue';

const windowRef = ref();
const isLocked = ref(false);
const lockReason = ref(null);

const lockForCustomReason = () => {
  windowRef.value.lockInput('CUSTOM', {
    id: 'custom-1',
    type: 'custom',
    required: true,
    data: { message: '正在处理特殊业务...' }
  });
};

const lockForForm = () => {
  windowRef.value.lockInput('FORM_REQUIRED', {
    id: 'form-1',
    type: 'form',
    required: true,
    data: { formType: '用户信息表单' }
  });
};

const lockForVote = () => {
  windowRef.value.lockInput('VOTE_REQUIRED', {
    id: 'vote-1',
    type: 'vote',
    required: true,
    data: { voteType: '功能优先级投票' }
  });
};

const unlockManually = () => {
  windowRef.value.unlockInput();
};

const handleLockChange = ({ locked, reason }) => {
  isLocked.value = locked;
  lockReason.value = reason;
};

const getLockReasonText = (reason) => {
  const reasonMap = {
    'AI_REPLYING': 'AI正在回复中',
    'PLUGIN_PENDING': '插件操作待完成',
    'FORM_REQUIRED': '表单填写必须完成',
    'VOTE_REQUIRED': '投票选择必须完成',
    'CUSTOM': '自定义锁定'
  };
  return reasonMap[reason] || '未知原因';
};
</script>
```

## 组件方法 (Exposed)

通过模板引用可以访问以下方法：

```vue
<template>
  <LiaoWindow ref="windowRef" />
</template>

<script setup>
import { ref } from 'vue';

const windowRef = ref();

// 访问组件方法
windowRef.value.lockInput('AI_REPLYING');
windowRef.value.unlockInput();
windowRef.value.emergencyUnlock();
windowRef.value.setSessionMode('AI');
</script>
```

### 方法列表

| 方法名 | 参数 | 返回值 | 说明 |
|-----|---|-----|---|
| lockInput | (reason: LockReason, plugin?: ActivePlugin) | void | 锁定输入 |
| unlockInput | () | void | 解锁输入 |
| emergencyUnlock | () | void | 紧急解锁 |
| setSessionMode | (mode: SessionMode) | void | 设置会话模式 |

### 计算属性访问

| 属性名 | 类型 | 说明 |
|-----|---|---|
| sessionMode | Ref\<SessionMode> | 当前会话模式 |
| isInputLocked | Ref\<boolean> | 输入锁定状态 |
| activePlugin | Ref\<ActivePlugin \| null> | 当前活跃插件 |
| lockReason | Ref\<LockReason \| null> | 锁定原因 |

## 样式定制

### CSS 变量

```scss
.liao-window {
  // 窗口容器
  --window-bg-color: #ffffff;
  --window-border-color: #e8e8e8;
  --window-border-radius: 8px;
  --window-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  // 窗口头部
  --header-bg-color: #f8f9fa;
  --header-border-color: #e8e8e8;
  --header-height: 48px;
  
  // 窗口底部
  --footer-bg-color: #f8f9fa;
  --footer-border-color: #e8e8e8;
  --footer-height: 40px;
  
  // 内容区域
  --body-bg-color: #ffffff;
  --body-padding: 0;
}
```

### 自定义主题

```vue
<template>
  <div class="dark-window-theme">
    <LiaoWindow title="深色主题窗口">
      <p>深色主题内容</p>
    </LiaoWindow>
  </div>
</template>

<style scoped>
.dark-window-theme {
  .liao-window {
    --window-bg-color: #1a1a1a;
    --window-border-color: #333333;
    --header-bg-color: #2a2a2a;
    --footer-bg-color: #2a2a2a;
    --body-bg-color: #1a1a1a;
    color: #ffffff;
  }
}
</style>
```

### 自定义窗口样式

```vue
<template>
  <LiaoWindow
    custom-class="modern-window"
    :rounded="true"
    :shadow="true"
  >
    <template #header>
      <div class="modern-header">
        <div class="header-left">
          <img src="/logo.png" alt="Logo" class="logo" />
          <h3>现代化窗口</h3>
        </div>
        <div class="header-right">
          <span class="status-badge online">在线</span>
        </div>
      </div>
    </template>
    
    <div class="modern-content">
      <p>现代化设计的窗口内容</p>
    </div>
  </LiaoWindow>
</template>

<style scoped>
.modern-window {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  
  .modern-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .logo {
        width: 24px;
        height: 24px;
        border-radius: 4px;
      }
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      
      &.online {
        background-color: rgba(82, 196, 26, 0.2);
        color: #52c41a;
      }
    }
  }
  
  .modern-content {
    padding: 24px;
    background: #fafafa;
  }
}
</style>
```

## 最佳实践

### 1. 状态管理模式

```vue
<!-- 推荐：集中式状态管理 -->
<template>
  <LiaoWindow
    ref="windowRef"
    @input-lock-change="updateGlobalState"
    @session-mode-change="updateGlobalState"
  >
    <ChatApplication />
  </LiaoWindow>
</template>

<script setup>
import { useGlobalState } from '@/stores/globalState';

const globalState = useGlobalState();
const windowRef = ref();

const updateGlobalState = (stateData) => {
  globalState.updateWindowState(stateData);
};
</script>
```

### 2. 错误处理

```vue
<template>
  <LiaoWindow
    @plugin-error="handleError"
    @emergency-unlock="handleEmergencyUnlock"
  >
    <template #default="{ onLockInput, onUnlockInput }">
      <ErrorBoundary @error="handleComponentError">
        <ChatInterface />
      </ErrorBoundary>
    </template>
  </LiaoWindow>
</template>

<script setup>
const handleError = (error) => {
  console.error('插件错误:', error);
  // 发送错误报告
  reportError(error);
  // 显示用户友好的错误信息
  showErrorMessage('操作失败，请稍后重试');
};

const handleComponentError = (error) => {
  console.error('组件错误:', error);
  // 组件错误时自动解锁，防止界面卡死
  windowRef.value?.emergencyUnlock();
};
</script>
```

### 3. 性能优化

```vue
<template>
  <LiaoWindow
    :auto-unlock-timeout="optimizedTimeout"
    @input-lock-change="debouncedLockHandler"
  >
    <KeepAlive>
      <ChatComponent v-if="isVisible" />
    </KeepAlive>
  </LiaoWindow>
</template>

<script setup>
import { debounce } from 'lodash-es';

// 根据设备性能调整超时时间
const optimizedTimeout = computed(() => {
  return isLowEndDevice() ? 60000 : 30000;
});

// 防抖处理锁定状态变化
const debouncedLockHandler = debounce((lockData) => {
  handleLockChange(lockData);
}, 100);
</script>
```

## 无障碍支持

### ARIA 标签

组件自动添加适当的 ARIA 标签：

```html
<!-- 自动生成的无障碍标签 -->
<div 
  class="liao-window"
  role="dialog"
  aria-labelledby="window-title"
  aria-describedby="window-content"
>
  <header aria-label="窗口头部">
    <h1 id="window-title">{{ title }}</h1>
  </header>
  <main id="window-content" aria-label="窗口内容">
    <!-- 内容区域 -->
  </main>
</div>
```

### 键盘导航

支持标准的键盘快捷键：

- **Escape**: 关闭窗口
- **F11**: 全屏切换
- **Alt + F4**: 关闭窗口（Windows）
- **Cmd + W**: 关闭窗口（macOS）

## 注意事项

1. **状态同步**：确保组件状态与业务逻辑保持同步
2. **内存管理**：及时清理定时器和事件监听器
3. **错误边界**：建议在窗口内容中添加错误边界组件
4. **性能考虑**：大量状态变化时注意性能优化
5. **用户体验**：提供清晰的锁定状态提示
6. **移动端适配**：注意移动端的窗口尺寸和交互方式

## 浏览器兼容性

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- 移动端：iOS Safari 12+, Android Chrome 70+

## 更新日志

### 2.5.0 (2025-06-16)
- 🔧 修复Vue Script Setup导出错误
- 🔄 重构类型系统，使用独立的session.ts类型文件
- ✨ 完善全局状态管理系统，优化锁定/解锁机制
- 🎯 新增紧急解锁功能，防止界面死锁
- 📱 改进移动端窗口体验和触摸交互

### 2.4.0 (2025-06-15)
- ✨ 新增会话模式管理，支持AI/人工模式切换
- 🔒 完善输入锁定机制，支持多种锁定原因
- 🎯 集成插件系统状态管理
- 🎨 优化窗口控制按钮样式和交互

### 2.3.0 (2025-06-14)
- 🚀 重构状态管理架构，提供统一的状态接口
- ✨ 新增自动解锁超时机制
- 🎨 改进窗口样式和主题定制能力
- 🔧 优化事件系统和回调处理

### 2.2.0 (2025-06-13)
- ✨ 新增窗口控制功能（最小化、最大化、关闭）
- 🎯 实现响应式窗口尺寸控制
- 🎨 完善窗口样式和布局系统
- 📱 改进移动端适配

### 2.1.0 (2025-06-12)
- ✨ 初始版本发布，基础窗口容器功能
- 🎨 实现现代化窗口设计
- 🚀 建立组件架构和API接口
- 📝 创建基础文档和示例 