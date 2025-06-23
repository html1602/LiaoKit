import type { FileCategory, FileTypeConfig, FileMeta } from '../types/file';

// 文件类型配置映射
export const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
  // 图片类型
  image: {
    category: 'image',
    icon: 'image',
    color: '#ff6b35',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
    mimeTypes: ['image/*']
  },
  
  // 视频类型
  video: {
    category: 'video',
    icon: 'camera',
    color: '#8e44ad',
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'],
    mimeTypes: ['video/*']
  },
  
  // 音频类型
  audio: {
    category: 'audio',
    icon: 'file',
    color: '#e74c3c',
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'],
    mimeTypes: ['audio/*']
  },
  
  // PDF
  pdf: {
    category: 'document',
    icon: 'file',
    color: '#e74c3c',
    extensions: ['pdf'],
    mimeTypes: ['application/pdf']
  },
  
  // Word文档
  word: {
    category: 'document',
    icon: 'file',
    color: '#2b579a',
    extensions: ['doc', 'docx'],
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  
  // Excel表格
  excel: {
    category: 'document',
    icon: 'file',
    color: '#217346',
    extensions: ['xls', 'xlsx', 'csv'],
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
  },
  
  // PowerPoint演示
  powerpoint: {
    category: 'document',
    icon: 'file',
    color: '#d24726',
    extensions: ['ppt', 'pptx'],
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  },
  
  // 压缩文件
  archive: {
    category: 'archive',
    icon: 'file',
    color: '#f39c12',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed']
  },
  
  // 文本文件
  text: {
    category: 'document',
    icon: 'file',
    color: '#34495e',
    extensions: ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts'],
    mimeTypes: ['text/*']
  },
  
  // 代码文件
  code: {
    category: 'document',
    icon: 'file',
    color: '#9b59b6',
    extensions: ['js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss', 'less', 'php', 'py', 'java', 'cpp', 'c'],
    mimeTypes: ['text/javascript', 'text/typescript', 'text/html', 'text/css']
  },
  
  // 默认文件
  default: {
    category: 'other',
    icon: 'file',
    color: '#95a5a6',
    extensions: [],
    mimeTypes: []
  }
};

/**
 * 根据文件名获取文件扩展名
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

/**
 * 根据文件类型和扩展名获取文件类型配置
 */
export function getFileTypeConfig(fileName: string, mimeType?: string): FileTypeConfig {
  const extension = getFileExtension(fileName);
  
  // 首先通过扩展名匹配
  for (const config of Object.values(FILE_TYPE_CONFIGS)) {
    if (config.extensions.includes(extension)) {
      return config;
    }
  }
  
  // 然后通过MIME类型匹配
  if (mimeType) {
    for (const config of Object.values(FILE_TYPE_CONFIGS)) {
      for (const mime of config.mimeTypes) {
        if (mime.includes('*')) {
          const prefix = mime.split('/')[0];
          if (mimeType.startsWith(prefix)) {
            return config;
          }
        } else if (mimeType === mime) {
          return config;
        }
      }
    }
  }
  
  return FILE_TYPE_CONFIGS.default;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成文件ID
 */
export function generateFileId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 创建FileMeta对象
 */
export function createFileMeta(file: File): FileMeta {
  const id = generateFileId();
  const config = getFileTypeConfig(file.name, file.type);
  
  return {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'waiting',
    file,
    uploadTime: Date.now()
  };
}

/**
 * 截断文件名（中间省略）
 */
export function truncateFileName(fileName: string, maxLength: number = 16): string {
  if (fileName.length <= maxLength) return fileName;
  
  const extension = getFileExtension(fileName);
  const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));
  
  if (extension.length + 4 >= maxLength) {
    return fileName.slice(0, maxLength - 3) + '...';
  }
  
  const availableLength = maxLength - extension.length - 4; // 4 for "..." and "."
  const frontLength = Math.ceil(availableLength / 2);
  const backLength = Math.floor(availableLength / 2);
  
  return nameWithoutExt.slice(0, frontLength) + '...' + nameWithoutExt.slice(-backLength) + '.' + extension;
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, accept?: string): boolean {
  if (!accept) return true;
  
  const acceptTypes = accept.split(',').map(type => type.trim());
  
  return acceptTypes.some(acceptType => {
    if (acceptType.startsWith('.')) {
      // 扩展名匹配
      const extension = getFileExtension(file.name);
      return extension === acceptType.slice(1).toLowerCase();
    } else if (acceptType.includes('/*')) {
      // MIME类型通配符匹配
      const [mainType] = acceptType.split('/');
      return file.type.startsWith(mainType);
    } else {
      // 精确MIME类型匹配
      return file.type === acceptType;
    }
  });
}

/**
 * 检查是否为图片文件
 */
export function isImageFile(file: FileMeta | File): boolean {
  const type = 'type' in file ? file.type : '';
  return type.startsWith('image/');
}

/**
 * 检查是否为视频文件
 */
export function isVideoFile(file: FileMeta | File): boolean {
  const type = 'type' in file ? file.type : '';
  return type.startsWith('video/');
}

/**
 * 检查是否为音频文件
 */
export function isAudioFile(file: FileMeta | File): boolean {
  const type = 'type' in file ? file.type : '';
  return type.startsWith('audio/');
}

/**
 * 检查文件是否支持预览
 */
export function isPreviewable(file: FileMeta | File): boolean {
  return isImageFile(file) || isVideoFile(file) || isAudioFile(file);
}

/**
 * 根据MIME类型检查是否支持预览
 */
export function isPreviewableByMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/') || 
         mimeType.startsWith('video/') || 
         mimeType.startsWith('audio/');
} 