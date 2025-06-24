<template>
  <div 
    ref="containerRef"
    class="liao-window-list"
    :class="[
      `liao-window-list--${deviceType}`,
      `liao-window-list--layout-${layoutMode}`,
      { 'liao-window-list--dragging': dragState.isDragging }
    ]"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <!-- 桌面端工具栏 -->
    <div v-if="deviceType === 'desktop'" class="liao-window-list__toolbar">
      <button 
        class="liao-window-list__create-btn"
        :disabled="windows.length >= maxWindowCount"
        @click="handleCreateWindow"
      >
        <LiaoIcon name="plus" />
        新建窗口
      </button>
      
      <div class="liao-window-list__layout-buttons">
        <button
          v-for="mode in layoutModes"
          :key="mode.value"
          class="liao-window-list__layout-btn"
          :class="{ 'liao-window-list__layout-btn--active': layoutMode === mode.value }"
          :title="mode.label"
          @click="handleLayoutChange(mode.value)"
        >
          <LiaoIcon :name="mode.icon" />
        </button>
      </div>
    </div>

    <!-- 移动端标签栏 -->
    <div v-if="deviceType === 'mobile'" class="liao-window-list__tabs">
      <div class="liao-window-list__tabs-container">
        <button
          v-for="window in windows"
          :key="window.id"
          class="liao-window-list__tab"
          :class="{ 
            'liao-window-list__tab--active': window.isActive,
            'liao-window-list__tab--unread': window.unreadCount > 0
          }"
          @click="handleActivateWindow(window.id)"
        >
          <span class="liao-window-list__tab-title">{{ window.title }}</span>
          <span v-if="window.unreadCount > 0" class="liao-window-list__tab-badge">
            {{ window.unreadCount > 99 ? '99+' : window.unreadCount }}
          </span>
          <button
            v-if="windows.length > 1"
            class="liao-window-list__tab-close"
            @click.stop="handleCloseWindow(window.id)"
          >
            <LiaoIcon name="close" />
          </button>
        </button>
        
        <button 
          class="liao-window-list__tab liao-window-list__tab--add"
          :disabled="windows.length >= maxWindowCount"
          @click="handleCreateWindow"
        >
          <LiaoIcon name="plus" />
        </button>
      </div>
    </div>

    <!-- 窗口容器 -->
    <div 
      class="liao-window-list__container"
      :style="containerStyle"
    >
      <!-- 桌面端多窗口 -->
      <template v-if="deviceType === 'desktop'">
        <Transition
          v-for="window in windows"
          :key="window.id"
          name="window"
          appear
        >
          <div
            v-show="!window.isMinimized"
            class="liao-window-list__window-wrapper"
            :class="{
              'liao-window-list__window-wrapper--active': window.isActive,
              'liao-window-list__window-wrapper--dragging': window.isDragging
            }"
            :style="getWindowStyle(window)"
            @mousedown="handleWindowMouseDown(window.id, $event)"
          >
            <LiaoWindow
              :title="window.title"
              :width="`${window.size.width}px`"
              :height="`${window.size.height}px`"
              :show-close="true"
              :show-minimize="true"
              :show-maximize="false"
              @close="handleCloseWindow(window.id)"
              @minimize="handleMinimizeWindow(window.id)"
            >
              <template #header>
                <div
                  class="liao-window-list__header-wrapper"
                  @mousedown="handleHeaderMouseDown(window.id, $event)"
                >
                  <LiaoWindowHeader
                    :title="window.title"
                    :show-close="true"
                    :show-minimize="true"
                    :show-maximize="false"
                    @close="handleCloseWindow(window.id)"
                    @minimize="handleMinimizeWindow(window.id)"
                  >
                    <template #left>
                      <span class="liao-window-list__window-mode-indicator" 
                            :class="`liao-window-list__window-mode-indicator--${window.mode}`">
                        <LiaoIcon :name="window.mode === 'AI' ? 'robot' : 'user'" />
                      </span>
                    </template>
                    
                    <template #title>
                      <span class="liao-window-list__window-title-content">
                        {{ window.title }}
                        <span v-if="window.unreadCount > 0" class="liao-window-list__window-badge">
                          {{ window.unreadCount }}
                        </span>
                      </span>
                    </template>
                  </LiaoWindowHeader>
                </div>
              </template>

              <!-- 窗口内容插槽 -->
              <slot 
                name="window-content"
                :window="window"
                :is-active="window.isActive"
                :session-data="getSessionData(window.id)"
              >
                <div class="liao-window-list__default-content">
                  <p>窗口内容区域</p>
                  <p>窗口ID: {{ window.id }}</p>
                  <p>模式: {{ window.mode }}</p>
                  <p>状态: {{ window.status }}</p>
                </div>
              </slot>
            </LiaoWindow>
          </div>
        </Transition>
      </template>

      <!-- 移动端单窗口内容 -->
      <template v-else>
        <div v-if="activeWindow" class="liao-window-list__mobile-content">
          <slot 
            name="window-content"
            :window="activeWindow"
            :is-active="true"
            :session-data="getSessionData(activeWindow.id)"
          >
            <div class="liao-window-list__default-content">
              <p>移动端窗口内容</p>
              <p>当前窗口: {{ activeWindow.title }}</p>
              <p>模式: {{ activeWindow.mode }}</p>
            </div>
          </slot>
        </div>
      </template>
    </div>

    <!-- 最小化窗口栏 -->
    <div 
      v-if="deviceType === 'desktop' && minimizedWindows.length > 0" 
      class="liao-window-list__minimized-bar"
    >
      <button
        v-for="window in minimizedWindows"
        :key="window.id"
        class="liao-window-list__minimized-window"
        :class="{ 'liao-window-list__minimized-window--unread': window.unreadCount > 0 }"
        @click="handleRestoreWindow(window.id)"
      >
        <LiaoIcon :name="window.mode === 'AI' ? 'robot' : 'user'" />
        {{ window.title }}
        <span v-if="window.unreadCount > 0" class="liao-window-list__minimized-badge">
          {{ window.unreadCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { PropType } from 'vue';
import { useWindowManager } from '../../composables/useWindowManager';
import type { 
  WindowInfo, 
  LayoutMode, 
  WindowManagerConfig,
  DeviceType 
} from '../../types/window';
import LiaoWindow from '../LiaoWindow/LiaoWindow.vue';
import LiaoWindowHeader from '../LiaoWindowHeader/LiaoWindowHeader.vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

const props = defineProps({
  // 初始窗口列表
  initialWindows: {
    type: Array as PropType<Partial<WindowInfo>[]>,
    default: () => []
  },
  
  // 最大窗口数量
  maxWindowCount: {
    type: Number,
    default: 10
  },
  
  // 默认布局模式
  defaultLayout: {
    type: String as PropType<LayoutMode>,
    default: 'free'
  },
  
  // 窗口管理器配置
  config: {
    type: Object as PropType<Partial<WindowManagerConfig>>,
    default: () => ({})
  },
  
  // 响应式断点
  mobileBreakpoint: {
    type: Number,
    default: 768
  },
  
  // 是否自动创建第一个窗口
  autoCreateFirst: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  'window-created',
  'window-closed', 
  'window-activated',
  'window-minimized',
  'window-restored',
  'layout-changed',
  'device-type-changed'
]);

// 容器引用
const containerRef = ref<HTMLElement>();

// 使用窗口管理器
const windowManager = useWindowManager({
  maxWindowCount: props.maxWindowCount,
  ...props.config
});

const {
  windows,
  activeWindowId,
  layoutMode,
  deviceType,
  dragState,
  activeWindow,
  visibleWindows,
  minimizedWindows,
  createWindow,
  closeWindow,
  activateWindow,
  minimizeWindow,
  restoreWindow,
  startDrag,
  duringDrag,
  endDrag,
  applyLayout,
  updateContainerSize,
  updateDeviceType
} = windowManager;

// 布局模式选项
const layoutModes = [
  { value: 'free', label: '自由', icon: 'layout-free' },
  { value: 'grid', label: '网格', icon: 'layout-grid' },
  { value: 'cascade', label: '层叠', icon: 'layout-cascade' },
  { value: 'tile', label: '平铺', icon: 'layout-tile' }
] as const;

// 容器样式
const containerStyle = computed(() => ({
  position: 'relative' as const,
  width: '100%',
  height: deviceType.value === 'mobile' ? 'calc(100% - 48px)' : '100%'
}));

// 获取窗口样式
const getWindowStyle = (window: WindowInfo) => ({
  position: 'absolute' as const,
  left: `${window.position.x}px`,
  top: `${window.position.y}px`,
  zIndex: window.zIndex,
  transform: window.isDragging ? 'rotate(2deg)' : 'none',
  opacity: window.isDragging ? 0.8 : 1,
  transition: window.isDragging ? 'none' : 'all 0.3s ease-out'
});

// 获取会话数据（由外部提供）
const getSessionData = (windowId: string) => {
  // 这里应该从外部 props 或 store 获取会话数据
  return {
    sessionId: windowId,
    messages: [],
    // 其他会话相关数据...
  };
};

// 检测设备类型
const detectDeviceType = (): DeviceType => {
  return window.innerWidth >= props.mobileBreakpoint ? 'desktop' : 'mobile';
};

// 更新容器尺寸
const updateSize = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    updateContainerSize({
      width: rect.width,
      height: rect.height
    });
  }
};

