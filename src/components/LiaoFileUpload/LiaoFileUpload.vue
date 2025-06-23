<template>
  <div class="liao-file-upload" :class="{ 'is-disabled': disabled }">
    <!-- 上传区域 -->
    <div 
      class="liao-file-upload-area"
      :class="{ 
        'is-dragover': isDragOver,
        'is-error': hasError,
        'has-files': files.length > 0
      }"
      @click="triggerFileSelect"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="liao-file-upload-content">
        <div class="liao-file-upload-icon">
          <LiaoIcon :name="uploadIcon" size="xlarge" />
        </div>
        <div class="liao-file-upload-text">
          <p class="liao-file-upload-primary">{{ primaryText }}</p>
          <p class="liao-file-upload-secondary">{{ secondaryText }}</p>
        </div>
        <div v-if="acceptText" class="liao-file-upload-accept">
          {{ acceptText }}
        </div>
      </div>
      
      <!-- 隐藏的文件输入 -->
      <input
        ref="fileInputRef"
        type="file"
        class="liao-file-upload-input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="handleFileSelect"
      />
    </div>
    
    <!-- 文件预览列表 -->
    <LiaoFilePreview
      v-if="files.length > 0"
      :files="files"
      :loading="uploading"
      :show-download="showDownload"
      :show-preview="showPreview"
      :show-remove="showRemove && !disabled"
      @remove="removeFile"
      @download="downloadFile"
      @preview="previewFile"
      @error="handlePreviewError"
      class="liao-file-upload-preview"
    />
    
    <!-- 上传按钮 -->
    <div v-if="files.length > 0 && showUploadButton" class="liao-file-upload-actions">
      <button
        class="liao-file-upload-button"
        :class="{ 'is-loading': uploading }"
        :disabled="disabled || uploading || !hasValidFiles"
        @click="uploadFiles"
      >
        <LiaoIcon v-if="uploading" name="loading" spin size="small" />
        <LiaoIcon v-else name="upload" size="small" />
        {{ uploading ? '上传中...' : '开始上传' }}
      </button>
      
      <button
        v-if="showClearButton"
        class="liao-file-upload-button liao-file-upload-clear"
        :disabled="uploading"
        @click="clearFiles"
      >
        <LiaoIcon name="trash" size="small" />
        清空文件
      </button>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="liao-file-upload-error">
      <LiaoIcon name="error" size="small" />
      <span>{{ errorMessage }}</span>
    </div>
    
    <!-- 上传统计 -->
    <div v-if="showStats && files.length > 0" class="liao-file-upload-stats">
      <span>共 {{ files.length }} 个文件</span>
      <span>总大小 {{ formatFileSize(totalSize) }}</span>
      <span v-if="uploadedCount > 0">已上传 {{ uploadedCount }} 个</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import LiaoFilePreview from '../LiaoFilePreview/LiaoFilePreview.vue';
import type { PreviewFile } from '../../types/file';

