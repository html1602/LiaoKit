# liao-progress-plugin Props / Events

> Source: `src\components\LiaoPlugins\LiaoProgressPlugin.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      type?: 'bar' | 'circle' | 'steps';
      percentage?: number;
      percent?: number; // 兼容旧字段名
      status?: 'normal' | 'success' | 'warning' | 'error';
      label?: string;
      description?: string;
      steps?: Step[];
      currentStep?: number;
      estimatedTime?: string;
      actions?: Action[];
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
