<template>
  <div class="liao-stats-plugin">
    <div v-if="title" class="liao-stats-plugin-header">
      <h3 class="liao-stats-plugin-title">{{ title }}</h3>
    </div>
    
    <div class="liao-stats-plugin-content">
      <slot>
        <div class="liao-stats-plugin-grid" :class="{ 'liao-stats-plugin-grid-compact': layout === 'compact' }">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="liao-stats-plugin-item"
            :class="{ 
              'liao-stats-plugin-item-bordered': item.bordered,
              'liao-stats-plugin-item-chart': isChartMode(item)
            }"
          >
            <!-- 数字卡片模式（单天数据） -->
            <template v-if="!isChartMode(item)">
              <div class="liao-stats-plugin-item-top">
                <div v-if="item.icon" class="liao-stats-plugin-item-icon" :style="{ color: item.color || $primaryColor }">
                  <!-- SVG 图标 -->
                  <div v-if="item.icon.startsWith('<svg')" v-html="item.icon.replace(/<svg/, '<svg class=\'liao-stats-plugin-svg-icon\'')"></div>
                  <!-- 图片 URL -->
                  <img v-else-if="item.icon.startsWith('http') || item.icon.includes('.')" :src="item.icon" alt="图标" class="liao-stats-plugin-img-icon" />
                  <!-- 文本图标（emoji 等） -->
                  <span v-else class="liao-stats-plugin-text-icon">{{ item.icon }}</span>
                </div>
                <div v-if="item.change !== undefined" class="liao-stats-plugin-item-trend">
                  <span
                    class="liao-stats-plugin-item-trend-icon"
                    :class="{
                      'liao-stats-plugin-item-trend-up': item.change > 0,
                      'liao-stats-plugin-item-trend-down': item.change < 0,
                    }"
                  >
                    {{ item.change > 0 ? '↗' : item.change < 0 ? '↘' : '→' }}
                  </span>
                </div>
              </div>
              
              <div class="liao-stats-plugin-item-content">
                <div class="liao-stats-plugin-item-label">{{ item.label }}</div>
                <div 
                  class="liao-stats-plugin-item-value"
                  :style="{ color: item.color }"
                >
                  {{ item.value }}
                </div>
                <div v-if="item.change !== undefined" class="liao-stats-plugin-item-change">
                  <span
                    :class="{
                      'liao-stats-plugin-item-change-positive': item.change > 0,
                      'liao-stats-plugin-item-change-negative': item.change < 0,
                      'liao-stats-plugin-item-change-neutral': item.change === 0,
                    }"
                  >
                    {{ item.change > 0 ? '+' : '' }}{{ item.change }}%
                  </span>
                </div>
              </div>
            </template>

            <!-- 图表模式（多天数据） -->
            <template v-else>
              <div class="liao-stats-plugin-chart-header">
                <div class="liao-stats-plugin-chart-title-row">
                  <div v-if="item.icon" class="liao-stats-plugin-item-icon liao-stats-plugin-chart-icon" :style="{ color: item.color || $primaryColor }">
                    <!-- SVG 图标 -->
                    <div v-if="item.icon.startsWith('<svg')" v-html="item.icon.replace(/<svg/, '<svg class=\'liao-stats-plugin-svg-icon\'')"></div>
                    <!-- 图片 URL -->
                    <img v-else-if="item.icon.startsWith('http') || item.icon.includes('.')" :src="item.icon" alt="图标" class="liao-stats-plugin-img-icon" />
                    <!-- 文本图标（emoji 等） -->
                    <span v-else class="liao-stats-plugin-text-icon">{{ item.icon }}</span>
                  </div>
                  <div class="liao-stats-plugin-chart-label">{{ item.label }}</div>
                </div>
                <div class="liao-stats-plugin-chart-summary">
                  <span class="liao-stats-plugin-chart-latest">{{ getLatestValue(item) }}</span>
                  <span v-if="getTrendChange(item) !== null" class="liao-stats-plugin-chart-trend" :class="{
                    'liao-stats-plugin-chart-trend-up': getTrendChange(item)! > 0,
                    'liao-stats-plugin-chart-trend-down': getTrendChange(item)! < 0,
                  }">
                    {{ getTrendChange(item)! > 0 ? '+' : '' }}{{ getTrendChange(item)!.toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div 
                :ref="(el: Element | ComponentPublicInstance | null) => {
                  if (el && '$el' in el) {
                    chartRefs[`chart-${index}`] = el.$el as HTMLElement;
                  } else if (el) {
                    chartRefs[`chart-${index}`] = el as HTMLElement;
                  }
                }"
                class="liao-stats-plugin-chart-container"
                :data-chart-index="index"
              ></div>
            </template>
          </div>
        </div>
      </slot>
    </div>
    
    <div v-if="$slots.footer" class="liao-stats-plugin-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, nextTick, ref, watch } from 'vue';
import type { PropType, ComponentPublicInstance } from 'vue';
import { Line, Area, Column } from '@antv/g2plot';

// 图表数据接口
interface ChartDataPoint {
  date: string;
  value: number;
}

// 扩展数据项接口
interface StatsItem {
  label: string;
  value?: string | number;
  icon?: string;
  color?: string;
  change?: number;
  bordered?: boolean;
  // 新增图表相关字段
  chartData?: ChartDataPoint[];
  chartType?: 'line' | 'area' | 'column';
  unit?: string;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      items: StatsItem[];
      layout?: 'default' | 'compact';
    }>,
    default: () => ({})
  },
  status: {
    type: String,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

// 事件
const emit = defineEmits(['action']);

// 获取数据
const title = computed(() => props.pluginData.title || '');
const items = computed(() => props.pluginData.items || []);
const layout = computed(() => props.pluginData.layout || 'default');

// 获取主题色，用于默认图标颜色
const $primaryColor = computed(() => 'var(--primary-color, #1890ff)');

// 图表相关状态
const chartRefs = ref<{ [key: string]: HTMLElement }>({});
const chartInstances = ref<{ [key: string]: Line | Area | Column }>({});

// 判断是否为图表模式
const isChartMode = (item: StatsItem): boolean => {
  return !!(item.chartData && item.chartData.length > 1);
};

// 获取最新值（用于图表模式显示）
const getLatestValue = (item: StatsItem): string => {
  if (item.chartData && item.chartData.length > 0) {
    const latest = item.chartData[item.chartData.length - 1];
    return `${latest.value}${item.unit || ''}`;
  }
  return item.value?.toString() || '';
};

// 计算趋势变化（用于图表模式）
const getTrendChange = (item: StatsItem): number | null => {
  if (!item.chartData || item.chartData.length < 2) {
    return item.change ?? null;
  }
  
  const latest = item.chartData[item.chartData.length - 1];
  const previous = item.chartData[item.chartData.length - 2];
  
  if (!latest || !previous || previous.value === 0) return null;
  
  return ((latest.value - previous.value) / previous.value) * 100;
};

// 初始化图表
const initChart = (item: StatsItem, index: number): void => {
  const container = chartRefs.value[`chart-${index}`];
  if (!container || !item.chartData) return;

  const chartType = item.chartType || 'line';
  const color = item.color || '#1890ff';
  
  const baseConfig = {
    data: item.chartData,
    xField: 'date',
    yField: 'value',
    color,
    height: 120,
    autoFit: true,
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return '';
        const data = items[0]?.data;
        if (!data) return '';
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 500; color: #333; margin-bottom: 4px;">${item.label}</div>
            <div style="color: #666;">${data.value}${item.unit || ''}</div>
          </div>
        `;
      },
    },
    point: {
      size: 3,
      shape: 'circle',
    },
  };

  let chart: Line | Area | Column;

  try {
    switch (chartType) {
      case 'area':
        chart = new Area(container, {
          ...baseConfig,
          areaStyle: {
            fill: `l(270) 0:${color}40 1:${color}10`,
          },
        });
        break;
      case 'column':
        chart = new Column(container, {
          ...baseConfig,
          columnStyle: {
            fill: color,
            fillOpacity: 0.8,
          },
        });
        break;
      default: // 'line'
        chart = new Line(container, baseConfig);
        break;
    }

    chart.render();
    chartInstances.value[`chart-${index}`] = chart;
  } catch (error) {
    console.error('图表初始化失败:', error);
  }
};

// 初始化所有图表
const initAllCharts = async (): Promise<void> => {
  await nextTick();
  
  items.value.forEach((item, index) => {
    if (isChartMode(item)) {
      initChart(item, index);
    }
  });
};

// 销毁图表实例
const destroyCharts = (): void => {
  Object.values(chartInstances.value).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  chartInstances.value = {};
};

// 监听数据变化，重新初始化图表
watch(() => items.value, async () => {
  destroyCharts();
  await initAllCharts();
}, { deep: true });

// 生命周期
onMounted(async () => {
  await initAllCharts();
});

onBeforeUnmount(() => {
  destroyCharts();
});
</script>

<style lang="scss" scoped>
.liao-stats-plugin {
  width: 100%;
  border-radius: $border-radius-lg;
  overflow: hidden;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  &-header {
    padding: $spacing-lg $spacing-xl;
    border-bottom: 1px solid $border-color-card;
    background: linear-gradient(135deg, $bg-secondary 0%, rgba(24, 144, 255, 0.02) 100%);
  }
  
  &-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    margin: 0;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }
  
  &-content {
    padding: $spacing-xl;
  }
  
  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-lg;
    
    &-compact {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: $spacing-md;
    }
  }
  
  &-item {
    position: relative;
    padding: $spacing-lg;
    border-radius: $border-radius-md;
    background: linear-gradient(135deg, $bg-primary 0%, rgba(255, 255, 255, 0.8) 100%);
    border: 1px solid rgba(224, 230, 237, 0.6);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.04),
      0 8px 16px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--item-accent-color, #{$primary-color}) 0%, rgba(var(--item-accent-color-rgb, 24, 144, 255), 0.3) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.08),
        0 12px 24px rgba(0, 0, 0, 0.12);
      border-color: rgba(24, 144, 255, 0.2);
      
      &::before {
        opacity: 1;
      }
    }
    
    // 图表模式样式
    &-chart {
      padding: $spacing-md $spacing-lg;
      min-height: 180px; // 为图表预留足够空间
      
      .liao-stats-plugin-chart-header {
        margin-bottom: $spacing-md;
      }
      
      .liao-stats-plugin-chart-title-row {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-xs;
      }
      
      .liao-stats-plugin-chart-icon {
        width: 32px;
        height: 32px;
        font-size: 18px;
      }
      
      .liao-stats-plugin-chart-label {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $text-primary;
        flex: 1;
      }
      
      .liao-stats-plugin-chart-summary {
        display: flex;
        align-items: baseline;
        gap: $spacing-sm;
      }
      
      .liao-stats-plugin-chart-latest {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $text-primary;
        line-height: 1.2;
      }
      
      .liao-stats-plugin-chart-trend {
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        padding: 2px 6px;
        border-radius: $border-radius-xs;
        
        &-up {
          color: $success-color;
          background: rgba(82, 196, 26, 0.1);
          
          &::before {
            content: '↗ ';
            opacity: 0.8;
          }
        }
        
        &-down {
          color: $danger-color;
          background: rgba(245, 34, 45, 0.1);
          
          &::before {
            content: '↘ ';
            opacity: 0.8;
          }
        }
      }
      
      .liao-stats-plugin-chart-container {
        height: 120px;
        width: 100%;
        position: relative;
        
        // G2Plot图表样式覆盖
        :deep(.g2-tooltip) {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid $border-color-card;
          border-radius: $border-radius-sm;
          box-shadow: $shadow-md;
        }
        
        :deep(.g2-tooltip-title) {
          font-weight: $font-weight-medium;
          color: $text-primary;
        }
        
        :deep(.g2-tooltip-list-item) {
          color: $text-secondary;
        }
      }
    }
    
    &-bordered {
      border: 2px solid $border-color-card;
      
      &:hover {
        border-color: rgba(24, 144, 255, 0.3);
      }
    }
    
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-md;
    }
    
    &-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--item-accent-color-rgb, 24, 144, 255), 0.08);
      border-radius: $border-radius-sm;
      transition: all 0.3s ease;
    }
    
    &-trend {
      display: flex;
      align-items: center;
      
      &-icon {
        font-size: 16px;
        font-weight: bold;
        padding: 4px 6px;
        border-radius: $border-radius-xs;
        transition: all 0.3s ease;
      }
      
      &-up {
        color: $success-color;
        background: rgba(82, 196, 26, 0.1);
      }
      
      &-down {
        color: $danger-color;
        background: rgba(245, 34, 45, 0.1);
      }
    }
    
    &-content {
      display: flex;
      flex-direction: column;
    }
    
    &-label {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-bottom: $spacing-xs;
      font-weight: $font-weight-medium;
      line-height: 1.4;
    }
    
    &-value {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $text-primary;
      margin-bottom: $spacing-sm;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }
    
    &-change {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      
      &-positive {
        color: $success-color;
        
        &::before {
          content: '↗ ';
          opacity: 0.7;
        }
      }
      
      &-negative {
        color: $danger-color;
        
        &::before {
          content: '↘ ';
          opacity: 0.7;
        }
      }
      
      &-neutral {
        color: $text-secondary;
        
        &::before {
          content: '→ ';
          opacity: 0.7;
        }
      }
    }
  }
  
  &-svg-icon {
    width: 24px;
    height: 24px;
  }
  
  &-img-icon {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &-text-icon {
    font-size: 24px;
    line-height: 1;
    display: inline-block;
  }
  
  &-footer {
    padding: $spacing-md $spacing-xl;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
  }
}

// 移动端优化
@media (max-width: 768px) {
  .liao-stats-plugin {
    &-header {
      padding: $spacing-md $spacing-lg;
    }
    
    &-title {
      font-size: $font-size-md;
    }
    
    &-content {
      padding: $spacing-lg;
    }
    
    &-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: $spacing-md;
      
      &-compact {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: $spacing-sm;
      }
    }
    
    &-item {
      padding: $spacing-md;
      
      &-value {
        font-size: $font-size-xl;
      }
      
      &-icon {
        width: 36px;
        height: 36px;
      }
      
      &-text-icon {
        font-size: 20px;
      }
      
      // 图表模式移动端优化
      &-chart {
        padding: $spacing-sm $spacing-md;
        min-height: 160px;
        
        .liao-stats-plugin-chart-icon {
          width: 28px;
          height: 28px;
          font-size: 16px;
        }
        
        .liao-stats-plugin-chart-label {
          font-size: $font-size-sm;
        }
        
        .liao-stats-plugin-chart-latest {
          font-size: $font-size-lg;
        }
        
        .liao-stats-plugin-chart-container {
          height: 100px;
        }
      }
    }
  }
}

// 超小屏幕优化（手机竖屏）
@media (max-width: 576px) {
  .liao-stats-plugin {
    &-content {
      padding: $spacing-md;
    }
    
    &-grid {
      grid-template-columns: 1fr;
      gap: $spacing-sm;
      
      &-compact {
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-xs;
      }
    }
    
    &-item {
      padding: $spacing-sm $spacing-md;
      
      &-top {
        margin-bottom: $spacing-sm;
      }
      
      &-label {
        font-size: $font-size-xs;
        margin-bottom: 2px;
      }
      
      &-value {
        font-size: $font-size-lg;
        margin-bottom: $spacing-xs;
      }
      
      &-change {
        font-size: $font-size-xs;
      }
      
      &-icon {
        width: 32px;
        height: 32px;
      }
      
      &-text-icon {
        font-size: 18px;
      }
      
      &-trend-icon {
        font-size: 14px;
        padding: 2px 4px;
      }
      
      // 超小屏幕图表优化
      &-chart {
        min-height: 140px;
        
        .liao-stats-plugin-chart-title-row {
          gap: $spacing-xs;
          margin-bottom: 2px;
        }
        
        .liao-stats-plugin-chart-icon {
          width: 24px;
          height: 24px;
          font-size: 14px;
        }
        
        .liao-stats-plugin-chart-label {
          font-size: $font-size-xs;
        }
        
        .liao-stats-plugin-chart-latest {
          font-size: $font-size-md;
        }
        
        .liao-stats-plugin-chart-trend {
          font-size: $font-size-xs;
          padding: 1px 4px;
        }
        
        .liao-stats-plugin-chart-container {
          height: 80px;
        }
      }
    }
  }
}

// 深色模式支持
@media (prefers-color-scheme: dark) {
  .liao-stats-plugin {
    &-item {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
      border-color: rgba(255, 255, 255, 0.1);
      
      &:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
        border-color: rgba(24, 144, 255, 0.3);
      }
    }
  }
}

// 高对比度模式支持
@media (prefers-contrast: high) {
  .liao-stats-plugin {
    &-item {
      border-width: 2px;
      
      &-change {
        font-weight: $font-weight-bold;
      }
    }
  }
}

// 减少动画模式支持
@media (prefers-reduced-motion: reduce) {
  .liao-stats-plugin {
    &-item {
      transition: none;
      
      &:hover {
        transform: none;
      }
    }
  }
}
</style> 