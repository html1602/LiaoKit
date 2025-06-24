<template>
  <div class="liao-file-preview" :class="{ 'is-loading': loading }">
    <!-- 文件列表 -->
    <div v-if="files.length > 0" class="liao-file-preview-list">
      <div 
        v-for="(file, index) in files" 
        :key="index"
        class="liao-file-preview-item"
        :class="{ 'is-error': file.error }"
      >
        <!-- 文件预览区域 -->
        <div class="liao-file-preview-content">
          <!-- 图片预览 -->
          <div v-if="isImage(file)" class="liao-file-preview-image">
            <img 
              :src="file.preview || file.url" 
              :alt="file.name"
              @load="handleImageLoad(file)"
              @error="handleImageError(file)"
              @click="openPreview(file, index)"
            />
            <div v-if="file.loading" class="liao-file-preview-loading">
              <LiaoIcon name="loading" spin size="medium" />
            </div>
          </div>
          
          <!-- 视频预览 -->
          <div v-else-if="isVideo(file)" class="liao-file-preview-video">
            <video 
              :src="file.preview || file.url"
              :poster="file.poster"
              controls
              preload="metadata"
              @loadedmetadata="handleVideoLoad(file)"
              @error="handleVideoError(file)"
            >
              您的浏览器不支持视频播放
            </video>
            <div v-if="file.loading" class="liao-file-preview-loading">
              <LiaoIcon name="loading" spin size="medium" />
            </div>
          </div>
          
          <!-- 音频预览 -->
          <div v-else-if="isAudio(file)" class="liao-file-preview-audio">
            <div class="liao-file-preview-audio-icon">
              <LiaoIcon name="music" size="large" />
            </div>
            <audio 
              :src="file.preview || file.url"
              controls
              preload="metadata"
              @loadedmetadata="handleAudioLoad(file)"
              @error="handleAudioError(file)"
            >
              您的浏览器不支持音频播放
            </audio>
            <div v-if="file.loading" class="liao-file-preview-loading">
              <LiaoIcon name="loading" spin size="medium" />
            </div>
          </div>
          
          <!-- 文本预览 -->
          <div v-else-if="isText(file)" class="liao-file-preview-text" @click="openPreview(file, index)">
            <div class="liao-file-preview-text-icon">
              <LiaoIcon name="file-text" size="large" />
            </div>
            <div v-if="file.textContent" class="liao-file-preview-text-content">
              <pre>{{ file.textContent.substring(0, 200) }}{{ file.textContent.length > 200 ? '...' : '' }}</pre>
            </div>
            <div v-else-if="file.loading" class="liao-file-preview-text-placeholder">
              <LiaoIcon name="loading" spin size="small" />
            </div>
            <div v-else class="liao-file-preview-text-placeholder">
              点击预览文本内容
            </div>
          </div>
          
          <!-- 文档预览 -->
          <div v-else class="liao-file-preview-document">
            <div class="liao-file-preview-document-icon">
              <LiaoIcon :name="getFileIcon(file)" size="large" />
            </div>
            <div class="liao-file-preview-document-info">
              <div class="liao-file-preview-document-name">{{ file.name }}</div>
              <div class="liao-file-preview-document-size">{{ formatFileSize(file.size) }}</div>
            </div>
          </div>
        </div>
        
        <!-- 文件信息 -->
        <div class="liao-file-preview-info">
          <div class="liao-file-preview-name" :title="file.name">
            {{ file.name }}
          </div>
          <div class="liao-file-preview-meta">
            <span class="liao-file-preview-size">{{ formatFileSize(file.size) }}</span>
            <span v-if="file.type" class="liao-file-preview-type">{{ file.type }}</span>
          </div>
          
          <!-- 上传进度 -->
          <div v-if="file.progress !== undefined" class="liao-file-preview-progress">
            <div 
              class="liao-file-preview-progress-bar"
              :style="{ width: file.progress + '%' }"
            ></div>
            <span class="liao-file-preview-progress-text">{{ file.progress }}%</span>
          </div>
          
          <!-- 错误信息 -->
          <div v-if="file.error" class="liao-file-preview-error">
            <LiaoIcon name="error" size="small" />
            <span>{{ file.error }}</span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="liao-file-preview-actions">
          <button 
            v-if="showDownload && (file.url || file.preview)"
            class="liao-file-preview-action liao-file-preview-download"
            @click="downloadFile(file)"
            :title="'下载 ' + file.name"
          >
            <LiaoIcon name="download" size="small" />
          </button>
          
          <button 
            v-if="showPreview && canPreview(file)"
            class="liao-file-preview-action"
            @click="openPreview(file, index)"
            :title="'预览 ' + file.name"
          >
            <LiaoIcon name="eye" size="small" />
          </button>
          
          <button 
            v-if="showRemove"
            class="liao-file-preview-action liao-file-preview-remove"
            @click="removeFile(index)"
            :title="'移除 ' + file.name"
          >
            <LiaoIcon name="close" size="small" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!loading" class="liao-file-preview-empty">
      <LiaoIcon name="folder" size="large" />
      <p>{{ emptyText }}</p>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="liao-file-preview-loading-state">
      <LiaoIcon name="loading" spin size="large" />
      <p>正在处理文件...</p>
    </div>
    
    <!-- 全屏预览 -->
    <div v-if="previewVisible" class="liao-file-preview-modal" @click="closePreview">
      <div class="liao-file-preview-modal-content" @click.stop>
        <div class="liao-file-preview-modal-header">
          <h3>{{ currentPreviewFile?.name }}</h3>
          <button class="liao-file-preview-modal-close" @click="closePreview">
            <LiaoIcon name="close" size="medium" />
          </button>
        </div>
        
        <div class="liao-file-preview-modal-body">
          <!-- 图片预览 -->
          <img 
            v-if="currentPreviewFile && isImage(currentPreviewFile)"
            :src="currentPreviewFile.preview || currentPreviewFile.url"
            :alt="currentPreviewFile.name"
            class="liao-file-preview-modal-image"
          />
          
          <!-- 视频预览 -->
          <video 
            v-else-if="currentPreviewFile && isVideo(currentPreviewFile)"
            :src="currentPreviewFile.preview || currentPreviewFile.url"
            controls
            class="liao-file-preview-modal-video"
          >
            您的浏览器不支持视频播放
          </video>
          
          <!-- 音频预览 -->
          <audio 
            v-else-if="currentPreviewFile && isAudio(currentPreviewFile)"
            :src="currentPreviewFile.preview || currentPreviewFile.url"
            controls
            class="liao-file-preview-modal-audio"
          >
            您的浏览器不支持音频播放
          </audio>
          
          <!-- 文本预览 -->
          <div 
            v-else-if="currentPreviewFile && isText(currentPreviewFile)"
            class="liao-file-preview-modal-text"
          >
            <div v-if="currentPreviewFile.textContent" class="liao-file-preview-text-viewer">
              <pre>{{ currentPreviewFile.textContent }}</pre>
            </div>
            <div v-else-if="currentPreviewFile.loading" class="liao-file-preview-text-loading">
              <LiaoIcon name="loading" spin size="large" />
              <p>正在加载文本内容...</p>
            </div>
            <div v-else class="liao-file-preview-text-error">
              <p>无法加载文本内容</p>
            </div>
          </div>
        </div>
        
        <!-- 导航按钮 -->
        <div v-if="files.length > 1" class="liao-file-preview-modal-nav">
          <button 
            class="liao-file-preview-modal-nav-btn"
            :disabled="currentPreviewIndex <= 0"
            @click="prevPreview"
          >
            <LiaoIcon name="chevron-left" size="medium" />
          </button>
          <span class="liao-file-preview-modal-nav-info">
            {{ currentPreviewIndex + 1 }} / {{ files.length }}
          </span>
          <button 
            class="liao-file-preview-modal-nav-btn"
            :disabled="currentPreviewIndex >= files.length - 1"
            @click="nextPreview"
          >
            <LiaoIcon name="chevron-right" size="medium" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import type { PreviewFile } from '../../types/file';

