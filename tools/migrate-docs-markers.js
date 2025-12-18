
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dirs = [
  'docs-user/components',
  'docs-user/plugins'
];

function migrate(file) {
  let content = readFileSync(file, 'utf-8');
  
  // 如果已经包含标记，跳过
  if (content.includes('<!-- @auto-api-start -->')) return;

  // 寻找旧的 Props/Events 区域
  // 通常是 "## Props" 开始
  const propsIndex = content.indexOf('## Props');
  
  if (propsIndex !== -1) {
    // 截断到 "## Props" 之前
    const before = content.substring(0, propsIndex);
    
    // 寻找下一个不是 API 相关的章节
    // 假设 API 相关章节包括：Props, Events, Slots (Slots 一般不自动生成，但这里为了简化，先假设都替换)
    // 实际上脚本只生成 Props 和 Events。Slots 我们可能需要保留手动编写。
    // 为了稳妥，我们只替换 "## Props" ... 到下一个 "## Slots" 或 "## Theme" 之前。
    
    // 但我们的目标是“注入”，所以最好是插入一个完整的 API 章节。
    
    // 简单粗暴方案：保留 "## 简介", "## 快速示例" 等前面的内容，
    // 在 "## Props" 之前插入自动化标记，并移除旧的 Props/Events 表格。
    
    // 查找 Props 之后最近的一个 "## " (不包含 Props/Events)
    const afterProps = content.substring(propsIndex);
    
    // 寻找下一个二级标题
    // 我们要跳过 ## Props 和 ## Events
    let nextSectionIndex = -1;
    const lines = afterProps.split('\n');
    let skipMode = true;
    let consumedChars = 0;
    
    for (const line of lines) {
      if (line.startsWith('## ') && !line.startsWith('## Props') && !line.startsWith('## Events')) {
        nextSectionIndex = consumedChars;
        break;
      }
      consumedChars += line.length + 1; // +1 for newline
    }
    
    const newContent = 
      before + 
      '## API Reference\n\n' +
      '<!-- @auto-api-start -->\n' +
      '<!-- @auto-api-end -->\n\n' +
      (nextSectionIndex !== -1 ? afterProps.substring(nextSectionIndex) : '');
      
    writeFileSync(file, newContent, 'utf-8');
    console.log('Migrated:', file);
  } else {
    // 如果没有 Props 章节，追加到文件末尾
    const newContent = content + 
      '\n\n## API Reference\n\n' +
      '<!-- @auto-api-start -->\n' +
      '<!-- @auto-api-end -->\n';
    writeFileSync(file, newContent, 'utf-8');
    console.log('Appended:', file);
  }
}

for (const d of dirs) {
  const fullDir = join(process.cwd(), d);
  const files = readdirSync(fullDir).filter(f => f.endsWith('.md') && f !== 'README.md');
  for (const f of files) {
    migrate(join(fullDir, f));
  }
}
