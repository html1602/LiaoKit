# liao-info-plugin Props / Events

> Source: `src\components\LiaoPlugins\LiaoInfoPlugin.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title: string;
      subtitle?: string;
      content?: string;
      items?: InfoItem[];
      sections?: InfoSection[];
      actions?: InfoAction[];
      icon?: string;
      theme?: 'default' | 'info' | 'warning' | 'success' | 'error';
      statusColor?: 'success' | 'warning' | 'error';
      footerText?: string;
      buttonText?: string;
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
