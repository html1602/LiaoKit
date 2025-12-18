// 使用 TypeScript AST 解析 <script setup> 内容，生成标准 Props/Events 表格。
// 解析范围：src/components 下所有 .vue 文件（包含 LiaoPlugins）。
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import ts from 'typescript'

/**
 * 收集指定目录下的所有 .vue 文件
 */
function collectVueFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...collectVueFiles(full))
    else if (entry.isFile() && full.endsWith('.vue')) out.push(full)
  }
  return out
}

/**
 * 提取 SFC 中的 <script setup> 内容（若不存在则回退到第一个 <script>）
 */
function extractScript(content) {
  const matches = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
  if (matches.length === 0) return ''
  // 优先选择包含 setup 的脚本块
  const setupMatch = [...content.matchAll(/<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/gi)]
  if (setupMatch.length > 0) return setupMatch[0][1]
  return matches[0][1]
}

/**
 * 解析源码为 TypeScript AST
 */
function parseSource(scriptText, fileName = 'sfc.ts') {
  return ts.createSourceFile(fileName, scriptText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
}

/**
 * 判断节点是否为指定标识符
 */
function isIdentifier(node, name) {
  return ts.isIdentifier(node) && node.text === name
}

/**
 * 获取指定标识符的调用表达式列表
 */
function getCallExpressions(sf, calleeName) {
  const calls = []
  function visit(n) {
    if (ts.isCallExpression(n) && isIdentifier(n.expression, calleeName)) calls.push(n)
    ts.forEachChild(n, visit)
  }
  visit(sf)
  return calls
}

/**
 * 将字面量/表达式转换为字符串输出
 */
function getString(node) {
  if (!node) return ''
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (node.kind === ts.SyntaxKind.TrueKeyword) return 'true'
  if (node.kind === ts.SyntaxKind.FalseKeyword) return 'false'
  if (ts.isNumericLiteral(node)) return node.text
  if (ts.isArrayLiteralExpression(node)) return '[...]'
  if (ts.isObjectLiteralExpression(node)) return '{...}'
  if (ts.isIdentifier(node)) return node.text
  if (ts.isAsExpression(node)) {
    // e.g. String as PropType<LockReason>
    return getString(node.expression) + ' as ' + node.type.getText()
  }
  return node.getText()
}

/**
 * 从 props.type 字段推断类型文本，支持 PropType<T> 写法
 */
function inferTypeFromTypeProp(node) {
  // node could be: Identifier(String/Boolean/Number/Object/Array) or AsExpression (String as PropType<T>)
  if (ts.isIdentifier(node)) {
    const m = node.text.toLowerCase()
    if (['string', 'boolean', 'number'].includes(m)) return m
    if (m === 'object') return 'object'
    if (m === 'array') return 'array'
    return node.text
  }
  if (ts.isAsExpression(node)) {
    const typeNode = node.type
    if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName) && typeNode.typeName.text === 'PropType') {
      const arg = typeNode.typeArguments?.[0]
      if (arg) return arg.getText()
    }
    // fallback
    return getString(node)
  }
  return getString(node)
}

/**
 * 从 defineProps 的对象字面量中提取各字段配置
 */
