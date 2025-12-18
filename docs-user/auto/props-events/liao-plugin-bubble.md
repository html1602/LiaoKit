# liao-plugin-bubble Props / Events

> Source: `src\components\LiaoMessageBubble\LiaoPluginBubble.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginType | `string` | 否 | `` |  |
| pluginData | `object` | 否 | `() => ({})` |  |
| status | `'normal' | 'success' | 'error' | 'warning' | 'info'` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |
| errorMessage | `string` | 否 | `` |  |
| id | `[...]` | 否 | `null` |  |
| messageId | `[...]` | 否 | `null` |  |
| pluginRequired | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
| click | `(...) => void` |
| context-menu | `(...) => void` |
| complete | `(...) => void` |
| cancel | `(...) => void` |
| error | `(...) => void` |
