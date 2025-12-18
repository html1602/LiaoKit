# liao-file-upload Props / Events

> Source: `src\components\LiaoFileUpload\LiaoFileUpload.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| accept | `string` | 否 | `*/*` |  |
| multiple | `boolean` | 否 | `true` |  |
| disabled | `boolean` | 否 | `false` |  |
| maxFiles | `number` | 否 | `10` |  |
| maxSize | `number` | 否 | `10 * 1024 * 1024` |  |
| maxTotalSize | `number` | 否 | `100 * 1024 * 1024` |  |
| primaryText | `string` | 否 | `点击或拖拽文件到此处上传` |  |
| secondaryText | `string` | 否 | `支持单个或批量上传` |  |
| acceptText | `string` | 否 | `` |  |
| showUploadButton | `boolean` | 否 | `true` |  |
| showClearButton | `boolean` | 否 | `true` |  |
| showDownload | `boolean` | 否 | `false` |  |
| showPreview | `boolean` | 否 | `true` |  |
| showRemove | `boolean` | 否 | `true` |  |
| showStats | `boolean` | 否 | `true` |  |
| autoUpload | `boolean` | 否 | `false` |  |
| uploadUrl | `string` | 否 | `` |  |
| uploadHeaders | `Record<string, string>` | 否 | `() => ({})` |  |
| uploadData | `Record<string, any>` | 否 | `() => ({})` |  |
| modelValue | `PreviewFile[]` | 否 | `() => []` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| update:modelValue | `(...) => void` |
| change | `(...) => void` |
| upload-start | `(...) => void` |
| upload-progress | `(...) => void` |
| upload-success | `(...) => void` |
| upload-error | `(...) => void` |
| upload-complete | `(...) => void` |
| file-add | `(...) => void` |
| file-remove | `(...) => void` |
| file-preview | `(...) => void` |
| error | `(...) => void` |
