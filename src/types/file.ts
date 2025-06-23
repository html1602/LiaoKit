// 文件预览接口定义
export interface PreviewFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  poster?: string;
  progress?: number;
  loading?: boolean;
  error?: string;
  file?: File;
  textContent?: string;
  [key: string]: any;
}

// 文件上传状态
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

// 文件消息状态
export type FileMessageStatus = 'waiting' | 'uploading' | 'success' | 'error';

// 文件元数据接口（用于Chip和Bubble组件）
export interface FileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  status?: FileMessageStatus;
  progress?: number;
  error?: string;
  file?: File;
  uploadTime?: number;
  [key: string]: any;
}

// 文件类型分类
export type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

// 文件类型配置
export interface FileTypeConfig {
  category: FileCategory;
  icon: string;
  color: string;
  extensions: string[];
  mimeTypes: string[];
}

// 文件上传配置
export interface UploadConfig {
  url: string;
  headers?: Record<string, string>;
  data?: Record<string, any>;
  timeout?: number;
}

// 文件验证规则
export interface FileValidationRules {
  maxFiles?: number;
  maxSize?: number;
  maxTotalSize?: number;
  acceptTypes?: string[];
  allowedExtensions?: string[];
}

// 文件上传事件
export interface UploadEvent {
  file: PreviewFile;
  progress?: number;
  error?: string;
  response?: any;
}

// Chip列表事件
export interface ChipEvent {
  type: 'remove' | 'preview' | 'change' | 'overlimit' | 'invalid';
  fileId?: string;
  files?: FileMeta[];
  file?: FileMeta;
} 