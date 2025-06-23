import type { App } from 'vue';

// 获取assets/icons目录下的所有SVG文件
const svgModules = import.meta.glob<string>('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true });
// console.log('SVG modules found:', Object.keys(svgModules).length);
// console.log('SVG modules paths:', Object.keys(svgModules));

// 处理SVG文件名称，转换为组件名称
function getSvgIconName(path: string): string {
  // 从路径中提取文件名（不含扩展名）
  const filename = path.replace(/^.*[\\\/]/, '').replace(/\.\w+$/, '');
  return `icon-liao-${filename.toLowerCase()}`;
}

// 创建SVG组件
function createSvgComponent(svg: string) {
  return {
    render() {
      return {
        template: svg
      };
    }
  };
}

// 注册所有SVG图标
export function registerSvgIconComponents(app: App): void {
  // console.log('Registering SVG icon components...');
  const registeredIcons = [];
  
  Object.entries(svgModules).forEach(([path, svg]) => {
    const componentName = getSvgIconName(path);
    
    // 使用h函数创建组件，而不是使用template
    app.component(componentName, {
      render() {
        const div = document.createElement('div');
        div.innerHTML = svg as string;
        
        // 记录SVG内容，检查是否有效
        // console.log(`SVG content for ${componentName}:`, (svg as string).substring(0, 50) + '...');
        
        return () => ({
          template: `<div class="svg-icon-wrapper">${svg}</div>`
        });
      }
    });
    
    registeredIcons.push(componentName);
    // console.log(`Registered SVG icon: ${componentName}`);
  });
  
  // console.log(`Registered ${registeredIcons.length} SVG icons`);
}

// 获取所有可用图标名称列表
export function getAvailableIcons(): string[] {
  const icons = Object.keys(svgModules).map(path => {
    // 从路径中提取文件名（不含扩展名）
    const filename = path.replace(/^.*[\\\/]/, '').replace(/\.\w+$/, '');
    return filename.toLowerCase();
  });
  
  // console.log('Available icons from getAvailableIcons():', icons);
  return icons;
} 