// 事件处理器
const handleCreateWindow = () => {
  try {
    const newWindow = createWindow({
      title: `新对话 ${windows.value.length + 1}`
    });
    emit('window-created', newWindow);
  } catch (error) {
    console.error('创建窗口失败:', error);
  }
};

const handleCloseWindow = (windowId: string) => {
  const success = closeWindow(windowId);
  if (success) {
    emit('window-closed', windowId);
  }
};

const handleActivateWindow = (windowId: string) => {
  const success = activateWindow(windowId);
  if (success) {
    emit('window-activated', windowId);
  }
};

const handleMinimizeWindow = (windowId: string) => {
  const success = minimizeWindow(windowId);
  if (success) {
    emit('window-minimized', windowId);
  }
};

const handleRestoreWindow = (windowId: string) => {
  const success = restoreWindow(windowId);
  if (success) {
    emit('window-restored', windowId);
  }
};

const handleLayoutChange = (mode: LayoutMode) => {
  applyLayout(mode);
  emit('layout-changed', mode);
};

// 拖拽事件处理
const handleWindowMouseDown = (windowId: string, event: MouseEvent) => {
  // 只有点击窗口非交互区域才激活
  const target = event.target as HTMLElement;
  if (!target.closest('.liao-window-list__window-header')) {
    handleActivateWindow(windowId);
  }
};

