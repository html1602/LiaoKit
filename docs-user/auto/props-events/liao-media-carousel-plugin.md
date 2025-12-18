# liao-media-carousel-plugin Props / Events

> Source: `src\components\LiaoPlugins\LiaoMediaCarouselPlugin.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      items: MediaItem[];
      autoplay?: boolean;
      interval?: number;
      showControls?: boolean;
      showIndicators?: boolean;
      enableItemClick?: boolean; // 是否启用项目点击
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
