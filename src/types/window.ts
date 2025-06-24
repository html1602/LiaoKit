// 窗口信息接口
export interface WindowInfo {
  id: string;
  title: string;
  userInfo?: {
    name: string;
    avatar?: string;
    id: string;
  };
  agentInfo?: {
    name: string;
    avatar?: string;
    id: string;
    status: 'online' | 'offline' | 'busy';
  };
  mode: 'AI' | 'human';
  status: 'active' | 'inactive' | 'minimized' | 'loading' | 'error';
  unreadCount: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  isActive: boolean;
  isMinimized: boolean;
  isDragging: boolean;
  lastActiveTime: number;
  metadata?: Record<string, any>;
}

// 布局模式类型
export type LayoutMode = 'free' | 'grid' | 'cascade' | 'tile';

// 窗口操作事件类型
export interface WindowOperationEvent {
  type: 'create' | 'close' | 'minimize' | 'restore' | 'activate' | 'move' | 'resize';
  windowId: string;
  data?: any;
}

// 拖拽状态接口
export interface DragState {
  isDragging: boolean;
  dragWindowId: string | null;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  offset: { x: number; y: number };
}

// 布局配置接口
export interface LayoutConfig {
  mode: LayoutMode;
  gridColumns?: number;
  cascadeOffset?: { x: number; y: number };
  tileGap?: number;
  containerPadding?: { top: number; right: number; bottom: number; left: number };
}

// 窗口管理器配置接口
export interface WindowManagerConfig {
  maxWindowCount: number;
  defaultWindowSize: { width: number; height: number };
  minWindowSize: { width: number; height: number };
  maxWindowSize: { width: number; height: number };
  enableDrag: boolean;
  enableResize: boolean;
  autoLayout: boolean;
  snapToGrid: boolean;
  snapThreshold: number;
  animationDuration: number;
}

// 设备类型
export type DeviceType = 'desktop' | 'mobile';

// 响应式配置
export interface ResponsiveConfig {
  breakpoint: number;
  mobileLayout: 'tabs' | 'drawer';
  desktopLayout: LayoutMode;
} 