# liao-message-bubble Props / Events

> Source: `src\components\LiaoMessageBubble\LiaoMessageBubble.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| content | `string` | 否 | `` |  |
| type | `'self' | 'other' | 'system'` | 否 | `other` |  |
| avatar | `string` | 否 | `` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showAvatarSelf | `boolean` | 否 | `true` |  |
| name | `string` | 否 | `` |  |
| showName | `boolean` | 否 | `false` |  |
| time | `[...]` | 否 | `` |  |
| showTime | `boolean` | 否 | `false` |  |
| timeFormat | `string` | 否 | `HH:mm` |  |
| highlight | `boolean` | 否 | `false` |  |
| status | `MessageStatus` | 否 | `sent` |  |
| enableMarkdown | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| click | `(...) => void` |
| context-menu | `(...) => void` |
