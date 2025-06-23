<template>
  <div class="liao-vote-plugin">
    <!-- 头部信息 -->
    <div class="liao-vote-plugin-header">
      <h3 class="liao-vote-plugin-title">{{ title }}</h3>
      <p v-if="subtitle" class="liao-vote-plugin-subtitle">{{ subtitle }}</p>
      <div v-if="question" class="liao-vote-plugin-question">{{ question }}</div>
      <p v-if="description" class="liao-vote-plugin-description">{{ description }}</p>
    </div>
    
    <!-- 投票选项 -->
    <div class="liao-vote-plugin-content">
      <div v-if="!showResults || !hasVoted" class="liao-vote-plugin-voting">
        <!-- 单选模式 -->
        <div v-if="!allowMultiple" class="liao-vote-plugin-options">
          <div
            v-for="(option, index) in normalizedOptions"
            :key="option.id || index"
            class="liao-vote-plugin-option"
            :class="{ 
              'liao-vote-plugin-option-selected': selectedValue === option.id,
              'liao-vote-plugin-option-disabled': readonly || disabled || hasSubmitted
            }"
            @click="!readonly && !disabled && !hasSubmitted && selectOption(option.id)"
          >
            <div class="liao-vote-plugin-option-radio">
              <div class="liao-vote-plugin-radio-circle">
                <div v-if="selectedValue === option.id" class="liao-vote-plugin-radio-dot"></div>
              </div>
            </div>
            
            <div class="liao-vote-plugin-option-content">
              <div class="liao-vote-plugin-option-main">
                <LiaoIcon 
                  v-if="option.icon && isIconAvailable(option.icon)" 
                  :name="option.icon" 
                  class="liao-vote-plugin-option-icon"
                />
                <span class="liao-vote-plugin-option-text">{{ option.text }}</span>
              </div>
              <p v-if="option.description" class="liao-vote-plugin-option-desc">
                {{ option.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- 多选模式 -->
        <div v-else class="liao-vote-plugin-options">
          <div
            v-for="(option, index) in normalizedOptions"
            :key="option.id || index"
            class="liao-vote-plugin-option"
            :class="{ 
              'liao-vote-plugin-option-selected': selectedValues.includes(option.id),
              'liao-vote-plugin-option-disabled': readonly || disabled || hasSubmitted
            }"
            @click="!readonly && !disabled && !hasSubmitted && toggleOption(option.id)"
          >
            <div class="liao-vote-plugin-option-checkbox">
              <div class="liao-vote-plugin-checkbox-square">
                <LiaoIcon 
                  v-if="selectedValues.includes(option.id)" 
                  name="check" 
                  class="liao-vote-plugin-checkbox-check"
                />
              </div>
            </div>
            
            <div class="liao-vote-plugin-option-content">
              <div class="liao-vote-plugin-option-main">
                <LiaoIcon 
                  v-if="option.icon && isIconAvailable(option.icon)" 
                  :name="option.icon" 
                  class="liao-vote-plugin-option-icon"
                />
                <span class="liao-vote-plugin-option-text">{{ option.text }}</span>
              </div>
              <p v-if="option.description" class="liao-vote-plugin-option-desc">
                {{ option.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 投票结果 -->
      <div v-if="showResults && (hasVoted || !votingEnabled)" class="liao-vote-plugin-results">
        <div class="liao-vote-plugin-results-header">
          <h4>投票结果</h4>
          <span class="liao-vote-plugin-total-votes">总票数: {{ totalVotes }}</span>
        </div>
        
        <div class="liao-vote-plugin-results-list">
          <div
            v-for="(option, index) in normalizedOptions"
            :key="option.id || index"
            class="liao-vote-plugin-result-item"
            :class="{ 'liao-vote-plugin-result-item-voted': isUserVoted(option.id) }"
          >
            <div class="liao-vote-plugin-result-header">
              <div class="liao-vote-plugin-result-option">
                <LiaoIcon 
                  v-if="option.icon && isIconAvailable(option.icon)" 
                  :name="option.icon" 
                  class="liao-vote-plugin-result-icon"
                />
                <span class="liao-vote-plugin-result-text">{{ option.text }}</span>
                <span v-if="isUserVoted(option.id)" class="liao-vote-plugin-user-vote-badge">
                  您的选择
                </span>
              </div>
              <div class="liao-vote-plugin-result-stats">
                <span class="liao-vote-plugin-result-count">{{ getOptionVotes(option.id) }}</span>
                <span v-if="showPercentage" class="liao-vote-plugin-result-percentage">
                  {{ getOptionPercentage(option.id) }}%
                </span>
              </div>
            </div>
            
            <div class="liao-vote-plugin-result-bar">
              <div 
                class="liao-vote-plugin-result-progress"
                :style="{ width: getOptionPercentage(option.id) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作 -->
    <transition name="liao-vote-footer-slide" appear>
      <div v-if="shouldShowFooter" class="liao-vote-plugin-footer">
        <!-- 投票阶段：显示提交按钮 -->
        <div v-if="!hasSubmitted && votingEnabled && (!showResults || !hasVoted)" class="liao-vote-plugin-actions">
          <button
            class="liao-vote-plugin-submit"
            :disabled="isSubmitDisabled || readonly || disabled || loading"
            @click="handleSubmit"
          >
            <div v-if="loading" class="liao-vote-plugin-loading"></div>
            <LiaoIcon v-else name="send" class="liao-vote-plugin-submit-icon" />
            {{ submitText }}
          </button>
        </div>
        
        <!-- 已提交状态：显示提交成功信息 -->
        <div v-else-if="hasSubmitted" class="liao-vote-plugin-submitted">
          <LiaoIcon name="check-circle" class="liao-vote-plugin-submitted-icon" />
          <span>投票已提交</span>
        </div>
        
        <!-- 查看结果阶段：显示修改投票按钮（如果允许） -->
        <div v-else-if="showResults && hasVoted && votingEnabled" class="liao-vote-plugin-result-actions">
          <button 
            class="liao-vote-plugin-change-vote"
            @click="changeVote"
          >
            <LiaoIcon name="edit" class="liao-vote-plugin-change-vote-icon" />
            修改投票
          </button>
        </div>
        
        <!-- 仅查看结果状态：不显示任何操作按钮 -->
        <div v-else-if="showResults && !votingEnabled" class="liao-vote-plugin-view-only">
          <span class="liao-vote-plugin-view-only-text">
            <LiaoIcon name="eye" class="liao-vote-plugin-view-only-icon" />
            仅查看结果
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import { getAvailableIcons } from '../../utils/importIcons';

// 选项接口定义
interface VoteOption {
  id: string;
  text: string;
  description?: string;
  icon?: string;
}

// 投票结果接口
interface VoteResult {
  id: string;
  count: number;
}

// Props定义
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      subtitle?: string;
      question?: string;
      description?: string;
      options?: (string | VoteOption)[];
      allowMultiple?: boolean;
      showResults?: boolean;
      showPercentage?: boolean;
      results?: VoteResult[];
      totalVotes?: number;
      userVote?: string | string[] | null;
      votingEnabled?: boolean;
      submitText?: string;
    }>,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// 事件定义
const emit = defineEmits(['action']);

// 响应式数据
const selectedValue = ref<string>('');
const selectedValues = ref<string[]>([]);
const hasSubmitted = ref(false);
const availableIcons = ref<string[]>([]);

// 获取可用图标列表
onMounted(() => {
  availableIcons.value = getAvailableIcons();
});

// 检查图标是否存在的函数
const isIconAvailable = (iconName: string | undefined): boolean => {
  if (!iconName || !iconName.trim()) return false;
  
  // 检查是否在本地图标库中
  const isLocalIcon = availableIcons.value.includes(iconName.toLowerCase());
  
  // 如果不在本地图标库中，假设是Iconify图标（这里可以根据需要添加更严格的检查）
  // 对于Iconify图标，我们可以检查是否包含冒号（如 'mdi:home'）
  const isIconifyIcon = iconName.includes(':');
  
  // 对于常见的图标名称，我们也认为是有效的（比如 'check', 'send', 'edit' 等）
  const commonIcons = ['check', 'send', 'edit', 'close', 'home', 'user', 'settings', 'search', 'heart', 'star'];
  const isCommonIcon = commonIcons.includes(iconName.toLowerCase());
  
  return isLocalIcon || isIconifyIcon || isCommonIcon;
};

// 计算属性
const title = computed(() => props.pluginData.title || '投票');
const subtitle = computed(() => props.pluginData.subtitle);
const question = computed(() => props.pluginData.question);
const description = computed(() => props.pluginData.description);
const allowMultiple = computed(() => props.pluginData.allowMultiple || false);
const showResults = computed(() => props.pluginData.showResults || false);
const showPercentage = computed(() => props.pluginData.showPercentage || true);
const results = computed(() => props.pluginData.results || []);
const totalVotes = computed(() => props.pluginData.totalVotes || 0);
const userVote = computed(() => props.pluginData.userVote);
const votingEnabled = computed(() => props.pluginData.votingEnabled !== false);
const submitText = computed(() => props.pluginData.submitText || '提交投票');

// 标准化选项数据
const normalizedOptions = computed(() => {
  const options = props.pluginData.options || [];
  return options.map((option, index) => {
    if (typeof option === 'string') {
      return {
        id: `option_${index}`,
        text: option,
        description: '',
        icon: undefined
      };
    }
    return {
      id: option.id || `option_${index}`,
      text: option.text || '',
      description: option.description || '',
      icon: option.icon && option.icon.trim() ? option.icon.trim() : undefined
    };
  });
});

// 是否已投票
const hasVoted = computed(() => {
  return userVote.value !== null && userVote.value !== undefined;
});

// 是否应该显示底部操作区
const shouldShowFooter = computed(() => {
  // 如果已经提交，总是显示
  if (hasSubmitted.value) return true;
  
  // 如果显示结果且已投票，显示修改按钮
  if (showResults.value && hasVoted.value) return true;
  
  // 如果显示结果但不允许投票，显示仅查看状态
  if (showResults.value && !votingEnabled.value) return true;
  
  // 如果用户已选择选项，显示提交按钮
  if (allowMultiple.value) {
    return selectedValues.value.length > 0;
  } else {
    return selectedValue.value !== '';
  }
});

// 提交按钮是否禁用
const isSubmitDisabled = computed(() => {
  if (allowMultiple.value) {
    return selectedValues.value.length === 0;
  } else {
    return !selectedValue.value;
  }
});

// 初始化用户投票
watch(
  () => props.pluginData.userVote,
  (newVote) => {
    if (newVote !== null && newVote !== undefined) {
      if (allowMultiple.value && Array.isArray(newVote)) {
        selectedValues.value = [...newVote];
      } else if (!allowMultiple.value && typeof newVote === 'string') {
        selectedValue.value = newVote;
      }
    }
  },
  { immediate: true }
);

// 方法
const selectOption = (optionId: string) => {
  selectedValue.value = optionId;
  emit('action', {
    type: 'vote-change',
    data: {
      selectedOption: normalizedOptions.value.find(opt => opt.id === optionId),
      value: optionId
    }
  });
};

const toggleOption = (optionId: string) => {
  const index = selectedValues.value.indexOf(optionId);
  if (index > -1) {
    selectedValues.value.splice(index, 1);
  } else {
    selectedValues.value.push(optionId);
  }
  
  emit('action', {
    type: 'vote-change',
    data: {
      selectedOptions: selectedValues.value.map(id => 
        normalizedOptions.value.find(opt => opt.id === id)
      ),
      value: selectedValues.value
    }
  });
};

const handleSubmit = () => {
  const selectedData = allowMultiple.value 
    ? {
        selectedOptions: selectedValues.value.map(id => 
          normalizedOptions.value.find(opt => opt.id === id)
        ),
        value: selectedValues.value
      }
    : {
        selectedOption: normalizedOptions.value.find(opt => opt.id === selectedValue.value),
        value: selectedValue.value
      };

  hasSubmitted.value = true;
  
  emit('action', {
    type: 'vote-submit',
    data: {
      ...selectedData,
      totalVotes: totalVotes.value,
      choice: allowMultiple.value ? selectedValues.value : selectedValue.value
    }
  });
};

const changeVote = () => {
  hasSubmitted.value = false;
  emit('action', {
    type: 'vote-change-request',
    data: {
      currentVote: userVote.value
    }
  });
};

const getOptionVotes = (optionId: string): number => {
  const result = results.value.find(r => r.id === optionId);
  return result ? result.count : 0;
};

const getOptionPercentage = (optionId: string): number => {
  if (totalVotes.value === 0) return 0;
  const votes = getOptionVotes(optionId);
  return Math.round((votes / totalVotes.value) * 100);
};

const isUserVoted = (optionId: string): boolean => {
  if (!hasVoted.value) return false;
  if (allowMultiple.value && Array.isArray(userVote.value)) {
    return userVote.value.includes(optionId);
  }
  return userVote.value === optionId;
};
</script>

<style lang="scss" scoped>
.liao-vote-plugin {
  width: 100%;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  &-header {
    padding: $spacing-xl;
    border-bottom: 1px solid $border-color-card;
    background: linear-gradient(135deg, rgba($primary-color, 0.02) 0%, rgba($primary-color, 0.05) 100%);
    
    // 移动端优化 - 防止文本换行变形
    @media (max-width: 768px) {
      padding: $spacing-lg $spacing-md;
    }
  }
  
  &-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
    line-height: 1.3;
    word-break: break-word;
    hyphens: auto;
    
    // 移动端优化 - 减小字号
    @media (max-width: 768px) {
      font-size: $font-size-md;
      line-height: 1.2;
      margin-bottom: $spacing-xs;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  &-subtitle {
    font-size: $font-size-md;
    color: $text-secondary;
    margin: 0 0 $spacing-md 0;
    line-height: 1.4;
    word-break: break-word;
    hyphens: auto;
    
    // 移动端优化 - 减小字号
    @media (max-width: 768px) {
      font-size: $font-size-xs;
      line-height: 1.3;
      margin-bottom: $spacing-sm;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  &-question {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    margin: 0 0 $spacing-sm 0;
    padding: $spacing-md;
    background-color: rgba($primary-color, 0.05);
    border-left: 4px solid $primary-color;
    border-radius: $border-radius-sm;
    line-height: 1.4;
    word-break: break-word;
    hyphens: auto;
    
    // 移动端优化 - 减小字号
    @media (max-width: 768px) {
      font-size: $font-size-sm;
      line-height: 1.3;
      padding: $spacing-sm;
      margin-bottom: $spacing-xs;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  &-description {
    font-size: $font-size-md;
    color: $text-secondary;
    margin: 0;
    line-height: 1.5;
    word-break: break-word;
    hyphens: auto;
    
    // 移动端优化 - 减小字号
    @media (max-width: 768px) {
      font-size: $font-size-xs;
      line-height: 1.4;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  &-content {
    padding: $spacing-lg $spacing-xl;
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: $spacing-md $spacing-lg;
    }
  }
  
  &-options {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    // 移动端优化
    @media (max-width: 768px) {
      gap: $spacing-sm;
    }
  }
  
  &-option {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
    padding: $spacing-lg;
    border: 2px solid $border-color;
    border-radius: $border-radius-lg;
    background-color: $bg-primary;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: $spacing-md;
    min-height: auto;
    
    // 移动端优化 - 防止变形
    @media (max-width: 768px) {
      padding: $spacing-md $spacing-sm;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
      align-items: flex-start;
      min-height: 60px; // 设置最小高度保持一致性
    }
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:hover:not(&-disabled) {
      border-color: $primary-color;
      background-color: rgba($primary-color, 0.02);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba($primary-color, 0.15);
      
      // 移动端禁用transform效果
      @media (max-width: 768px) {
        transform: none;
        box-shadow: 0 2px 8px rgba($primary-color, 0.1);
      }
    }
    
    &-selected {
      border-color: $primary-color;
      background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.08) 100%);
      box-shadow: 0 2px 8px rgba($primary-color, 0.2);
      
      // 移动端优化
      @media (max-width: 768px) {
        box-shadow: 0 1px 4px rgba($primary-color, 0.15);
      }
    }
    
    &-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        transform: none;
        box-shadow: none;
        border-color: $border-color;
        background-color: $bg-primary;
      }
    }
  }
  
  &-option-radio,
  &-option-checkbox {
    margin-right: $spacing-md;
    margin-top: 2px;
    flex-shrink: 0;
    
    // 移动端优化
    @media (max-width: 768px) {
      margin-right: $spacing-sm;
      margin-top: 0;
    }
  }
  
  &-radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid $border-color;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    .liao-vote-plugin-option-selected & {
      border-color: $primary-color;
      background-color: rgba($primary-color, 0.1);
    }
  }
  
  &-radio-dot {
    width: 10px;
    height: 10px;
    background-color: $primary-color;
    border-radius: 50%;
    animation: liao-vote-scale-in 0.2s ease;
  }
  
  &-checkbox-square {
    width: 20px;
    height: 20px;
    border: 2px solid $border-color;
    border-radius: $border-radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    .liao-vote-plugin-option-selected & {
      border-color: $primary-color;
      background-color: $primary-color;
    }
  }
  
  &-checkbox-check {
    color: white;
    font-size: 12px;
  }
  
  &-option-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    
    // 移动端优化 - 防止文本换行变形
    @media (max-width: 768px) {
      gap: 4px;
    }
  }
  
  &-option-main {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    min-width: 0;
    
    // 桌面端左对齐
    @media (min-width: 769px) {
      justify-content: flex-start;
      text-align: left;
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      gap: $spacing-xs;
      align-items: flex-start;
    }
  }
  
  &-option-icon {
    font-size: $font-size-lg;
    color: $primary-color;
    flex-shrink: 0;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-md;
      margin-top: 2px; // 与文本顶部对齐
    }
  }
  
  &-option-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    line-height: 1.4;
    word-break: break-word;
    hyphens: auto;
    flex: 1;
    min-width: 0;
    
    // 桌面端左对齐
    @media (min-width: 769px) {
      text-align: left;
    }
    
    // 移动端优化 - 防止换行变形
    @media (max-width: 768px) {
      font-size: $font-size-md;
      line-height: 1.3;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  &-option-desc {
    font-size: $font-size-md;
    color: $text-secondary;
    line-height: 1.4;
    margin: 0;
    word-break: break-word;
    hyphens: auto;
    
    // 桌面端左对齐
    @media (min-width: 769px) {
      text-align: left;
      margin-left: 0; // 确保与标题左对齐
    }
    
    // 移动端优化 - 防止换行变形
    @media (max-width: 768px) {
      font-size: $font-size-sm;
      line-height: 1.3;
      margin-top: 2px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
  
  &-results {
    margin-top: $spacing-lg;
    
    // 移动端优化
    @media (max-width: 768px) {
      margin-top: $spacing-md;
    }
  }
  
  &-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;
    
    // 移动端优化
    @media (max-width: 768px) {
      margin-bottom: $spacing-md;
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-xs;
    }
    
    h4 {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      color: $text-primary;
      margin: 0;
      
      // 移动端优化
      @media (max-width: 768px) {
        font-size: $font-size-md;
      }
    }
  }
  
  &-total-votes {
    font-size: $font-size-sm;
    color: $text-secondary;
    background-color: $bg-secondary;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-xs;
      padding: 2px $spacing-xs;
    }
  }
  
  &-results-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    // 移动端优化
    @media (max-width: 768px) {
      gap: $spacing-sm;
    }
  }
  
  &-result-item {
    padding: $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius-md;
    background-color: $bg-primary;
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: $spacing-sm;
    }
    
    &-voted {
      border-color: $primary-color;
      background-color: rgba($primary-color, 0.02);
    }
  }
  
  &-result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
    
    // 移动端优化
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-xs;
      margin-bottom: $spacing-xs;
    }
  }
  
  &-result-option {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex: 1;
    min-width: 0;
    
    // 移动端优化
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  &-result-icon {
    font-size: $font-size-md;
    color: $primary-color;
    flex-shrink: 0;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-sm;
    }
  }
  
  &-result-text {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $text-primary;
    word-break: break-word;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-sm;
    }
  }
  
  &-user-vote-badge {
    font-size: $font-size-xs;
    background-color: $primary-color;
    color: white;
    padding: 2px $spacing-xs;
    border-radius: $border-radius-sm;
    margin-left: $spacing-sm;
    flex-shrink: 0;
    
    // 移动端优化
    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: $spacing-xs;
    }
  }
  
  &-result-stats {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex-shrink: 0;
    
    // 移动端优化
    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
    }
  }
  
  &-result-count {
    font-size: $font-size-sm;
    color: $text-secondary;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-xs;
    }
  }
  
  &-result-percentage {
    font-size: $font-size-md;
    font-weight: $font-weight-bold;
    color: $primary-color;
    min-width: 40px;
    text-align: right;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-sm;
      min-width: 35px;
    }
  }
  
  &-result-bar {
    height: 8px;
    background-color: $bg-secondary;
    border-radius: $border-radius-sm;
    overflow: hidden;
    
    // 移动端优化
    @media (max-width: 768px) {
      height: 6px;
    }
  }
  
  &-result-progress {
    height: 100%;
    background: linear-gradient(90deg, $primary-color 0%, color.adjust($primary-color, $lightness: 10%) 100%);
    border-radius: $border-radius-sm;
    transition: width 0.6s ease;
    animation: liao-vote-progress-fill 0.8s ease;
  }
  
  &-footer {
    padding: $spacing-lg $spacing-xl;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: $spacing-md $spacing-lg;
    }
  }
  
  &-actions {
    display: flex;
    justify-content: flex-end;
    
    // 移动端优化
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  
  &-submit {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-xl;
    background: linear-gradient(135deg, $primary-color 0%, color.adjust($primary-color, $lightness: -5%) 100%);
    color: white;
    border: none;
    border-radius: $border-radius-md;
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba($primary-color, 0.3);
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: $spacing-sm $spacing-lg;
      font-size: $font-size-sm;
      width: 100%;
      justify-content: center;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba($primary-color, 0.4);
      
      // 移动端禁用transform效果
      @media (max-width: 768px) {
        transform: none;
      }
    }
    
    &:disabled {
      background: $text-disabled;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    // 修复icon颜色与文字颜色一致
    &-icon {
      color: inherit; // 继承按钮的文字颜色
    }
  }
  
  &-loading {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: liao-vote-spin 1s linear infinite;
  }
  
  &-submitted {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    color: $success-color;
    font-weight: $font-weight-medium;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-sm;
    }
    
    // 修复icon颜色与文字颜色一致
    &-icon {
      color: inherit; // 继承文字颜色
    }
  }
  
  &-result-actions {
    display: flex;
    justify-content: center;
    margin-top: $spacing-md;
  }
  
  &-change-vote {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background-color: transparent;
    color: $primary-color;
    border: 1px solid $primary-color;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all 0.2s ease;
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-xs;
    }
    
    &:hover {
      background-color: rgba($primary-color, 0.05);
    }
    
    // 修复icon颜色与文字颜色一致
    &-icon {
      color: inherit; // 继承按钮的文字颜色
    }
  }
  
  &-view-only {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacing-md;
    background-color: $bg-secondary;
    border-radius: $border-radius-sm;
    margin-top: $spacing-md;
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: $spacing-sm;
    }
  }
  
  &-view-only-text {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $text-secondary;
    
    // 移动端优化
    @media (max-width: 768px) {
      font-size: $font-size-sm;
    }
    
    // 修复icon颜色与文字颜色一致
    .liao-vote-plugin-view-only-icon {
      color: inherit; // 继承文字颜色
    }
  }
}

@keyframes liao-vote-spin {
  to { transform: rotate(360deg); }
}

@keyframes liao-vote-scale-in {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes liao-vote-progress-fill {
  from { width: 0; }
}

// 底部操作区过渡动画
.liao-vote-footer-slide-enter-active,
.liao-vote-footer-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: top;
}

.liao-vote-footer-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scaleY(0.8);
  max-height: 0;
  overflow: hidden;
}

.liao-vote-footer-slide-enter-to {
  opacity: 1;
  transform: translateY(0) scaleY(1);
  max-height: 200px;
}

.liao-vote-footer-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
  max-height: 200px;
}

.liao-vote-footer-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scaleY(0.8);
  max-height: 0;
  overflow: hidden;
}
</style> 