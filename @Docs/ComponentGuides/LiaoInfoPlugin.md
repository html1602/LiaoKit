# LiaoInfoPlugin 组件使用指南

![版本](https://img.shields.io/badge/版本-2.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--12-green.svg)

## 组件介绍

LiaoInfoPlugin 是一个功能丰富的信息展示插件组件，支持多种数据格式和交互方式。它可以用于展示订单详情、用户信息、产品规格等各种结构化信息。

## 功能特性

- ✅ **多种数据结构支持** - 同时支持简单列表和复杂分组数据结构
- 🎨 **丰富的样式类型** - 支持价格、折扣、地址等不同类型的样式
- 🏷️ **徽章系统** - 支持验证、快速等状态徽章
- 📋 **复制功能** - 支持一键复制重要信息
- 🔒 **隐私保护** - 支持敏感信息脱敏显示
- ⚡ **操作按钮** - 支持多个自定义操作按钮
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎯 **extend字段** - 支持自定义扩展数据传递

## 基础用法

### 简单信息展示

```vue
<template>
  <LiaoInfoPlugin
    :plugin-data="simpleInfoData"
    @action="handleAction"
  />
</template>

<script setup>
const simpleInfoData = {
  title: '用户基本信息',
  subtitle: '账户详情',
  items: [
    { label: '用户名', value: 'John Doe' },
    { label: '邮箱', value: 'john@example.com' },
    { label: '注册时间', value: '2023-01-15' }
  ],
  footerText: '信息最后更新：2025-06-12',
  buttonText: '编辑信息'
}

const handleAction = (event) => {
  console.log('操作事件:', event)
}
</script>
```

### 复杂分组信息展示

```vue
<template>
  <LiaoInfoPlugin
    :plugin-data="complexInfoData"
    @action="handleAction"
  />
</template>

<script setup>
const complexInfoData = {
  title: '订单详情 #ORD20250612001',
  subtitle: '购买时间：2025-06-12 14:30:45',
  sections: [
    {
      title: '商品信息',
      icon: 'package',
      items: [
        { 
          label: '商品名称', 
          value: 'MacBook Pro 16英寸', 
          highlight: true 
        },
        { 
          label: '商品单价', 
          value: '¥19,999', 
          type: 'price' 
        },
        { 
          label: '购买数量', 
          value: '1件' 
        }
      ]
    },
    {
      title: '支付信息',
      icon: 'credit-card',
      items: [
        { 
          label: '支付方式', 
          value: '微信支付', 
          badge: 'verified' 
        },
        { 
          label: '交易单号', 
          value: 'WX20250612143045789', 
          copy: true 
        },
        { 
          label: '实付金额', 
          value: '¥19,999', 
          type: 'final_price',
          highlight: true 
        }
      ]
    }
  ],
  actions: [
    { 
      id: 'track', 
      text: '查看物流', 
      type: 'primary',
      icon: 'truck',
      extend: {
        orderId: 'ORD20250612001',
        trackingNumber: 'SF1234567890'
      }
    },
    { 
      id: 'contact', 
      text: '联系客服', 
      type: 'default',
      icon: 'message'
    }
  ],
  statusColor: 'success'
}
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| pluginData | Object | {} | 插件数据配置对象 |
| status | String | 'normal' | 组件状态 |
| loading | Boolean | false | 是否显示加载状态 |
| readonly | Boolean | false | 是否为只读模式 |

### pluginData 配置项

| 配置项 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| title | String | '信息' | 标题 |
| subtitle | String | - | 副标题 |
| content | String | - | 纯文本内容 |
| icon | String | - | 头部图标 |
| theme | String | 'default' | 主题样式 (default/info/warning/success/error) |
| statusColor | String | - | 状态颜色 (success/warning/error) |
| items | Array | [] | 简单信息项数组（向后兼容） |
| sections | Array | [] | 分组信息数组 |
| actions | Array | [] | 操作按钮数组 |
| footerText | String | - | 底部说明文字 |
| buttonText | String | - | 简单按钮文字（向后兼容） |

### InfoItem 结构 (简单模式)

```typescript
interface InfoItem {
  label: string;        // 标签文本
  value: string;        // 值文本
}
```

### InfoSection 结构 (分组模式)

```typescript
interface InfoSection {
  title: string;        // 分组标题
  icon?: string;        // 分组图标名称
  items: EnhancedInfoItem[];  // 增强信息项数组
}
```

### EnhancedInfoItem 结构

```typescript
interface EnhancedInfoItem {
  label: string;        // 标签文本
  value: string;        // 值文本
  highlight?: boolean;  // 是否高亮显示
  type?: string;        // 类型样式
  badge?: string;       // 徽章类型
  copy?: boolean;       // 是否显示复制按钮
  privacy?: boolean;    // 是否为隐私信息
}
```

### InfoAction 结构

```typescript
interface InfoAction {
  id: string;           // 操作ID
  text: string;         // 按钮文本
  type?: string;        // 按钮类型 (primary/default/danger)
  icon?: string;        // 按钮图标
  extend?: Record<string, any>;  // 自定义扩展数据
}
```

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action | ActionEvent | 操作按钮点击事件 |

### ActionEvent 结构

```typescript
interface ActionEvent {
  type: 'info-action';
  data: {
    actionId?: string;        // 操作ID
    actionText?: string;      // 操作文本
    actionType?: string;      // 操作类型
    title: string;            // 组件标题
    extend?: any;             // 扩展数据
    // 兼容旧版本
    buttonText?: string;      // 简单按钮文本
  };
}
```

## 类型和样式

### item type 类型

| 类型 | 样式效果 | 使用场景 |
|-----|---------|----------|
| price | 绿色，中等字重 | 商品价格 |
| total | 红色，粗体，大字号 | 总价、合计金额 |
| final_price | 红色，粗体，大字号 | 最终付款金额 |
| discount | 绿色 | 折扣、优惠金额 |
| free | 绿色，中等字重 | 免费项目 |
| urgent | 红色，中等字重 | 紧急信息 |
| address | 正常样式，行高1.4 | 地址信息 |

### badge 徽章类型

| 徽章类型 | 显示文本 | 颜色 | 使用场景 |
|---------|---------|-----|----------|
| verified | 已验证 | 绿色 | 已验证的信息 |
| fast | 快速 | 蓝色 | 快速服务标识 |

### theme 主题类型

| 主题 | 边框颜色 | 使用场景 |
|-----|---------|----------|
| default | 蓝色 | 普通信息 |
| info | 信息蓝 | 提示信息 |
| success | 绿色 | 成功状态 |
| warning | 橙色 | 警告信息 |
| error | 红色 | 错误信息 |

## 高级用法

### 带复制功能的敏感信息

```vue
<script setup>
const sensitiveInfoData = {
  title: '银行卡信息',
  sections: [
    {
      title: '卡片详情',
      icon: 'credit-card',
      items: [
        { 
          label: '卡号', 
          value: '6222 **** **** 1234', 
          privacy: true,
          copy: true 
        },
        { 
          label: '持卡人', 
          value: '张三' 
        },
        { 
          label: '银行', 
          value: '中国工商银行', 
          badge: 'verified' 
        }
      ]
    }
  ]
}
</script>
```

### 带扩展数据的操作按钮

```vue
<script setup>
const orderInfoData = {
  title: '订单操作',
  actions: [
    {
      id: 'refund',
      text: '申请退款',
      type: 'danger',
      icon: 'refund',
      extend: {
        orderId: 'ORD20250612001',
        amount: 19999.00,
        refundType: 'full_refund',
        paymentMethod: 'wechat_pay'
      }
    }
  ]
}

const handleAction = (event) => {
  if (event.data.actionId === 'refund') {
    const refundData = event.data.extend
    console.log('退款信息:', refundData)
    // 处理退款逻辑
  }
}
</script>
```

### 状态指示器

```vue
<script setup>
const statusInfoData = {
  title: '订单状态',
  statusColor: 'success',  // 顶部状态条
  theme: 'success',        // 左侧主题条
  sections: [
    {
      title: '当前状态',
      items: [
        { 
          label: '订单状态', 
          value: '已发货', 
          type: 'urgent',
          highlight: true 
        }
      ]
    }
  ]
}
</script>
```

## 样式定制

### CSS 变量

```scss
.liao-info-plugin {
  // 主题颜色
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --danger-color: #ff4d4f;
  
  // 背景色
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  
  // 文字颜色
  --text-primary: #333333;
  --text-secondary: #666666;
  
  // 边框颜色
  --border-color-card: #e8e8e8;
  
  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
}
```

### 自定义样式示例

```scss
// 自定义主题色
.my-custom-info {
  .liao-info-plugin-default {
    border-left-color: #722ed1;
  }
  
  .liao-info-plugin-section-icon {
    color: #722ed1;
  }
  
  .liao-info-plugin-action-btn.btn-primary {
    background-color: #722ed1;
    border-color: #722ed1;
  }
}

// 自定义字体大小
.large-text-info {
  .liao-info-plugin-title {
    font-size: 20px;
  }
  
  .liao-info-plugin-item-label {
    font-size: 16px;
  }
  
  .liao-info-plugin-item-value {
    font-size: 16px;
  }
}
```

## 注意事项

### 数据结构兼容性
- 组件同时支持简单的 `items` 数组和复杂的 `sections` 数组
- 如果同时提供 `items` 和 `sections`，优先使用 `sections`
- 建议新项目使用 `sections` 结构以获得更好的功能支持

### 图标使用
- 组件依赖 `LiaoIcon` 组件来显示图标
- 确保在使用图标前已正确安装和配置图标组件
- 支持的图标名称需要在 `LiaoIcon` 组件中定义

### 复制功能
- 复制功能使用现代浏览器的 `navigator.clipboard` API
- 在不支持的环境中会自动降级到 `document.execCommand` 方式
- 建议在 HTTPS 环境下使用以获得最佳体验

### 响应式支持
- 组件在移动端会自动调整布局
- 推荐在移动端使用时适当减少信息密度
- 操作按钮在小屏幕上会自动调整为纵向排列

### extend 字段最佳实践
- extend 字段用于传递自定义业务数据
- 在事件处理函数中可以获取到完整的 extend 数据
- 建议使用有意义的字段名，便于后续维护
- extend 数据会在操作事件中原样返回

## 浏览器兼容性

| 浏览器 | 最低版本 | 特殊说明 |
|--------|---------|----------|
| Chrome | 60+ | 完全支持 |
| Firefox | 60+ | 完全支持 |
| Safari | 12+ | 完全支持 |
| Edge | 79+ | 完全支持 |
| IE | 不支持 | 需要现代浏览器环境 |

## 更新日志

### 2.0.0 (2025-06-12)
- 🎉 **重大更新**：新增复杂分组数据结构支持
- ✨ **新增功能**：支持 sections 分组展示
- ✨ **新增功能**：增强的 item 属性支持（highlight、type、badge、copy、privacy）
- ✨ **新增功能**：多操作按钮支持，替代单一按钮模式
- ✨ **新增功能**：extend 字段支持，允许传递自定义扩展数据
- 🎨 **样式优化**：图标颜色与文字颜色保持一致
- 🐛 **修复问题**：复制功能在各种环境下的兼容性
- 📱 **响应式**：优化移动端显示效果
- 🔄 **向后兼容**：保持对原有 items 结构的完全兼容

### 1.0.0 (2025-05-20)
- 🎉 初始版本发布
- ✨ 支持基础信息展示
- ✨ 支持简单操作按钮
- ✨ 支持多种主题样式 