// 会话模式类型
export type SessionMode = 'AI' | 'human';

// 锁定原因类型
export type LockReason = 'AI_REPLYING' | 'PLUGIN_PENDING' | 'FORM_REQUIRED' | 'VOTE_REQUIRED' | 'CUSTOM' | null;

// 活跃插件信息类型
export interface ActivePlugin {
  id: string | number;
  type: string;
  messageId?: string | number;
  required?: boolean;
  data?: any;
}

// 全局状态管理接口
export interface LiaoSessionState {
  sessionMode: SessionMode;
  isInputLocked: boolean;
  activePlugin: ActivePlugin | null;
  lockReason: LockReason;
  lockInput: (reason: LockReason, plugin?: ActivePlugin) => void;
  unlockInput: () => void;
  emergencyUnlock: () => void;
}

// 定义provide的key
export const LIAO_SESSION_STATE_KEY = Symbol('LiaoSessionState'); 