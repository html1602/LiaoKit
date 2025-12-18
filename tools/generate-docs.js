/**
 * 自动扫描 src/components 与 src/components/LiaoPlugins 下的 .vue 文件，
 * 提取 defineProps / defineEmits 的关键信息，生成 Markdown 表格到 docs-user/auto/props-events。
 * 仅用 Node.js 标准库与简易正则，适合作为基础自动化骨架。
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'

/**
 * 读取目录下所有 .vue 文件路径
 */
function collectVueFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectVueFiles(full))
    } else if (entry.isFile() && full.endsWith('.vue')) {
      files.push(full)
    }
  }
  return files
}

/**
 * 从 .vue 文件中粗略提取 defineProps/defineEmits 内容
 */
function extractPropsEmits(content) {
  const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)
  const script = scriptMatch ? scriptMatch[1] : ''
  const propsMatch = script.match(/defineProps\(([\s\S]*?)\)/)
  const emitsMatch = script.match(/defineEmits\(([\s\S]*?)\)/)
  return {
    rawProps: propsMatch ? propsMatch[1].trim() : '',
    rawEmits: emitsMatch ? emitsMatch[1].trim() : ''
  }
}

/**
 * 将原始 props/emits 内容写入 Markdown，供人工或后续升级脚本处理
 */
function toMarkdown(name, relPath, rawProps, rawEmits) {
  const title = `# ${name} Props / Events`
  const src = `> Source: \`${relPath}\``
  const propsSection = rawProps
    ? `\n## Props (raw)\n\`\`\`ts\n${rawProps}\n\`\`\`\n`
    : `\n## Props (raw)\n无\n`
  const emitsSection = rawEmits
    ? `\n## Events (raw)\n\`\`\`ts\n${rawEmits}\n\`\`\`\n`
    : `\n## Events (raw)\n无\n`
  return `${title}\n\n${src}\n${propsSection}${emitsSection}`
}

/**
 * 主函数：生成所有 Markdown
 */
function main() {
  const root = process.cwd()
  const compDir = join(root, 'src', 'components')
  const outDir = join(root, 'docs-user', 'auto', 'props-events')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const vueFiles = collectVueFiles(compDir)
  for (const file of vueFiles) {
    const content = readFileSync(file, 'utf-8')
    const { rawProps, rawEmits } = extractPropsEmits(content)
    const relPath = file.replace(root + '\\', '').replace(root + '/', '')
    const base = basename(file, '.vue').toLowerCase().replace(/([A-Z])/g, (m, p1, idx) => (idx ? '-' : '') + m.toLowerCase())
    const md = toMarkdown(base, relPath, rawProps, rawEmits)
    const outFile = join(outDir, `${base}.md`)
    writeFileSync(outFile, md, 'utf-8')
    console.log('Generated:', outFile)
  }
}

main()

