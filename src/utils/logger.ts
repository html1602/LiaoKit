/**
 * LiaoKit 组件库日志管理工具
 * 自动检测运行环境，只在组件库开发环境中输出日志
 */

// 扩展Window接口以支持开发标识
declare global {
  interface Window {
    __LIAO_KIT_DEV__?: boolean;
  }
}

// 检测是否为组件库开发环境
const isDevelopment = (): boolean => {
  // 方法1: 检查是否在Vite开发服务器中
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return true;
  }
  
  // 方法2: 检查Node环境变量
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    return true;
  }
  
  // 方法3: 检查URL是否为本地开发地址
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' || 
                       hostname.startsWith('192.168.') ||
                       hostname.endsWith('.local');
    
    // 只有在本地开发环境且端口为开发端口时才算开发环境
    const port = window.location.port;
    const isDevPort = port === '5173' || port === '3000' || port === '8080' || port === '4173';
    
    return isLocalhost && isDevPort;
  }
  
  // 方法4: 检查是否存在特定的开发标识
  if (typeof window !== 'undefined' && (window as any).__LIAO_KIT_DEV__) {
    return true;
  }
  
  return false;
};

// 缓存环境检测结果，避免重复检测
const isDevEnvironment = isDevelopment();

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
  enabled?: boolean;
  level?: LogLevel;
  prefix?: string;
  showTimestamp?: boolean;
  showLevel?: boolean;
}

/**
 * LiaoKit 日志管理器
 */
class LiaoLogger {
  private config: Required<LoggerConfig>;
  
  constructor(config: LoggerConfig = {}) {
    this.config = {
      enabled: config.enabled ?? isDevEnvironment,
      level: config.level ?? LogLevel.DEBUG,
      prefix: config.prefix ?? '[LiaoKit]',
      showTimestamp: config.showTimestamp ?? true,
      showLevel: config.showLevel ?? true
    };
  }
  
  /**
   * 更新日志配置
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * 启用/禁用日志
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }
  
  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
  
  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, ...args: any[]): any[] {
    if (!this.config.enabled) return [];
    
    const parts: string[] = [];
    
    // 添加前缀
    if (this.config.prefix) {
      parts.push(this.config.prefix);
    }
    
    // 添加时间戳
    if (this.config.showTimestamp) {
      const timestamp = new Date().toLocaleTimeString();
      parts.push(`[${timestamp}]`);
    }
    
    // 添加日志级别
    if (this.config.showLevel) {
      const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
      parts.push(`[${levelNames[level]}]`);
    }
    
    const prefix = parts.join(' ');
    return prefix ? [prefix, ...args] : args;
  }
  
  /**
   * 检查是否应该输出特定级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }
  
  /**
   * 调试日志
   */
  debug(...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(...this.formatMessage(LogLevel.DEBUG, ...args));
    }
  }
  
  /**
   * 信息日志
   */
  info(...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(...this.formatMessage(LogLevel.INFO, ...args));
    }
  }
  
  /**
   * 警告日志
   */
  warn(...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(...this.formatMessage(LogLevel.WARN, ...args));
    }
  }
  
  /**
   * 错误日志
   */
  error(...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(...this.formatMessage(LogLevel.ERROR, ...args));
    }
  }
  
  /**
   * 分组日志开始
   */
  group(label: string): void {
    if (this.config.enabled) {
      console.group(...this.formatMessage(LogLevel.INFO, label));
    }
  }
  
  /**
   * 分组日志结束
   */
  groupEnd(): void {
    if (this.config.enabled) {
      console.groupEnd();
    }
  }
  
  /**
   * 表格日志
   */
  table(data: any): void {
    if (this.config.enabled) {
      console.table(data);
    }
  }
  
  /**
   * 计时开始
   */
  time(label: string): void {
    if (this.config.enabled) {
      console.time(`${this.config.prefix} ${label}`);
    }
  }
  
  /**
   * 计时结束
   */
  timeEnd(label: string): void {
    if (this.config.enabled) {
      console.timeEnd(`${this.config.prefix} ${label}`);
    }
  }
  
  /**
   * 创建子日志器
   */
  createChild(prefix: string, config?: Partial<LoggerConfig>): LiaoLogger {
    return new LiaoLogger({
      ...this.config,
      ...config,
      prefix: `${this.config.prefix}[${prefix}]`
    });
  }
}

// 创建默认日志器实例
export const logger = new LiaoLogger();

// 创建组件专用日志器
export const createComponentLogger = (componentName: string): LiaoLogger => {
  return logger.createChild(componentName);
};

// 兼容性方法，用于逐步替换console调用
export const logInDev = {
  log: (...args: any[]) => logger.debug(...args),
  info: (...args: any[]) => logger.info(...args),
  warn: (...args: any[]) => logger.warn(...args),
  error: (...args: any[]) => logger.error(...args),
  group: (label: string) => logger.group(label),
  groupEnd: () => logger.groupEnd(),
  table: (data: any) => logger.table(data),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string) => logger.timeEnd(label)
};

// 导出类型和常量
export { LiaoLogger, isDevelopment, isDevEnvironment };

// 默认导出
export default logger; 