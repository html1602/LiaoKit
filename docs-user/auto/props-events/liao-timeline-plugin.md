# liao-timeline-plugin Props / Events

> Source: `src\components\LiaoPlugins\LiaoTimelinePlugin.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      description?: string;
      items: TimelineItem[];
      layout?: 'vertical' | 'horizontal';
      size?: 'small' | 'default' | 'large';
      showMore?: boolean;
      loadMoreText?: string;
      showStats?: boolean;
      stats?: TimelineStats[];
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