const handleHeaderMouseDown = (windowId: string, event: MouseEvent) => {
  event.preventDefault();
  
  const window = windows.value.find(w => w.id === windowId);
  if (!window) return;
  
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const offset = {
    x: event.clientX - window.position.x,
    y: event.clientY - window.position.y
  };
  
  startDrag(windowId, { x: event.clientX, y: event.clientY }, offset);
};

const handleMouseMove = (event: MouseEvent) => {
  if (dragState.isDragging) {
    duringDrag({ x: event.clientX, y: event.clientY });
  }
};

const handleMouseUp = () => {
  if (dragState.isDragging) {
    endDrag();
  }
};

// 响应式处理
const handleResize = () => {
  const newDeviceType = detectDeviceType();
  if (newDeviceType !== deviceType.value) {
    updateDeviceType(newDeviceType);
    emit('device-type-changed', newDeviceType);
  }
  updateSize();
};

// 生命周期
onMounted(async () => {
  // 初始化设备类型和容器尺寸
  updateDeviceType(detectDeviceType());
  updateSize();
  
  // 创建初始窗口
  if (props.initialWindows.length > 0) {
    props.initialWindows.forEach(windowOptions => {
      createWindow(windowOptions);
    });
  } else if (props.autoCreateFirst) {
    handleCreateWindow();
  }
  
  // 应用默认布局
  await nextTick();
  applyLayout(props.defaultLayout);
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 监听窗口变化
watch(() => windows.value.length, (newCount, oldCount) => {
  if (newCount === 0 && oldCount > 0 && props.autoCreateFirst) {
    // 如果所有窗口都被关闭，自动创建一个新窗口
    nextTick(() => {
      handleCreateWindow();
    });
  }
});

// 对外暴露的方法
defineExpose({
  createWindow: handleCreateWindow,
  closeWindow: handleCloseWindow,
  activateWindow: handleActivateWindow,
  minimizeWindow: handleMinimizeWindow,
  restoreWindow: handleRestoreWindow,
  applyLayout: handleLayoutChange,
  getWindowManager: () => windowManager
});
</script>

<style lang="scss" scoped>
.liao-window-list {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  overflow: hidden;

  // 桌面端样式
  &--desktop {
    padding: 20px;
    box-sizing: border-box;
  }

  // 移动端样式
  &--mobile {
    padding: 0;
  }

  // 拖拽状态
  &--dragging {
    user-select: none;
    cursor: move;
  }
}

// 工具栏
.liao-window-list__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.liao-window-list__create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #2669ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #1e5ae8;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #bfbfbf;
    cursor: not-allowed;
  }
}

