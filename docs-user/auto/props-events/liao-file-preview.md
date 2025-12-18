# liao-file-preview Props / Events

> Source: `src\components\LiaoFilePreview\LiaoFilePreview.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| files | `PreviewFile[]` | 否 | `() => []` |  |
| loading | `boolean` | 否 | `false` |  |
| showDownload | `boolean` | 否 | `true` |  |
| showPreview | `boolean` | 否 | `true` |  |
| showRemove | `boolean` | 否 | `true` |  |
| emptyText | `string` | 否 | `暂无文件` |  |
| maxPreviewSize | `number` | 否 | `10 * 1024 * 1024` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| remove | `(...) => void` |
| download | `(...) => void` |
| preview | `(...) => void` |
| error | `(...) => void` |
