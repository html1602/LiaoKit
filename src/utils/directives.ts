import type { Directive, DirectiveBinding } from 'vue';

// 扩展HTMLElement类型
interface HTMLElementWithRipple extends HTMLElement {
  _rippleHandler?: (e: MouseEvent) => void;
}

// Ripple效果指令
export const vRipple: Directive = {
  mounted(el: HTMLElementWithRipple, binding: DirectiveBinding) {
    // 添加相对定位，以便波纹效果能够正确定位
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    
    // 设置波纹颜色，默认为rgba(255, 255, 255, 0.35)
    const rippleColor = binding.value || 'rgba(255, 255, 255, 0.35)';
    
    // 点击事件监听器
    const clickHandler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 创建波纹元素
      const ripple = document.createElement('span');
      ripple.className = 'v-ripple-effect';
      
      // 计算波纹大小，确保覆盖整个元素
      const size = Math.max(rect.width, rect.height) * 2;
      
      // 设置波纹样式
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;
      ripple.style.backgroundColor = rippleColor;
      
      // 添加波纹元素到按钮中
      el.appendChild(ripple);
      
      // 动画结束后移除波纹元素
      setTimeout(() => {
        if (ripple.parentNode === el) {
          el.removeChild(ripple);
        }
      }, 600);
    };
    
    // 保存点击事件处理器的引用，以便在卸载时移除
    el._rippleHandler = clickHandler;
    
    // 添加点击事件监听器
    el.addEventListener('click', clickHandler);
  },
  
  unmounted(el: HTMLElementWithRipple) {
    // 移除点击事件监听器
    if (el._rippleHandler) {
      el.removeEventListener('click', el._rippleHandler);
      delete el._rippleHandler;
    }
  }
};

// 导出所有指令
export default {
  ripple: vRipple
}; 