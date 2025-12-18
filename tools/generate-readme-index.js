
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const root = process.cwd();
const docsDir = join(root, 'docs-user');

function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const [key, ...val] = line.split(':');
    if (key && val) {
      let value = val.join(':').trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Handle arrays [a, b] -> a, b (simple)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1);
      }
      fm[key.trim()] = value;
    }
  });
  return fm;
}

function generateIndex(dirName, title, desc) {
  const dirPath = join(docsDir, dirName);
  if (!existsSync(dirPath)) return;

  const files = readdirSync(dirPath).filter(f => f.endsWith('.md') && f !== 'README.md');
  
  let md = `# ${title}\n\n${desc}\n\n`;
  md += `| 名称 | 描述 | 更新时间 |\n| :--- | :--- | :--- |\n`;

  const items = [];

  files.forEach(file => {
    const content = readFileSync(join(dirPath, file), 'utf-8');
    const fm = getFrontmatter(content);
    const name = fm.title || basename(file, '.md');
    const description = fm.description || '-';
    const updated = fm.updated || '-';
    
    // Clean up title for sorting
    const sortName = name.replace(/^Liao/, ''); 
    
    items.push({
      file,
      name,
      description,
      updated,
      sortName
    });
  });

  // Sort by name
  items.sort((a, b) => a.sortName.localeCompare(b.sortName));

  items.forEach(item => {
    md += `| [${item.name}](./${item.file}) | ${item.description} | ${item.updated} |\n`;
  });

  writeFileSync(join(dirPath, 'README.md'), md, 'utf-8');
  console.log(`Generated index for ${dirName}`);
}

// Generate for Components
generateIndex(
  'components', 
  '组件总览 (Components)', 
  'LiaoKit 提供的所有 UI 组件索引。点击名称查看详细文档与使用示例。'
);

// Generate for Plugins
generateIndex(
  'plugins', 
  '插件总览 (Plugins)', 
  'LiaoKit 的消息流插件系统。这些插件可以作为消息类型嵌入到聊天窗口中。'
);
