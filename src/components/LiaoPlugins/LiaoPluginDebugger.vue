<template>
  <div class="liao-plugin-debugger">
    <h3 class="liao-plugin-debugger-title">插件系统调试信息</h3>
    
    <div class="liao-plugin-debugger-section">
      <h4>已注册插件 ({{ registeredPlugins.length }})</h4>
      <div class="liao-plugin-debugger-list">
        <div 
          v-for="(plugin, index) in registeredPlugins" 
          :key="index"
          class="liao-plugin-debugger-item"
        >
          <span class="liao-plugin-debugger-item-name">{{ plugin }}</span>
          <span 
            class="liao-plugin-debugger-item-status"
            :class="{ 'status-ok': true }"
          >已注册</span>
        </div>
        <div v-if="registeredPlugins.length === 0" class="liao-plugin-debugger-empty">
          暂无已注册插件
        </div>
      </div>
    </div>
    
    <div class="liao-plugin-debugger-section">
      <h4>查询插件状态</h4>
      <div class="liao-plugin-debugger-search">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="输入插件类型名称"
          class="liao-plugin-debugger-input"
        >
        <button 
          @click="checkPlugin" 
          class="liao-plugin-debugger-button"
        >检查</button>
      </div>
      
      <div v-if="checkResult" class="liao-plugin-debugger-result">
        <div class="liao-plugin-debugger-result-status" :class="{
          'status-ok': checkResult.exists,
          'status-error': !checkResult.exists
        }">
          {{ checkResult.exists ? '已注册' : '未注册' }}
        </div>
        <div class="liao-plugin-debugger-result-message">
          {{ checkResult.message }}
        </div>
      </div>
    </div>
    
    <div class="liao-plugin-debugger-actions">
      <button 
        @click="handleRefresh" 
        class="liao-plugin-debugger-button"
      >刷新</button>
      
      <button 
        @click="handleClose" 
        class="liao-plugin-debugger-button secondary"
      >关闭</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getRegisteredPlugins, hasPlugin } from '../../utils/pluginRegistry';

// 获取插件数据
const props = defineProps({
  pluginData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['action']);

// 已注册的插件列表
const registeredPlugins = ref<string[]>([]);
// 搜索查询
const searchQuery = ref('');
// 检查结果
const checkResult = ref<{ exists: boolean; message: string } | null>(null);

// 获取所有已注册的插件
const fetchRegisteredPlugins = () => {
  registeredPlugins.value = getRegisteredPlugins();
};

// 检查插件是否已注册
const checkPlugin = () => {
  if (!searchQuery.value) {
    checkResult.value = {
      exists: false,
      message: '请输入插件类型名称'
    };
    return;
  }
  
  const exists = hasPlugin(searchQuery.value);
  
  checkResult.value = {
    exists,
    message: exists 
      ? `插件 "${searchQuery.value}" 已成功注册`
      : `插件 "${searchQuery.value}" 未注册，请检查插件名称或确保已调用registerPlugin函数`
  };
};

// 刷新插件列表
const handleRefresh = () => {
  fetchRegisteredPlugins();
  emit('action', {
    type: 'refresh',
    data: {
      registeredPlugins: registeredPlugins.value
    }
  });
};

// 关闭调试器
const handleClose = () => {
  emit('action', {
    type: 'close',
    data: {}
  });
};

// 初始化
onMounted(() => {
  fetchRegisteredPlugins();
  
  // 如果有初始查询
  if (props.pluginData && props.pluginData.queryPlugin) {
    searchQuery.value = props.pluginData.queryPlugin;
    checkPlugin();
  }
});
</script>

<style lang="scss" scoped>
.liao-plugin-debugger {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  &-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #333;
  }
  
  &-section {
    margin-bottom: 16px;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 6px;
    
    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #333;
    }
  }
  
  &-list {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: white;
  }
  
  &-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    &-name {
      font-family: monospace;
      font-size: 14px;
    }
    
    &-status {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 10px;
      background-color: #f5f5f5;
      
      &.status-ok {
        background-color: #e6f7ff;
        color: #1890ff;
      }
    }
  }
  
  &-empty {
    padding: 16px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
  
  &-search {
    display: flex;
    margin-bottom: 12px;
    gap: 8px;
  }
  
  &-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
  
  &-button {
    padding: 8px 16px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    
    &:hover {
      background-color: #40a9ff;
    }
    
    &.secondary {
      background-color: #f5f5f5;
      color: #666;
      border: 1px solid #d9d9d9;
      
      &:hover {
        color: #40a9ff;
        border-color: #40a9ff;
        background-color: #f5f5f5;
      }
    }
  }
  
  &-result {
    margin-top: 12px;
    padding: 12px;
    border-radius: 4px;
    background-color: white;
    border: 1px solid #e8e8e8;
    
    &-status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
      margin-bottom: 8px;
      
      &.status-ok {
        background-color: #f6ffed;
        color: #52c41a;
        border: 1px solid #b7eb8f;
      }
      
      &.status-error {
        background-color: #fff2f0;
        color: #f5222d;
        border: 1px solid #ffccc7;
      }
    }
    
    &-message {
      font-size: 14px;
      color: #666;
    }
  }
  
  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
}
</style> 