# liao-quick-action-bar Props / Events

> Source: `src\components\LiaoQuickActionBar\LiaoQuickActionBar.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| actions | `QuickAction[]` | 否 | `() => []` |  |
| vertical | `boolean` | 否 | `false` |  |
| fixed | `boolean` | 否 | `false` |  |
| showLabel | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |
| showScrollIndicators | `boolean` | 否 | `true` |  |
| scrollStep | `number` | 否 | `200` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action-click | `(...) => void` |