// Props定义
const props = defineProps({
  files: {
    type: Array as PropType<PreviewFile[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showDownload: {
    type: Boolean,
    default: true
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  showRemove: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无文件'
  },
  maxPreviewSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  }
});

// 事件定义
const emit = defineEmits(['remove', 'download', 'preview', 'error']);

// 响应式数据
const previewVisible = ref(false);
const currentPreviewFile = ref<PreviewFile | null>(null);
const currentPreviewIndex = ref(0);

// 文件类型判断
const isImage = (file: PreviewFile): boolean => {
  return file.type.startsWith('image/');
};

const isVideo = (file: PreviewFile): boolean => {
  return file.type.startsWith('video/');
};

const isAudio = (file: PreviewFile): boolean => {
  return file.type.startsWith('audio/');
};

const isText = (file: PreviewFile): boolean => {
  const textTypes = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'text/csv',
    'text/xml',
    'application/json',
    'application/xml',
    'application/javascript'
  ];
  
  const textExtensions = ['txt', 'md', 'csv', 'log', 'json', 'xml', 'js', 'ts', 'css', 'html', 'vue', 'jsx', 'tsx'];
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  return textTypes.includes(file.type) || 
         file.type.startsWith('text/') || 
         (extension !== undefined && textExtensions.includes(extension));
};

