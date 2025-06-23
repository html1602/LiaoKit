<template>
  <div class="timeline-test">
    <h2>时间线插件测试</h2>
    
    <div class="test-section">
      <h3>基础时间线</h3>
      <LiaoTimelinePlugin
        :plugin-data="timelineData"
        @action="handleAction"
      />
    </div>
    
    <div class="result-section" v-if="lastAction">
      <h3>最后操作结果：</h3>
      <pre>{{ JSON.stringify(lastAction, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LiaoTimelinePlugin from '../components/LiaoPlugins/LiaoTimelinePlugin.vue';

const lastAction = ref(null);

const timelineData = {
  title: '🚚 订单物流跟踪测试',
  items: [
    { 
      title: '✅ 已签收', 
      content: '您的包裹已由本人签收，感谢您的购买！',
      time: '2025-06-11 16:23:45',
      status: 'success' as const,
      actions: [
        { text: '查看详情', action: 'view_detail' }
      ]
    },
    { 
      title: '🚚 正在派送', 
      content: '您的包裹正在派送中，快递员：李师傅',
      time: '2025-06-11 08:15:30',
      status: 'primary' as const,
      actions: [
        { text: '联系快递员', action: 'call_courier' }
      ]
    },
    { 
      title: '📦 到达配送点', 
      content: '快件已到达配送中心',
      time: '2025-06-10 22:45:12',
      status: 'default' as const
    }
  ],
  showMore: true,
  loadMoreText: '查看更多'
};

const handleAction = (action: any) => {
  console.log('时间线操作:', action);
  lastAction.value = action;
};
</script>

<style scoped>
.timeline-test {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
}

.result-section {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style> 