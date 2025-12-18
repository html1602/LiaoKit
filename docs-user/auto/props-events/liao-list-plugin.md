# liao-list-plugin Props / Events

> Source: `src\components\LiaoPlugins\LiaoListPlugin.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      items: ListItem[];
      actions?: ItemAction[];
      showImages?: boolean;
      showBadges?: boolean;
      // 搜索相关配置
      enableSearch?: boolean;
      searchPlaceholder?: string;
      searchFields?: string[]; // 指定搜索的字段，为空则搜索所有字段
      searchCaseSensitive?: boolean; // 是否区分大小写
      searchHighlight?: boolean; // 是否高亮搜索结果
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
| search | `(...) => void` |