const canPreview = (file: PreviewFile): boolean => {
  return isImage(file) || isVideo(file) || isAudio(file) || isText(file);
};

// 获取文件图标
const getFileIcon = (file: PreviewFile): string => {
  const type = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (type.includes('pdf')) return 'file-pdf';
  if (type.includes('word') || extension === 'doc' || extension === 'docx') return 'file-word';
  if (type.includes('excel') || extension === 'xls' || extension === 'xlsx') return 'file-excel';
  if (type.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return 'file-ppt';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'file-zip';
  if (type.includes('text')) return 'file-text';
  
  return 'file';
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 文件加载处理
const handleImageLoad = (file: PreviewFile) => {
  file.loading = false;
  file.error = undefined;
};

const handleImageError = (file: PreviewFile) => {
  file.loading = false;
  file.error = '图片加载失败';
  emit('error', { file, error: file.error });
};

const handleVideoLoad = (file: PreviewFile) => {
  file.loading = false;
  file.error = undefined;
};

const handleVideoError = (file: PreviewFile) => {
  file.loading = false;
  file.error = '视频加载失败';
  emit('error', { file, error: file.error });
};

const handleAudioLoad = (file: PreviewFile) => {
  file.loading = false;
  file.error = undefined;
};

const handleAudioError = (file: PreviewFile) => {
  file.loading = false;
  file.error = '音频加载失败';
  emit('error', { file, error: file.error });
};

const handleTextLoad = (file: PreviewFile, content: string) => {
  file.loading = false;
  file.error = undefined;
  file.textContent = content;
};

const handleTextError = (file: PreviewFile) => {
  file.loading = false;
  file.error = '文本加载失败';
  emit('error', { file, error: file.error });
};

// 使用FileReader API读取文件内容
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('文件读取结果不是文本格式'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.onabort = () => {
      reject(new Error('文件读取被中断'));
    };
    
    // 读取文件为文本
    reader.readAsText(file, 'UTF-8');
  });
};

// 加载文本内容
const loadTextContent = async (file: PreviewFile): Promise<void> => {
  if (file.textContent !== undefined || file.loading) return;
  
  file.loading = true;
  
  try {
    // 优先使用File对象（用户上传的真实文件）
    if (file.file instanceof File) {
      console.log('使用FileReader读取文件:', file.file.name);
      const content = await readFileAsText(file.file);
      handleTextLoad(file, content);
      return;
    }
    
    // 处理URL（Data URL或HTTP URL）
    const url = file.url || file.preview;
    if (!url) {
      throw new Error('没有可用的文件URL或File对象');
    }
    
    console.log('使用fetch读取URL:', url);
    
    // 处理Data URL的情况
    if (url.startsWith('data:')) {
      const base64Match = url.match(/^data:[^;]+;base64,(.+)$/);
      if (base64Match) {
        // Base64编码的Data URL
        const base64Content = base64Match[1];
        const content = atob(base64Content);
        const utf8Content = decodeURIComponent(escape(content));
        handleTextLoad(file, utf8Content);
        return;
      } else {
        // 普通的Data URL (charset=utf-8)
        const commaIndex = url.indexOf(',');
        if (commaIndex !== -1) {
          const content = decodeURIComponent(url.substring(commaIndex + 1));
          handleTextLoad(file, content);
          return;
        }
      }
    }
    
    // 处理HTTP URL的情况
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    handleTextLoad(file, content);
  } catch (error) {
    console.error('加载文本内容失败:', error);
    handleTextError(file);
  }
};

// 文件操作
const removeFile = (index: number) => {
  emit('remove', index);
};

const downloadFile = (file: PreviewFile) => {
  if (file.url || file.preview) {
    const link = document.createElement('a');
    link.href = file.url || file.preview || '';
    link.download = file.name;
    link.click();
  }
  emit('download', file);
};

const openPreview = (file: PreviewFile, index: number) => {
  if (!canPreview(file)) return;
  
  currentPreviewFile.value = file;
  currentPreviewIndex.value = index;
  previewVisible.value = true;
  
  // 为真实文件创建预览URL
  if (file.file instanceof File && !file.preview) {
    if (isImage(file) || isVideo(file) || isAudio(file)) {
      console.log('为媒体文件创建Object URL:', file.file.name);
      file.preview = URL.createObjectURL(file.file);
    }
  }
  
  // 如果是文本文件且还没有加载内容，则加载
  if (isText(file) && file.textContent === undefined) {
    loadTextContent(file);
  }
  
  emit('preview', { file, index });
};