.liao-window-list__layout-buttons {
  display: flex;
  gap: 4px;
  background: #f5f7fa;
  padding: 4px;
  border-radius: 8px;
}

.liao-window-list__layout-btn {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;

  &--active {
    background: #2669ff;
    color: white;
  }

  &:hover:not(.liao-window-list__layout-btn--active) {
    background: white;
    color: #2669ff;
  }
}

// 移动端标签栏
.liao-window-list__tabs {
  background: white;
  border-bottom: 1px solid #eceef2;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.liao-window-list__tabs-container {
  display: flex;
  gap: 8px;
  min-height: 48px;
  align-items: center;
}

.liao-window-list__tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #eceef2;
  border-radius: 18px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;

  &--active {
    background: #2669ff;
    color: white;
    border-color: #2669ff;
  }

  &--unread {
    font-weight: 600;
  }

  &--add {
    min-width: 36px;
    justify-content: center;
  }

  &:hover:not(.liao-window-list__tab--active) {
    background: white;
    color: #2669ff;
  }
}

.liao-window-list__tab-title {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.liao-window-list__tab-badge,
.liao-window-list__window-badge,
.liao-window-list__minimized-badge {
  background: #ff4757;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

.liao-window-list__tab-close {
  padding: 2px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }
}

// 窗口容器
.liao-window-list__container {
  position: relative;
  flex: 1;
}

// 窗口包装器
.liao-window-list__window-wrapper {
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease-out;

  &--active {
    box-shadow: 0 15px 35px rgba(38, 105, 255, 0.2);
  }

  &--dragging {
    transform: rotate(2deg);
    opacity: 0.8;
    transition: none;
    box-shadow: 0 20px 40px rgba(38, 105, 255, 0.3);
  }
}

// 移动端内容
.liao-window-list__mobile-content {
  height: 100%;
  overflow: hidden;
}

// 默认内容
.liao-window-list__default-content {
  padding: 20px;
  text-align: center;
  color: #666;
}

// 最小化栏
.liao-window-list__minimized-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.liao-window-list__minimized-window {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f5f7fa;
  border: 1px solid #eceef2;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &--unread {
    font-weight: 600;
    border-color: #2669ff;
  }

  &:hover {
    background: #2669ff;
    color: white;
    border-color: #2669ff;
  }
}

// 窗口动画
.window-enter-active,
.window-leave-active {
  transition: all 0.3s ease-out;
}

.window-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.window-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

// 响应式设计
@media (max-width: 768px) {
  .liao-window-list {
    &--desktop {
      padding: 0;
    }
  }
  
  .liao-window-list__toolbar {
    border-radius: 0;
    margin-bottom: 0;
  }
}

// 窗口头部扩展样式
.liao-window-list__header-wrapper {
  cursor: move;
  user-select: none;
}

.liao-window-list__window-mode-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-right: 8px;

  &--AI {
    background: #00b578;
  }

  &--human {
    background: #3b82f6;
  }
}

.liao-window-list__window-title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.liao-window-list__window-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: #ff4757;
  color: white;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}
</style> 