# liao-message-list Props / Events

> Source: `src\components\LiaoMessageList\LiaoMessageList.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| messages | `Message[]` | 否 | `() => []` |  |
| loading | `boolean` | 否 | `false` |  |
| loadingMore | `boolean` | 否 | `false` |  |
| autoDetectHistoryLoading | `boolean` | 否 | `true` |  |
| emptyText | `string` | 否 | `暂无消息` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showAvatarSelf | `boolean` | 否 | `true` |  |
| showName | `boolean` | 否 | `false` |  |
| showTime | `boolean` | 否 | `false` |  |
| hasMore | `boolean` | 否 | `false` |  |
| loadMoreText | `string` | 否 | `加载更多` |  |
| scrollToBottom | `boolean` | 否 | `true` |  |
| scrollThreshold | `number` | 否 | `100` |  |
| showDateDivider | `boolean` | 否 | `true` |  |
| dateDividerFormat | `string` | 否 | `YYYY年MM月DD日` |  |
| unreadCount | `number` | 否 | `0` |  |
| useAiAdapter | `boolean` | 否 | `false` |  |
| aiAdapterOptions | `AiAdapterOptions` | 否 | `() => ({})` |  |
| customFormat | `CustomFormatFunction` | 否 | `undefined` |  |
| enableAdapterCache | `boolean` | 否 | `true` |  |
| adapterTimeout | `number` | 否 | `5000` |  |
| skipUserMessageAdapter | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| load-more | `(...) => void` |
| scroll | `(...) => void` |
| scroll-to-top | `(...) => void` |
| scroll-to-bottom | `(...) => void` |
| read-all | `(...) => void` |
| quick-action-click | `(...) => void` |
| plugin-action | `(...) => void` |
| plugin-complete | `(...) => void` |
| plugin-cancel | `(...) => void` |
| plugin-error | `(...) => void` |
| file-preview | `(...) => void` |
| file-download | `(...) => void` |
| file-click | `(...) => void` |
| file-retry | `(...) => void` |
| file-more | `(...) => void` |
| adapter-success | `(...) => void` |
| adapter-error | `(...) => void` |
| adapter-fallback | `(...) => void` |
