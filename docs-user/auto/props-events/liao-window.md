# liao-window Props / Events

> Source: `src\components\LiaoWindow\LiaoWindow.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| title | `string` | 否 | `` |  |
| width | `[...]` | 否 | `400px` |  |
| height | `[...]` | 否 | `600px` |  |
| maxWidth | `[...]` | 否 | `800px` |  |
| maxHeight | `[...]` | 否 | `800px` |  |
| minWidth | `[...]` | 否 | `320px` |  |
| minHeight | `[...]` | 否 | `500px` |  |
| rounded | `boolean` | 否 | `true` |  |
| shadow | `boolean` | 否 | `true` |  |
| showClose | `boolean` | 否 | `true` |  |
| showMinimize | `boolean` | 否 | `true` |  |
| showMaximize | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |
| defaultSessionMode | `SessionMode` | 否 | `human` |  |
| enableEmergencyUnlock | `boolean` | 否 | `true` |  |
| autoUnlockTimeout | `number` | 否 | `30000` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| close | `(...) => void` |
| minimize | `(...) => void` |
| maximize | `(...) => void` |
| session-mode-change | `(...) => void` |
| input-lock-change | `(...) => void` |
| plugin-complete | `(...) => void` |
| plugin-cancel | `(...) => void` |
| plugin-error | `(...) => void` |
| emergency-unlock | `(...) => void` |
| auto-focus-input | `(...) => void` |