const closePreview = () => {
  previewVisible.value = false;
  currentPreviewFile.value = null;
  currentPreviewIndex.value = 0;
};

const prevPreview = () => {
  if (currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--;
    currentPreviewFile.value = props.files[currentPreviewIndex.value];
  }
};

const nextPreview = () => {
  if (currentPreviewIndex.value < props.files.length - 1) {
    currentPreviewIndex.value++;
    currentPreviewFile.value = props.files[currentPreviewIndex.value];
  }
};

// 监听键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (!previewVisible.value) return;
  
  switch (e.key) {
    case 'Escape':
      closePreview();
      break;
    case 'ArrowLeft':
      prevPreview();
      break;
    case 'ArrowRight':
      nextPreview();
      break;
  }
};

// 组件挂载时添加键盘监听
watch(previewVisible, (visible) => {
  if (visible) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  }
});

// 清理Object URL
const cleanupObjectURL = (file: PreviewFile) => {
  if (file.preview && file.preview.startsWith('blob:')) {
    console.log('清理Object URL:', file.preview);
    URL.revokeObjectURL(file.preview);
    file.preview = undefined;
  }
};

// 监听文件变化，清理移除的文件的Object URL
watch(() => props.files, (newFiles, oldFiles) => {
  if (oldFiles) {
    // 找出被移除的文件并清理其Object URL
    oldFiles.forEach(oldFile => {
      const stillExists = newFiles.some(newFile => newFile === oldFile);
      if (!stillExists) {
        cleanupObjectURL(oldFile);
      }
    });
  }
}, { deep: true });

// 组件卸载时清理所有Object URL
onUnmounted(() => {
  props.files.forEach(file => {
    cleanupObjectURL(file);
  });
});

