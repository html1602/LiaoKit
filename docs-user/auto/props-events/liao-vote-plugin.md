# liao-vote-plugin Props / Events

> Source: `src\components\LiaoPlugins\LiaoVotePlugin.vue`

## Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      question?: string;
      description?: string;
      options?: (string | VoteOption)[];
      allowMultiple?: boolean;
      showResults?: boolean;
      showPercentage?: boolean;
      results?: VoteResult[];
      totalVotes?: number;
      userVote?: string | string[] | null;
      votingEnabled?: boolean;
      submitText?: string;
    }` | 否 | `() => ({})` |  |
| readonly | `boolean` | 否 | `false` |  |
| disabled | `boolean` | 否 | `false` |  |
| loading | `boolean` | 否 | `false` |  |


## Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
