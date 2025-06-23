<template>
  <div class="liao-file-chip-list" v-if="files.length > 0">
    <!-- 简化的文件Chip列表 -->
    <div class="liao-file-chip-container">
      <TransitionGroup name="chip" tag="div" class="liao-file-chip-wrapper">
        <div
          v-for="(file, index) in files"
          :key="file.id"
          class="liao-file-chip"
          @click="handleChipClick(file, index)"
        >
          <!-- 文件图标 -->
          <div class="liao-file-chip-icon" :style="{ color: getFileColor(file) }">
            <LiaoIcon :name="getFileIcon(file)" size="small" />
          </div>
          
          <!-- 文件信息 -->
          <div class="liao-file-chip-info">
            <span class="liao-file-chip-name" :title="file.name">
              {{ getTruncatedName(file.name) }}
            </span>
            <span class="liao-file-chip-type">{{ getFileType(file) }}</span>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            v-if="showRemove && !disabled"
            class="liao-file-chip-close"
            @click.stop="handleRemove(file, index)"
            :title="`移除 ${file.name}`"
          >
            <LiaoIcon name="mdi:close" size="small" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import type { FileMeta } from '../../types/file';
import { 
  getFileTypeConfig, 
  truncateFileName 
} from '../../utils/fileUtils';

// Props定义
const props = defineProps({
  // 文件列表
  files: {
    type: Array as PropType<FileMeta[]>,
    default: () => []
  },
  
  // 文件名最大长度
  maxNameLength: {
    type: Number,
    default: 16
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 是否显示移除按钮
  showRemove: {
    type: Boolean,
    default: true
  }
});

// 事件定义
const emit = defineEmits<{
  remove: [fileId: string];
  preview: [fileId: string];
  change: [files: FileMeta[]];
}>();

// 获取文件图标
const getFileIcon = (file: FileMeta): string => {
  // 统一图标规则：
  // 图片类型 -> image
  // 视频类型 -> camera 
  // 其他所有类型 -> file
  
  const fileName = file.name || '';
  const mimeType = file.type || '';
  
  // 检查是否为图片
  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName)) {
    return 'image';
  }
  
  // 检查是否为视频
  if (mimeType.startsWith('video/') || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(fileName)) {
    return 'camera';
  }
  
  // 其他所有类型使用通用文件图标
  return 'file';
};

// 获取文件颜色
const getFileColor = (file: FileMeta): string => {
  const config = getFileTypeConfig(file.name || '', file.type || '');
  return config.color;
};

// 获取文件类型显示文本
const getFileType = (file: FileMeta): string => {
  const config = getFileTypeConfig(file.name || '', file.type || '');
  // 首先尝试从文件扩展名获取
  const extension = file.name ? file.name.split('.').pop()?.toUpperCase() : '';
  if (extension) {
    return extension;
  }
  // 如果没有扩展名，使用category
  return config.category.toUpperCase();
};

// 截断文件名
const getTruncatedName = (name: string): string => {
  return truncateFileName(name, props.maxNameLength);
};

// 处理Chip点击
const handleChipClick = (file: FileMeta, index: number) => {
  emit('preview', file.id);
};

// 处理移除文件
const handleRemove = (file: FileMeta, index: number) => {
  emit('remove', file.id);
  const newFiles = props.files.filter(f => f.id !== file.id);
  emit('change', newFiles);
};
</script>

<style lang="scss" scoped>
.liao-file-chip-list {
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  margin-bottom: 8px;
}

.liao-file-chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.liao-file-chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.liao-file-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background-color: white;
  border: 1px solid #e1e8ed;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  max-width: 200px;

  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

.liao-file-chip-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.liao-file-chip-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.liao-file-chip-name {
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.liao-file-chip-type {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1;
}

.liao-file-chip-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #9ca3af;

  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &:active {
    transform: scale(0.9);
  }
}

// 动画效果
.chip-enter-active,
.chip-leave-active {
  transition: all 0.3s ease;
}

.chip-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.chip-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

// 响应式设计
@media (max-width: 768px) {
  .liao-file-chip {
    max-width: 150px;
    font-size: 11px;
  }
  
  .liao-file-chip-type {
    font-size: 9px;
  }
}
</style> 