// 监听文件变化，为文本文件预加载内容
watch(() => props.files, (newFiles) => {
  if (!newFiles || newFiles.length === 0) return;
  
  newFiles.forEach(file => {
    // 为真实文件创建预览URL
    if (file.file instanceof File && !file.preview) {
      if (isImage(file) || isVideo(file) || isAudio(file)) {
        console.log('为媒体文件创建Object URL:', file.file.name);
        file.preview = URL.createObjectURL(file.file);
      }
    }
    
    // 为文本文件预加载内容
    if (isText(file) && file.textContent === undefined && !file.loading) {
      // 为文本文件预加载内容以支持小卡片预览
      nextTick(() => {
        loadTextContent(file);
      });
    }
  });
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
@use '../../styles/variables';

.liao-file-preview {
  width: 100%;
  
  &.is-loading {
    opacity: 0.6;
    pointer-events: none;
  }
}

.liao-file-preview-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.liao-file-preview-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  background-color: $bg-primary;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: $primary-color;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.is-error {
    border-color: $error-color;
    background-color: rgba($error-color, 0.05);
  }
}

.liao-file-preview-content {
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: $border-radius-sm;
  overflow: hidden;
  background-color: $bg-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.liao-file-preview-image {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.liao-file-preview-video {
  width: 100%;
  height: 100%;
  position: relative;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.liao-file-preview-audio {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  
  audio {
    width: 100%;
    height: 30px;
  }
}

.liao-file-preview-audio-icon {
  color: $primary-color;
}

.liao-file-preview-text {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  color: $text-secondary;
  background-color: $bg-secondary;
  border-radius: $border-radius-sm;
  position: relative;
}

.liao-file-preview-text-icon {
  color: $primary-color;
}

.liao-file-preview-text-content {
  font-size: 9px;
  line-height: 1.2;
  font-family: $font-family-mono;
  color: $text-primary;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 2px;
  max-width: 70px;
  max-height: 30px;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
  
  pre {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.liao-file-preview-text-placeholder {
  font-size: 10px;
  color: $text-tertiary;
  text-align: center;
  padding: 0 4px;
}

.liao-file-preview-document {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  color: $text-secondary;
}

.liao-file-preview-document-icon {
  color: $primary-color;
}

.liao-file-preview-document-info {
  text-align: center;
  font-size: $font-size-xs;
  line-height: 1.2;
}

.liao-file-preview-document-name {
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60px;
}

.liao-file-preview-document-size {
  color: $text-tertiary;
}

.liao-file-preview-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
}

.liao-file-preview-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.liao-file-preview-name {
  font-weight: 500;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.liao-file-preview-meta {
  display: flex;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.liao-file-preview-size {
  color: $text-tertiary;
}

.liao-file-preview-type {
  color: $text-tertiary;
  text-transform: uppercase;
}

.liao-file-preview-progress {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.liao-file-preview-progress-bar {
  flex: 1;
  height: 4px;
  background-color: $bg-tertiary;
  border-radius: 2px;
  overflow: hidden;
}

.liao-file-preview-progress-fill {
  height: 100%;
  background-color: $primary-color;
  transition: width 0.3s ease;
}

.liao-file-preview-progress-text {
  font-size: $font-size-xs;
  color: $text-secondary;
  min-width: 35px;
  text-align: right;
}

.liao-file-preview-error {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  color: $error-color;
}

.liao-file-preview-actions {
  display: flex;
  gap: $spacing-xs;
  flex-shrink: 0;
}

.liao-file-preview-action {
  width: 32px;
  height: 32px;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  background-color: $bg-primary;
  color: $text-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: $primary-color;
    color: $primary-color;
    background-color: rgba($primary-color, 0.05);
  }
  
  // 下载按钮特殊样式
  &.liao-file-preview-download {
    &:hover {
      background-color: $primary-color;
      color: white;
    }
  }
  
  &.liao-file-preview-remove {
    &:hover {
      border-color: $error-color;
      color: $error-color;
      background-color: rgba($error-color, 0.05);
    }
  }
}

.liao-file-preview-empty {
  text-align: center;
  padding: $spacing-xl;
  color: $text-tertiary;
  
  p {
    margin-top: $spacing-md;
    font-size: $font-size-md;
  }
}

.liao-file-preview-loading-state {
  text-align: center;
  padding: $spacing-xl;
  color: $text-secondary;
  
  p {
    margin-top: $spacing-md;
    font-size: $font-size-md;
  }
}

// 全屏预览样式
.liao-file-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
}

.liao-file-preview-modal-content {
  max-width: 90vw;
  max-height: 90vh;
  background-color: white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.liao-file-preview-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
  
  h3 {
    margin: 0;
    font-size: $font-size-lg;
    color: $text-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.liao-file-preview-modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: #000;
  }
}

.liao-file-preview-modal-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
  min-height: 300px;
}

.liao-file-preview-modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.liao-file-preview-modal-video {
  max-width: 100%;
  max-height: 100%;
}

.liao-file-preview-modal-audio {
  width: 100%;
  max-width: 400px;
}

.liao-file-preview-modal-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: $spacing-lg;
  background-color: $bg-primary;
  border-radius: $border-radius-md;
  max-height: 80vh;
  overflow: hidden;
}

.liao-file-preview-text-viewer {
  flex: 1;
  overflow: auto;
  background-color: $bg-secondary;
  border-radius: $border-radius-sm;
  padding: $spacing-md;
  font-family: $font-family-mono;
  
  pre {
    margin: 0;
    font-family: inherit;
    font-size: $font-size-sm;
    line-height: 1.6;
    color: $text-primary;
    white-space: pre-wrap;
    word-break: break-word;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      
      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
}

.liao-file-preview-text-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: $text-tertiary;
  padding: $spacing-xl;
  
  p {
    margin: 0;
    font-size: $font-size-sm;
  }
}

.liao-file-preview-text-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  
  p {
    margin: 0;
    font-size: $font-size-sm;
    color: $error-color;
    text-align: center;
  }
}

.liao-file-preview-modal-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  padding: $spacing-lg;
  border-top: 1px solid $border-color;
}

.liao-file-preview-modal-nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  background-color: $bg-primary;
  color: $text-secondary;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: $primary-color;
    color: $primary-color;
    background-color: rgba($primary-color, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.liao-file-preview-modal-nav-info {
  font-size: $font-size-sm;
  color: $text-secondary;
  min-width: 60px;
  text-align: center;
}

// 响应式适配
@media (max-width: 768px) {
  .liao-file-preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-sm;
  }
  
  .liao-file-preview-content {
    width: 100%;
    height: 120px;
  }
  
  .liao-file-preview-modal {
    padding: $spacing-md;
  }
  
  .liao-file-preview-modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .liao-file-preview-modal-header {
    padding: $spacing-md;
    
    h3 {
      font-size: $font-size-md;
    }
  }
  
  .liao-file-preview-modal-body {
    padding: $spacing-md;
    min-height: 200px;
  }
  
  .liao-file-preview-modal-nav {
    padding: $spacing-md;
    gap: $spacing-md;
  }
}
</style> 