function extractPropsFromObject(obj) {
  const rows = []
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue
    const propName = p.name.getText().replace(/['"`]/g, '')
    if (!ts.isObjectLiteralExpression(p.initializer)) {
      rows.push({ name: propName, type: p.initializer.getText(), required: '否', default: '', description: '' })
      continue
    }
    const init = p.initializer
    let type = ''
    let required = '否'
    let def = ''
    for (const kv of init.properties) {
      if (!ts.isPropertyAssignment(kv)) continue
      const key = kv.name.getText()
      if (key === 'type') type = inferTypeFromTypeProp(kv.initializer)
      else if (key === 'default') def = getString(kv.initializer)
      else if (key === 'required') required = (kv.initializer.kind === ts.SyntaxKind.TrueKeyword) ? '是' : '否'
    }
    rows.push({ name: propName, type, required, default: def, description: '' })
  }
  return rows
}

/**
 * 提取 Props 列表（仅解析运行时对象形态）
 */
function extractProps(call) {
  const arg = call.arguments[0]
  if (!arg) return []
  if (ts.isObjectLiteralExpression(arg)) return extractPropsFromObject(arg)
  // TODO: generic type support
  return []
}

/**
 * 提取 Events 列表（支持数组、类型字面量、对象配置三种形态）
 */
function extractEmits(call) {
  const arg = call.typeArguments?.[0] || call.arguments[0]
  const events = []
  if (!arg) return events
  if (ts.isArrayLiteralExpression(arg)) {
    for (const el of arg.elements) {
      if (ts.isStringLiteral(el)) events.push({ name: el.text, payload: '' })
      else events.push({ name: el.getText(), payload: '' })
    }
  } else if (ts.isTypeLiteralNode(arg)) {
    // defineEmits<{ (e:'send', payload: string): void }>()
    for (const m of arg.members) {
      if (ts.isCallSignatureDeclaration(m)) {
        const eParam = m.parameters[0]
        const name = eParam && eParam.type && ts.isLiteralTypeNode(eParam.type) && ts.isStringLiteral(eParam.type.literal)
          ? eParam.type.literal.text : ''
        
        // 提取所有后续参数作为 payload
        const payloads = []
        for (let i = 1; i < m.parameters.length; i++) {
          const p = m.parameters[i]
          // 移除可能的 import("..."). 前缀，简化显示
          let text = p.getText()
          text = text.replace(/import\("[^"]+"\)\./g, '')
          payloads.push(text)
        }
        const payload = payloads.join(', ')
        
        if (name) events.push({ name, payload })
      }
    }
  } else if (ts.isObjectLiteralExpression(arg)) {
    // defineEmits({ send: (payload: string) => true })
    for (const prop of arg.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const name = prop.name.getText().replace(/['"`]/g, '')
        events.push({ name, payload: '' })
      }
    }
  }
  return events
}

/**
 * 将 Props 行转换为 Markdown 表格
 */
function toTableProps(rows) {
  const header = '| 名称 | 类型 | 必填 | 默认值 | 说明 |\n| ---- | ---- | ---- | ------ | ---- |\n'
  const lines = rows.map(r => `| ${r.name} | \`${r.type || ''}\` | ${r.required} | \`${r.default || ''}\` | ${r.description} |`).join('\n')
  return header + lines + (lines ? '\n' : '')
}

/**
 * 将 Events 行转换为 Markdown 表格
 */
function toTableEvents(rows) {
  const header = '| 事件名 | 回调签名 |\n| ------ | -------- |\n'
  const lines = rows.map(r => `| ${r.name} | \`${r.payload ? `(${r.payload}) => void` : '(...) => void'}\` |`).join('\n')
  return header + lines + (lines ? '\n' : '')
}

/**
 * 根据文件名生成 kebab-case 的 slug
 */
function slugFromFile(file) {
  const base = basename(file, '.vue')
  return base.replace(/([A-Z])/g, (m, p1, offset) => (offset ? '-' : '') + m.toLowerCase())
}

/**
 * 生成 Props 和 Events 的 Markdown 内容（不带标题）
 */
function generateApiMd(relPath, propsRows, eventRows) {
  const src = `> Source: \`${relPath}\``
  const props = propsRows.length ? `\n### Props\n${toTableProps(propsRows)}` : '\n### Props\n无\n'
  const events = eventRows.length ? `\n### Events\n${toTableEvents(eventRows)}` : '\n### Events\n无\n'
  return `${src}\n${props}\n${events}`
}

/**
 * 查找对应的文档文件
 */
function findDocFile(root, slug) {
  const compDoc = join(root, 'docs-user', 'components', `${slug}.md`)
  if (existsSync(compDoc)) return compDoc
  const pluginDoc = join(root, 'docs-user', 'plugins', `${slug}.md`)
  if (existsSync(pluginDoc)) return pluginDoc
  return null
}

/**
 * 主流程：遍历组件目录，解析并注入到文档文件
 */
function main() {
  const root = process.cwd()
  const compDir = join(root, 'src', 'components')

  const files = collectVueFiles(compDir)
  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const script = extractScript(content)
    const sf = parseSource(script, file + '.ts')
    const propsCall = getCallExpressions(sf, 'defineProps')[0]
    const emitsCall = getCallExpressions(sf, 'defineEmits')[0]
    const propsRows = propsCall ? extractProps(propsCall) : []
    const eventRows = emitsCall ? extractEmits(emitsCall) : []
    const relPath = file.replace(root + '\\', '').replace(root + '/', '')
    const slug = slugFromFile(file)
    
    // 生成 API 内容
    const apiContent = generateApiMd(relPath, propsRows, eventRows)
    
    // 查找对应的文档文件
    const docFile = findDocFile(root, slug)
    if (docFile) {
      let docContent = readFileSync(docFile, 'utf-8')
      
      // 检查是否存在注入标记
      const startMarker = '<!-- @auto-api-start -->'
      const endMarker = '<!-- @auto-api-end -->'
      const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g')
      
      if (regex.test(docContent)) {
        // 替换现有标记内容
        docContent = docContent.replace(regex, `${startMarker}\n${apiContent}\n${endMarker}`)
        console.log('Updated (Injected):', docFile)
      } else {
        // 如果没有标记，尝试查找 "## Props" 或 "## API" 章节并替换
        // 这里做一个简单的策略：如果找不到标记，就不动，避免破坏手动文档
        // 但是为了方便第一次迁移，我们可以追加到文件末尾，或者替换掉旧的 API 链接部分
        
        // 策略：寻找 `## Props` 开头，直到下一个二级标题或文件结束，替换为 API 内容
        // 但这可能比较危险。
        // 更安全的策略：只处理带有标记的文件。用户需要先添加标记。
        // 为了自动化任务，我将在下一步先批量给文件添加标记。
        console.log('Skipped (No marker):', docFile)
        continue 
      }
      
      writeFileSync(docFile, docContent, 'utf-8')
    } else {
      console.log('Skipped (No doc file):', slug)
    }
  }
}

main()
