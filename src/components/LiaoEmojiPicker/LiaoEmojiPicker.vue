<template>
  <div class="liao-emoji-picker">
    <div class="liao-emoji-picker-content" ref="emojiContentRef">
      <div class="liao-emoji-picker-emojis">
        <button
          v-for="(emoji, index) in allEmojis"
          :key="index"
          class="liao-emoji-picker-emoji"
          @click="selectEmoji(emoji)"
          :title="emoji.name"
        >
          {{ emoji.char }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

// 表情类型
interface Emoji {
  char: string;
  name: string;
  keywords: string[];
  category: string;
}

// 定义Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  maxRecent: {
    type: Number,
    default: 20
  }
});

// 事件
const emit = defineEmits(['select', 'close']);

// 内容区域引用
const emojiContentRef = ref<HTMLElement | null>(null);

// 最近使用的表情
const recentEmojis = ref<Emoji[]>([]);

// 表情数据
const emojiData = ref<Emoji[]>([
  { char: '😀', name: '笑脸', keywords: ['笑', '笑脸', '开心', 'smile', 'happy'], category: 'smileys' },
  { char: '😂', name: '笑哭', keywords: ['笑哭', '大笑', 'laugh', 'joy'], category: 'smileys' },
  { char: '😍', name: '爱心眼', keywords: ['爱心', '眼睛', '爱', 'love', 'heart', 'eyes'], category: 'smileys' },
  { char: '😊', name: '微笑', keywords: ['微笑', '笑', 'smile', 'blush'], category: 'smileys' },
  { char: '🙂', name: '略微笑', keywords: ['略微笑', '微笑', 'slight', 'smile'], category: 'smileys' },
  { char: '😢', name: '哭泣', keywords: ['哭', '哭泣', '伤心', 'sad', 'cry'], category: 'smileys' },
  { char: '😭', name: '大哭', keywords: ['哭', '大哭', 'cry', 'sob'], category: 'smileys' },
  { char: '😡', name: '生气', keywords: ['生气', '愤怒', 'angry', 'mad'], category: 'smileys' },
  { char: '🤔', name: '思考', keywords: ['思考', '想', 'think', 'thinking'], category: 'smileys' },
  { char: '😴', name: '睡觉', keywords: ['睡觉', '睡', 'sleep', 'sleeping'], category: 'smileys' },
  
  { char: '👍', name: '点赞', keywords: ['点赞', '赞', '好', 'like', 'thumbs up'], category: 'gestures' },
  { char: '👋', name: '招手', keywords: ['招手', '你好', 'hello', 'wave'], category: 'gestures' },
  { char: '👏', name: '鼓掌', keywords: ['鼓掌', '掌声', 'clap', 'applause'], category: 'gestures' },
  { char: '🙏', name: '祈祷', keywords: ['祈祷', '拜托', 'pray', 'please'], category: 'gestures' },
  { char: '🤝', name: '握手', keywords: ['握手', '合作', 'handshake', 'deal'], category: 'gestures' },
  { char: '✌️', name: '胜利', keywords: ['胜利', '耶', 'victory', 'peace'], category: 'gestures' },
  
  { char: '❤️', name: '红心', keywords: ['心', '爱心', '爱', 'heart', 'love'], category: 'symbols' },
  { char: '💔', name: '碎心', keywords: ['碎心', '心碎', 'broken', 'heart'], category: 'symbols' },
  { char: '💯', name: '100分', keywords: ['100', '满分', 'perfect', 'score'], category: 'symbols' },
  { char: '🔥', name: '火焰', keywords: ['火', '热', 'fire', 'hot'], category: 'symbols' },
  { char: '⭐', name: '星星', keywords: ['星', '星星', 'star'], category: 'symbols' },
  { char: '✨', name: '闪烁', keywords: ['闪烁', '闪亮', 'sparkle', 'shine'], category: 'symbols' },
  
  { char: '🐱', name: '猫', keywords: ['猫', '猫咪', 'cat', 'kitty'], category: 'animals' },
  { char: '🐶', name: '狗', keywords: ['狗', '狗狗', 'dog', 'puppy'], category: 'animals' },
  { char: '🐼', name: '熊猫', keywords: ['熊猫', '国宝', 'panda'], category: 'animals' },
  { char: '🐷', name: '猪', keywords: ['猪', '猪猪', 'pig'], category: 'animals' },
  
  { char: '🍎', name: '苹果', keywords: ['苹果', '水果', 'apple', 'fruit'], category: 'food' },
  { char: '🍓', name: '草莓', keywords: ['草莓', '水果', 'strawberry', 'fruit'], category: 'food' },
  { char: '🍉', name: '西瓜', keywords: ['西瓜', '水果', 'watermelon', 'fruit'], category: 'food' },
  { char: '🍰', name: '蛋糕', keywords: ['蛋糕', '甜点', 'cake', 'dessert'], category: 'food' },
  { char: '☕', name: '咖啡', keywords: ['咖啡', '热饮', 'coffee', 'drink'], category: 'food' }
]);

