# liao-window-list Props / Events

> Source: `src\components\LiaoWindowList\LiaoWindowList.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| initialWindows | `Partial<WindowInfo>[]` | 否 | `() => []` |  |
| maxWindowCount | `number` | 否 | `10` |  |
| defaultLayout | `LayoutMode` | 否 | `free` |  |
| config | `Partial<WindowManagerConfig>` | 否 | `() => ({})` |  |
| mobileBreakpoint | `number` | 否 | `768` |  |
| autoCreateFirst | `boolean` | 否 | `true` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| window-created | `(...) => void` |
| window-closed | `(...) => void` |
| window-activated | `(...) => void` |
| window-minimized | `(...) => void` |
| window-restored | `(...) => void` |
| layout-changed | `(...) => void` |
| device-type-changed | `(...) => void` |