// Props定义
const props = defineProps({
  // 基础配置
  accept: {
    type: String,
    default: '*/*'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 文件限制
  maxFiles: {
    type: Number,
    default: 10
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  maxTotalSize: {
    type: Number,
    default: 100 * 1024 * 1024 // 100MB
  },
  
  // 界面配置
  primaryText: {
    type: String,
    default: '点击或拖拽文件到此处上传'
  },
  secondaryText: {
    type: String,
    default: '支持单个或批量上传'
  },
  acceptText: {
    type: String,
    default: ''
  },
  
  // 功能开关
  showUploadButton: {
    type: Boolean,
    default: true
  },
  showClearButton: {
    type: Boolean,
    default: true
  },
  showDownload: {
    type: Boolean,
    default: false
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  showRemove: {
    type: Boolean,
    default: true
  },
  showStats: {
    type: Boolean,
    default: true
  },
  
  // 自动上传
  autoUpload: {
    type: Boolean,
    default: false
  },
  
  // 上传配置
  uploadUrl: {
    type: String,
    default: ''
  },
  uploadHeaders: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  },
  uploadData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  
  // 预设文件
  modelValue: {
    type: Array as PropType<PreviewFile[]>,
    default: () => []
  }
});

// 事件定义
const emit = defineEmits([
  'update:modelValue',
  'change',
  'upload-start',
  'upload-progress',
  'upload-success',
  'upload-error',
  'upload-complete',
  'file-add',
  'file-remove',
  'file-preview',
  'error'
]);

// 响应式数据
const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<PreviewFile[]>([...props.modelValue]);
const isDragOver = ref(false);
const uploading = ref(false);
const errorMessage = ref('');
const uploadedCount = ref(0);

// 计算属性
const uploadIcon = computed(() => {
  if (isDragOver.value) return 'upload-cloud';
  if (files.value.length > 0) return 'folder-open';
  return 'upload';
});

const hasError = computed(() => !!errorMessage.value);

const hasValidFiles = computed(() => {
  return files.value.some((file: PreviewFile) => !file.error);
});

const totalSize = computed(() => {
  return files.value.reduce((total: number, file: PreviewFile) => total + file.size, 0);
});

// 文件类型验证
const validateFileType = (file: File): boolean => {
  if (props.accept === '*/*') return true;
  
  const acceptTypes = props.accept.split(',').map(type => type.trim());
  
  return acceptTypes.some(acceptType => {
    if (acceptType.startsWith('.')) {
      // 扩展名匹配
      return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
    } else if (acceptType.includes('/*')) {
      // MIME类型通配符匹配
      const [mainType] = acceptType.split('/');
      return file.type.startsWith(mainType);
    } else {
      // 精确MIME类型匹配
      return file.type === acceptType;
    }
  });
};

// 文件大小验证
const validateFileSize = (file: File): boolean => {
  return file.size <= props.maxSize;
};

// 文件数量验证
const validateFileCount = (newFilesCount: number): boolean => {
  return files.value.length + newFilesCount <= props.maxFiles;
};

// 总大小验证
const validateTotalSize = (newFilesSize: number): boolean => {
  return totalSize.value + newFilesSize <= props.maxTotalSize;
};

// 创建预览文件对象
const createPreviewFile = (file: File): PreviewFile => {
  const previewFile: PreviewFile = {
    name: file.name,
    size: file.size,
    type: file.type,
    file: file,
    loading: false,
    progress: 0
  };
  
  // 为图片和视频创建预览URL
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    previewFile.preview = URL.createObjectURL(file);
  }
  
  return previewFile;
};

// 添加文件
const addFiles = (newFiles: File[]) => {
  errorMessage.value = '';
  
  // 验证文件数量
  if (!validateFileCount(newFiles.length)) {
    errorMessage.value = `最多只能上传 ${props.maxFiles} 个文件`;
    return;
  }
  
  // 验证总大小
  const newFilesSize = newFiles.reduce((total: number, file: File) => total + file.size, 0);
  if (!validateTotalSize(newFilesSize)) {
    errorMessage.value = `文件总大小不能超过 ${formatFileSize(props.maxTotalSize)}`;
    return;
  }
  
  const validFiles: PreviewFile[] = [];
  const errors: string[] = [];
  
  newFiles.forEach((file: File) => {
    // 验证文件类型
    if (!validateFileType(file)) {
      errors.push(`${file.name}: 不支持的文件类型`);
      return;
    }
    
    // 验证文件大小
    if (!validateFileSize(file)) {
      errors.push(`${file.name}: 文件大小超过 ${formatFileSize(props.maxSize)}`);
      return;
    }
    
    // 检查重复文件
    const isDuplicate = files.value.some((existingFile: PreviewFile) => 
      existingFile.name === file.name && existingFile.size === file.size
    );
    
    if (isDuplicate) {
      errors.push(`${file.name}: 文件已存在`);
      return;
    }
    
    validFiles.push(createPreviewFile(file));
  });
  
  if (errors.length > 0) {
    errorMessage.value = errors.join('; ');
  }
  
  if (validFiles.length > 0) {
    files.value.push(...validFiles);
    emit('update:modelValue', files.value);
    emit('change', files.value);
    
    validFiles.forEach((file: PreviewFile) => {
      emit('file-add', file);
    });
    
    // 自动上传
    if (props.autoUpload && props.uploadUrl) {
      nextTick(() => {
        uploadFiles();
      });
    }
  }
};

// 移除文件
const removeFile = (index: number) => {
  const removedFile = files.value[index];
  
  // 释放预览URL
  if (removedFile.preview && removedFile.preview.startsWith('blob:')) {
    URL.revokeObjectURL(removedFile.preview);
  }
  
  files.value.splice(index, 1);
  emit('update:modelValue', files.value);
  emit('change', files.value);
  emit('file-remove', removedFile);
  
  // 清除错误信息
  if (files.value.length === 0) {
    errorMessage.value = '';
  }
};

// 清空文件
const clearFiles = () => {
  // 释放所有预览URL
  files.value.forEach((file: PreviewFile) => {
    if (file.preview && file.preview.startsWith('blob:')) {
      URL.revokeObjectURL(file.preview);
    }
  });
  
  files.value = [];
  emit('update:modelValue', files.value);
  emit('change', files.value);
  errorMessage.value = '';
  uploadedCount.value = 0;
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 文件选择处理
const triggerFileSelect = () => {
  if (props.disabled || uploading.value) return;
  fileInputRef.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  
  if (selectedFiles.length > 0) {
    addFiles(selectedFiles);
  }
  
  // 重置input值，允许重复选择同一文件
  target.value = '';
};

// 拖拽处理
const handleDragOver = (e: DragEvent) => {
  if (props.disabled || uploading.value) return;
  
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  
  if (props.disabled || uploading.value) return;
  
  const droppedFiles = Array.from(e.dataTransfer?.files || []);
  if (droppedFiles.length > 0) {
    addFiles(droppedFiles);
  }
};

// 文件上传
const uploadFiles = async () => {
  if (!props.uploadUrl || uploading.value) return;
  
  const filesToUpload = files.value.filter((file: PreviewFile) => !file.error && file.progress !== 100);
  if (filesToUpload.length === 0) return;
  
  uploading.value = true;
  uploadedCount.value = 0;
  emit('upload-start', filesToUpload);
  
  try {
    for (const file of filesToUpload) {
      await uploadSingleFile(file);
    }
    
    emit('upload-complete', { success: uploadedCount.value, total: filesToUpload.length });
  } catch (error) {
    console.error('批量上传失败:', error);
  } finally {
    uploading.value = false;
  }
};

const uploadSingleFile = async (file: PreviewFile): Promise<void> => {
  if (!file.file) return;
  
  const formData = new FormData();
  formData.append('file', file.file);
  
  // 添加额外数据
  Object.entries(props.uploadData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  try {
    file.loading = true;
    file.progress = 0;
    
    const xhr = new XMLHttpRequest();
    
    // 上传进度
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        file.progress = Math.round((e.loaded / e.total) * 100);
        emit('upload-progress', { file, progress: file.progress });
      }
    };
    
    // 上传完成
    xhr.onload = () => {
      file.loading = false;
      
      if (xhr.status >= 200 && xhr.status < 300) {
        file.progress = 100;
        file.url = JSON.parse(xhr.responseText).url || file.preview;
        uploadedCount.value++;
        emit('upload-success', { file, response: xhr.responseText });
      } else {
        file.error = `上传失败: ${xhr.statusText}`;
        emit('upload-error', { file, error: file.error });
      }
    };
    
    // 上传错误
    xhr.onerror = () => {
      file.loading = false;
      file.error = '网络错误';
      emit('upload-error', { file, error: file.error });
    };
    
    // 开始上传
    xhr.open('POST', props.uploadUrl);
    
    // 设置请求头
    Object.entries(props.uploadHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    
    xhr.send(formData);
    
  } catch (error) {
    file.loading = false;
    file.error = '上传失败';
    emit('upload-error', { file, error: file.error });
  }
};

// 文件预览
const previewFile = (data: { file: PreviewFile; index: number }) => {
  emit('file-preview', data);
};

// 文件下载
const downloadFile = (file: PreviewFile) => {
  // 这里可以添加下载逻辑
  console.log('下载文件:', file);
};

// 预览错误处理
const handlePreviewError = (data: { file: PreviewFile; error: string }) => {
  emit('error', data);
};

// 监听外部文件变化
watch(() => props.modelValue, (newFiles) => {
  if (newFiles !== files.value) {
    files.value = [...newFiles];
  }
}, { deep: true });

// 组件卸载时清理预览URL
const cleanup = () => {
  files.value.forEach((file: PreviewFile) => {
    if (file.preview && file.preview.startsWith('blob:')) {
      URL.revokeObjectURL(file.preview);
    }
  });
};

// 组件卸载时清理
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(cleanup);
</script>

<style lang="scss" scoped>


.liao-file-upload {
  width: 100%;
  
  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.liao-file-upload-area {
  border: 2px dashed $border-color;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: $bg-primary;
  
  &:hover {
    border-color: $primary-color;
    background-color: rgba($primary-color, 0.02);
  }
  
  &.is-dragover {
    border-color: $primary-color;
    background-color: rgba($primary-color, 0.05);
    transform: scale(1.02);
  }
  
  &.is-error {
    border-color: $error-color;
    background-color: rgba($error-color, 0.02);
  }
  
  &.has-files {
    border-style: solid;
    border-color: $success-color;
    background-color: rgba($success-color, 0.02);
  }
}

.liao-file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.liao-file-upload-icon {
  color: $primary-color;
  transition: all 0.3s ease;
  
  .is-dragover & {
    transform: scale(1.1);
    color: $primary-color;
  }
}

.liao-file-upload-text {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.liao-file-upload-primary {
  font-size: $font-size-lg;
  font-weight: 500;
  color: $text-primary;
  margin: 0;
}

.liao-file-upload-secondary {
  font-size: $font-size-md;
  color: $text-secondary;
  margin: 0;
}

.liao-file-upload-accept {
  font-size: $font-size-sm;
  color: $text-tertiary;
  padding: $spacing-xs $spacing-sm;
  background-color: $bg-secondary;
  border-radius: $border-radius-sm;
}

.liao-file-upload-input {
  display: none;
}

.liao-file-upload-preview {
  margin-top: $spacing-lg;
}

.liao-file-upload-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-lg;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.liao-file-upload-button {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  border: 1px solid $primary-color;
  border-radius: $border-radius-md;
  background-color: $primary-color;
  color: white;
  font-size: $font-size-md;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background-color: color.adjust($primary-color, $lightness: -5%);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &.is-loading {
    pointer-events: none;
  }
  
  &.liao-file-upload-clear {
    background-color: transparent;
    color: $text-secondary;
    border-color: $border-color;
    
    &:hover:not(:disabled) {
      background-color: $bg-secondary;
      color: $text-primary;
      border-color: $text-secondary;
    }
  }
}

.liao-file-upload-error {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background-color: rgba($error-color, 0.1);
  border: 1px solid rgba($error-color, 0.3);
  border-radius: $border-radius-md;
  color: $error-color;
  font-size: $font-size-sm;
}

.liao-file-upload-stats {
  display: flex;
  gap: $spacing-lg;
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-secondary;
  border-radius: $border-radius-md;
  font-size: $font-size-sm;
  color: $text-secondary;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: $spacing-xs;
    text-align: center;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .liao-file-upload-area {
    padding: $spacing-lg;
  }
  
  .liao-file-upload-primary {
    font-size: $font-size-md;
  }
  
  .liao-file-upload-secondary {
    font-size: $font-size-sm;
  }
}
</style> 