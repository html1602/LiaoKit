# liao-app Props / Events

> Source: `src\components\LiaoApp\LiaoApp.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| windowMode | `boolean` | 否 | `false` |  |
| customClass | `string` | 否 | `` |  |
| messages | `Message[]` | 否 | `() => []` |  |
| loading | `boolean` | 否 | `false` |  |
| emptyText | `string` | 否 | `暂无消息` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showName | `boolean` | 否 | `false` |  |
| showTime | `boolean` | 否 | `true` |  |
| hasMore | `boolean` | 否 | `false` |  |
| loadMoreText | `string` | 否 | `加载更多` |  |
| scrollToBottom | `boolean` | 否 | `true` |  |
| showInput | `boolean` | 否 | `true` |  |
| modelValue | `string` | 否 | `` |  |
| inputPlaceholder | `string` | 否 | `请输入...` |  |
| inputDisabled | `boolean` | 否 | `false` |  |
| inputReadonly | `boolean` | 否 | `false` |  |
| inputRows | `number` | 否 | `2` |  |
| inputMaxLength | `number` | 否 | `0` |  |
| showInputLength | `boolean` | 否 | `true` |  |
| inputExpanded | `boolean` | 否 | `false` |  |
| sendOnEnter | `boolean` | 否 | `true` |  |
| sendOnCtrlEnter | `boolean` | 否 | `false` |  |
| sendEmpty | `boolean` | 否 | `false` |  |
| showQuickActions | `boolean` | 否 | `false` |  |
| quickActions | `QuickAction[]` | 否 | `() => []` |  |
| quickActionsVertical | `boolean` | 否 | `false` |  |
| quickActionsFixed | `boolean` | 否 | `false` |  |
| showQuickActionLabel | `boolean` | 否 | `true` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| update:modelValue | `(...) => void` |
| send | `(...) => void` |
| load-more | `(...) => void` |
| scroll | `(...) => void` |
| scroll-to-top | `(...) => void` |
| scroll-to-bottom | `(...) => void` |
| input-focus | `(...) => void` |
| input-blur | `(...) => void` |
| input-keydown | `(...) => void` |
| quick-action | `(...) => void` |