// 计算属性：所有表情
const allEmojis = computed(() => {
  // 优先显示最近使用的表情
  if (recentEmojis.value.length > 0) {
    // 创建一个新数组，包含最近使用的表情和其他表情
    return [...recentEmojis.value, ...emojiData.value.filter(emoji => 
      !recentEmojis.value.some(recent => recent.char === emoji.char)
    )];
  }
  return emojiData.value;
});

// 从本地存储加载最近使用的表情
const loadRecentEmojis = () => {
  try {
    const stored = localStorage.getItem('liao-recent-emojis');
    if (stored) {
      const parsed = JSON.parse(stored);
      recentEmojis.value = parsed.slice(0, props.maxRecent);
    }
  } catch (error) {
    console.error('Failed to load recent emojis:', error);
  }
};

// 保存最近使用的表情
const saveRecentEmojis = () => {
  try {
    localStorage.setItem('liao-recent-emojis', JSON.stringify(recentEmojis.value));
  } catch (error) {
    console.error('Failed to save recent emojis:', error);
  }
};

// 选择表情
const selectEmoji = (emoji: Emoji) => {
  emit('select', emoji);
  
  // 添加到最近使用
  const existingIndex = recentEmojis.value.findIndex(e => e.char === emoji.char);
  if (existingIndex !== -1) {
    recentEmojis.value.splice(existingIndex, 1);
  }
  
  recentEmojis.value.unshift(emoji);
  if (recentEmojis.value.length > props.maxRecent) {
    recentEmojis.value = recentEmojis.value.slice(0, props.maxRecent);
  }
  
  saveRecentEmojis();
};

// 初始化
onMounted(() => {
  loadRecentEmojis();
});
</script>

<style lang="scss" scoped>
.liao-emoji-picker {
  width: 100%;
  max-width: 320px;
  max-height: 300px;
  background-color: white;
  border-radius: $border-radius-md;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1000;
  overflow: hidden;
  margin: 0 auto $spacing-md;
  
  &-content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-md;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba($secondary-color, 0.2);
      border-radius: 2px;
    }
  }
  
  &-emojis {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: $spacing-xs;
  }
  
  &-emoji {
    width: 32px;
    height: 32px;
    font-size: 18px;
    background: none;
    border: 1px solid transparent;
    border-radius: $border-radius-sm;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all $transition-duration $transition-timing-function;
    
    &:hover {
      background-color: $bg-secondary;
      border-color: $border-color;
    }
  }
}

@media screen and (max-width: 480px) {
  .liao-emoji-picker {
    max-width: 100%;
    
    &-emojis {
      grid-template-columns: repeat(7, 1fr);
    }
    
    &-emoji {
      width: 36px;
      height: 36px;
    }
  }
}
</style> 