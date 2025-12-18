# liao-input-area Props / Events

> Source: `src\components\LiaoInputArea\LiaoInputArea.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| modelValue | `string` | 否 | `` |  |
| placeholder | `string` | 否 | `输入消息...` |  |
| disabled | `boolean` | 否 | `false` |  |
| locked | `boolean` | 否 | `false` |  |
| lockReason | `LockReason` | 否 | `null` |  |
| expanded | `boolean` | 否 | `false` |  |
| accept | `string` | 否 | `*/*` |  |
| multiple | `boolean` | 否 | `false` |  |
| showVoice | `boolean` | 否 | `true` |  |
| enableVoiceInput | `boolean` | 否 | `true` |  |
| enableEmojiInput | `boolean` | 否 | `true` |  |
| enableFileUpload | `boolean` | 否 | `true` |  |
| enableCamera | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |
| deviceType | `string` | 否 | `` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| update:modelValue | `(...) => void` |
| send | `(...) => void` |
| focus | `(...) => void` |
| blur | `(...) => void` |
| file-upload | `(...) => void` |
| voice-record | `(...) => void` |
| emoji-select | `(...) => void` |
| camera-capture | `(...) => void` |
