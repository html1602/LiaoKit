import { ref, reactive, computed, nextTick, readonly } from 'vue';
import type { 
  WindowInfo, 
  LayoutMode, 
  DragState, 
  LayoutConfig, 
  WindowManagerConfig,
  DeviceType,
  WindowOperationEvent 
} from '../types/window';

export function useWindowManager(config: Partial<WindowManagerConfig> = {}) {
  // 默认配置
  const defaultConfig: WindowManagerConfig = {
    maxWindowCount: 10,
    defaultWindowSize: { width: 400, height: 600 },
    minWindowSize: { width: 300, height: 400 },
    maxWindowSize: { width: 800, height: 800 },
    enableDrag: true,
    enableResize: false,
    autoLayout: false,
    snapToGrid: false,
    snapThreshold: 20,
    animationDuration: 300
  };

  const windowConfig = reactive({ ...defaultConfig, ...config });
  
  // 状态管理
  const windows = ref<WindowInfo[]>([]);
  const activeWindowId = ref<string | null>(null);
  const layoutMode = ref<LayoutMode>('free');
  const deviceType = ref<DeviceType>('desktop');
  const containerSize = ref({ width: 0, height: 0 });
  
  // 拖拽状态
  const dragState = reactive<DragState>({
    isDragging: false,
    dragWindowId: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  // 计算属性
  const activeWindow = computed(() => 
    windows.value.find(w => w.id === activeWindowId.value)
  );

  const visibleWindows = computed(() => 
    windows.value.filter(w => !w.isMinimized)
  );

  const minimizedWindows = computed(() => 
    windows.value.filter(w => w.isMinimized)
  );

  const unreadWindowsCount = computed(() => 
    windows.value.reduce((count, w) => count + w.unreadCount, 0)
  );

  // 生成唯一窗口ID
  const generateWindowId = (): string => {
    return `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 计算下一个窗口位置
  const calculateNextPosition = (): { x: number; y: number } => {
    const windowCount = visibleWindows.value.length;
    
    if (windowCount === 0) {
      // 第一个窗口居中
      return {
        x: (containerSize.value.width - windowConfig.defaultWindowSize.width) / 2,
        y: (containerSize.value.height - windowConfig.defaultWindowSize.height) / 2
      };
    }
    
    // 后续窗口偏移
    const offset = 50;
    const lastWindow = windows.value[windows.value.length - 1];
    let newX = lastWindow.position.x + offset;
    let newY = lastWindow.position.y + offset;
    
    // 边界检测
    if (newX + windowConfig.defaultWindowSize.width > containerSize.value.width) {
      newX = 50;
    }
    if (newY + windowConfig.defaultWindowSize.height > containerSize.value.height) {
      newY = 50;
    }
    
    return { x: newX, y: newY };
  };

  // 获取最高z-index
  const getMaxZIndex = (): number => {
    return Math.max(1000, ...windows.value.map(w => w.zIndex)) + 1;
  };

  // 创建窗口
  const createWindow = (options: Partial<WindowInfo> = {}): WindowInfo => {
    if (windows.value.length >= windowConfig.maxWindowCount) {
      throw new Error(`Maximum window count (${windowConfig.maxWindowCount}) reached`);
    }

    const position = calculateNextPosition();
    const newWindow: WindowInfo = {
      id: generateWindowId(),
      title: `新对话 ${windows.value.length + 1}`,
      mode: 'human',
      status: 'active',
      unreadCount: 0,
      position,
      size: { ...windowConfig.defaultWindowSize },
      zIndex: getMaxZIndex(),
      isActive: true,
      isMinimized: false,
      isDragging: false,
      lastActiveTime: Date.now(),
      ...options
    };

    // 设置其他窗口为非激活状态
    windows.value.forEach(w => {
      w.isActive = false;
      w.status = w.status === 'active' ? 'inactive' : w.status;
    });

    windows.value.push(newWindow);
    activeWindowId.value = newWindow.id;

    return newWindow;
  };

  // 关闭窗口
  const closeWindow = (windowId: string): boolean => {
    const index = windows.value.findIndex(w => w.id === windowId);
    if (index === -1) return false;

    const wasActive = windows.value[index].isActive;
    windows.value.splice(index, 1);

    // 如果关闭的是活跃窗口，激活其他窗口
    if (wasActive && windows.value.length > 0) {
      const nextWindow = windows.value[Math.max(0, index - 1)];
      activateWindow(nextWindow.id);
    } else if (windows.value.length === 0) {
      activeWindowId.value = null;
    }

    return true;
  };

  // 激活窗口
  const activateWindow = (windowId: string): boolean => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return false;

    // 设置所有窗口为非激活状态
    windows.value.forEach(w => {
      w.isActive = false;
      w.status = w.status === 'active' ? 'inactive' : w.status;
    });

    // 激活目标窗口
    window.isActive = true;
    window.status = 'active';
    window.zIndex = getMaxZIndex();
    window.lastActiveTime = Date.now();
    
    // 如果窗口被最小化，则恢复
    if (window.isMinimized) {
      window.isMinimized = false;
    }

    activeWindowId.value = windowId;
    return true;
  };

  // 最小化窗口
  const minimizeWindow = (windowId: string): boolean => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return false;

    window.isMinimized = true;
    window.isActive = false;
    window.status = 'inactive';

    // 如果最小化的是活跃窗口，激活其他窗口
    if (activeWindowId.value === windowId) {
      const nextWindow = visibleWindows.value[0];
      if (nextWindow) {
        activateWindow(nextWindow.id);
      } else {
        activeWindowId.value = null;
      }
    }

    return true;
  };

  // 恢复窗口
  const restoreWindow = (windowId: string): boolean => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return false;

    window.isMinimized = false;
    activateWindow(windowId);
    return true;
  };

  // 移动窗口
  const moveWindow = (windowId: string, position: { x: number; y: number }): boolean => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return false;

    // 边界检测
    const maxX = containerSize.value.width - window.size.width;
    const maxY = containerSize.value.height - window.size.height;
    
    window.position.x = Math.max(0, Math.min(maxX, position.x));
    window.position.y = Math.max(0, Math.min(maxY, position.y));

    return true;
  };

  // 开始拖拽
  const startDrag = (windowId: string, startPosition: { x: number; y: number }, offset: { x: number; y: number }): void => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window || !windowConfig.enableDrag) return;

    dragState.isDragging = true;
    dragState.dragWindowId = windowId;
    dragState.startPosition = { ...startPosition };
    dragState.currentPosition = { ...startPosition };
    dragState.offset = { ...offset };

    window.isDragging = true;
    activateWindow(windowId);
  };

  // 拖拽中
  const duringDrag = (currentPosition: { x: number; y: number }): void => {
    if (!dragState.isDragging || !dragState.dragWindowId) return;

    dragState.currentPosition = { ...currentPosition };
    
    const newPosition = {
      x: currentPosition.x - dragState.offset.x,
      y: currentPosition.y - dragState.offset.y
    };

    moveWindow(dragState.dragWindowId, newPosition);
  };

  // 结束拖拽
  const endDrag = (): void => {
    if (!dragState.isDragging || !dragState.dragWindowId) return;

    const window = windows.value.find(w => w.id === dragState.dragWindowId);
    if (window) {
      window.isDragging = false;
      
      // 吸附效果
      if (windowConfig.snapToGrid) {
        applySnapToGrid(window);
      }
    }

    // 重置拖拽状态
    dragState.isDragging = false;
    dragState.dragWindowId = null;
    dragState.startPosition = { x: 0, y: 0 };
    dragState.currentPosition = { x: 0, y: 0 };
    dragState.offset = { x: 0, y: 0 };
  };

  // 网格吸附
  const applySnapToGrid = (window: WindowInfo): void => {
    const gridSize = 20;
    const snappedX = Math.round(window.position.x / gridSize) * gridSize;
    const snappedY = Math.round(window.position.y / gridSize) * gridSize;
    
    window.position.x = snappedX;
    window.position.y = snappedY;
  };

  // 应用布局
  const applyLayout = async (mode: LayoutMode): Promise<void> => {
    layoutMode.value = mode;
    
    const visibleWindowsList = visibleWindows.value;
    if (visibleWindowsList.length === 0) return;

    switch (mode) {
      case 'grid':
        await applyGridLayout(visibleWindowsList);
        break;
      case 'cascade':
        await applyCascadeLayout(visibleWindowsList);
        break;
      case 'tile':
        await applyTileLayout(visibleWindowsList);
        break;
      case 'free':
      default:
        // 自由布局不需要调整位置
        break;
    }
  };

  // 网格布局
  const applyGridLayout = async (windowsList: WindowInfo[]): Promise<void> => {
    const cols = Math.ceil(Math.sqrt(windowsList.length));
    const rows = Math.ceil(windowsList.length / cols);
    
    // 使用默认窗口尺寸，而不是动态计算
    const windowWidth = windowConfig.defaultWindowSize.width;
    const windowHeight = windowConfig.defaultWindowSize.height;
    const gap = 20; // 窗口间距
    
    // 计算起始位置，使网格居中
    const totalGridWidth = cols * windowWidth + (cols - 1) * gap;
    const totalGridHeight = rows * windowHeight + (rows - 1) * gap;
    
    const startX = Math.max(40, (containerSize.value.width - totalGridWidth) / 2);
    const startY = Math.max(40, (containerSize.value.height - totalGridHeight) / 2);
    
    windowsList.forEach((window, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // 使用固定的默认尺寸
      window.position.x = startX + col * (windowWidth + gap);
      window.position.y = startY + row * (windowHeight + gap);
      window.size.width = windowWidth;
      window.size.height = windowHeight;
    });
  };

  // 层叠布局
  const applyCascadeLayout = async (windowsList: WindowInfo[]): Promise<void> => {
    const offset = 30;
    const startX = 50;
    const startY = 50;
    
    windowsList.forEach((window, index) => {
      window.position.x = startX + (index * offset);
      window.position.y = startY + (index * offset);
      window.size = { ...windowConfig.defaultWindowSize };
      window.zIndex = 1000 + index;
    });
  };

  // 平铺布局
  const applyTileLayout = async (windowsList: WindowInfo[]): Promise<void> => {
    const windowWidth = Math.floor(containerSize.value.width / windowsList.length) - 10;
    const windowHeight = containerSize.value.height - 40;
    
    windowsList.forEach((window, index) => {
      window.position.x = index * (windowWidth + 10) + 5;
      window.position.y = 20;
      window.size.width = windowWidth;
      window.size.height = windowHeight;
    });
  };

  // 更新容器尺寸
  const updateContainerSize = (size: { width: number; height: number }): void => {
    containerSize.value = { ...size };
  };

  // 更新设备类型
  const updateDeviceType = (type: DeviceType): void => {
    deviceType.value = type;
  };

  // 清空未读数
  const clearUnreadCount = (windowId: string): boolean => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return false;
    
    window.unreadCount = 0;
    return true;
  };

  // 增加未读数
  const incrementUnreadCount = (windowId: string, count: number = 1): boolean => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return false;
    
    window.unreadCount += count;
    return true;
  };

  return {
    // 状态
    windows: readonly(windows),
    activeWindowId: readonly(activeWindowId),
    layoutMode: readonly(layoutMode),
    deviceType: readonly(deviceType),
    dragState: readonly(dragState),
    containerSize: readonly(containerSize),
    
    // 计算属性
    activeWindow,
    visibleWindows,
    minimizedWindows,
    unreadWindowsCount,
    
    // 配置
    windowConfig,
    
    // 方法
    createWindow,
    closeWindow,
    activateWindow,
    minimizeWindow,
    restoreWindow,
    moveWindow,
    startDrag,
    duringDrag,
    endDrag,
    applyLayout,
    updateContainerSize,
    updateDeviceType,
    clearUnreadCount,
    incrementUnreadCount
  };
} 