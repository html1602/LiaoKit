# liao-text-bubble Props / Events

> Source: `src\components\LiaoMessageBubble\LiaoTextBubble.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| content | `string` | 是 | `` |  |
| linkify | `boolean` | 否 | `true` |  |
| emoji | `boolean` | 否 | `true` |  |
| highlight | `string | string[]` | 否 | `null` |  |
| editable | `boolean` | 否 | `false` |  |
| collapsed | `boolean` | 否 | `false` |  |
| maxLines | `number` | 否 | `5` |  |
| error | `boolean` | 否 | `false` |  |
| status | `'sending' | 'failed' | 'recalled' | 'reported' | null` | 否 | `null` |  |
| theme | `'auto' | 'light' | 'dark' | 'brand'` | 否 | `auto` |  |
| sender | `{
      id?: string | number;
      name?: string;
      avatar?: string;
    }` | 否 | `() => ({})` |  |
| customStyle | `[...]` | 否 | `null` |  |
| id | `[...]` | 否 | `null` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| copy | `(...) => void` |
| link-click | `(...) => void` |
| bubble-click | `(...) => void` |
| bubble-longpress | `(...) => void` |
| expand | `(...) => void` |
