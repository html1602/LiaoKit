/**
 * AI 消息格式适配 Prompt 模板管理
 * 提供标准化的 Prompt 模板，支持多种业务场景
 */

// 默认的消息格式适配 Prompt 模板
export const DEFAULT_MESSAGE_ADAPTER_PROMPT = `你是一个专业的消息格式转换助手。你的任务是将各种不同格式的消息数据转换为统一的标准格式。

## 标准格式要求

请将输入的消息转换为以下JSON格式：

\`\`\`json
{
  "id": "消息唯一标识符（可选）",
  "content": "消息内容文本",
  "type": "消息类型：text/image/file/system/plugin",
  "isSelf": "是否为当前用户发送的消息（布尔值）",
  "avatar": "头像URL（可选）",
  "name": "发送者名称（可选）",
  "time": "发送时间（时间戳或日期字符串，可选）",
  "status": "消息状态：sending/sent/failed/streaming（可选）",
  "role": "角色：user/assistant/system（可选）"
}
\`\`\`

## 转换规则

1. **内容提取**：
   - 优先提取 text、content、message、msg、data 等字段作为消息内容
   - 如果内容为空，设置为 "[无内容]"

2. **类型推断**：
   - 包含图片URL或图片相关字段时设为 "image"
   - 包含文件相关信息时设为 "file"
   - 包含系统提示或通知时设为 "system"
   - 包含插件相关数据时设为 "plugin"
   - 默认为 "text"

3. **发送者判断**：
   - 如果 role 为 "user" 或包含 "self"、"me"、"own" 等标识，设 isSelf 为 true
   - 如果 role 为 "assistant"、"bot"、"ai" 等，设 isSelf 为 false
   - 根据 from、sender、author 等字段判断

4. **时间处理**：
   - 提取 time、timestamp、created_at、date 等时间字段
   - 如果没有时间信息，可以不设置该字段

5. **其他字段**：
   - 头像提取自 avatar、profile_pic、icon 等字段
   - 名称提取自 name、username、nickname、from_name 等字段

## 重要提示

- 只返回转换后的JSON格式，不要添加任何解释或其他内容
- 如果输入数据格式无法识别，返回基础的文本消息格式
- 保持输出格式的一致性和有效性
- 确保所有字符串值都正确转义

## 示例

输入：\`{"msg": "你好", "from": "user", "timestamp": 1640995200000}\`
输出：\`{"content": "你好", "type": "text", "isSelf": true, "time": 1640995200000}\`

现在请转换以下消息：`;

// 图片消息专用 Prompt 模板
export const IMAGE_MESSAGE_ADAPTER_PROMPT = `你是图片消息格式转换专家。请将输入的图片消息转换为标准格式。

标准格式：
\`\`\`json
{
  "content": "图片URL或Base64数据",
  "type": "image",
  "isSelf": "是否为用户发送",
  "alt": "图片描述（可选）",
  "width": "图片宽度（可选）",
  "height": "图片高度（可选）"
}
\`\`\`

请转换：`;

// 文件消息专用 Prompt 模板
export const FILE_MESSAGE_ADAPTER_PROMPT = `你是文件消息格式转换专家。请将输入的文件消息转换为标准格式。

标准格式：
\`\`\`json
{
  "content": "文件描述或文件名",
  "type": "file",
  "fileName": "文件名",
  "fileSize": "文件大小（字节）",
  "fileType": "文件类型/MIME类型",
  "fileUrl": "文件下载URL",
  "fileStatus": "文件状态：waiting/uploading/success/error"
}
\`\`\`

请转换：`;

// 系统消息专用 Prompt 模板
export const SYSTEM_MESSAGE_ADAPTER_PROMPT = `你是系统消息格式转换专家。请将输入的系统消息转换为标准格式。

标准格式：
\`\`\`json
{
  "content": "系统消息内容",
  "type": "system",
  "isSelf": false,
  "role": "system"
}
\`\`\`

请转换：`;

// 插件消息专用 Prompt 模板
export const PLUGIN_MESSAGE_ADAPTER_PROMPT = `你是插件消息格式转换专家。请将输入的插件消息转换为标准格式。

标准格式：
\`\`\`json
{
  "content": "插件消息描述",
  "type": "plugin",
  "pluginType": "插件类型标识",
  "pluginData": "插件数据对象",
  "pluginRequired": "是否为必需插件（布尔值）"
}
\`\`\`

请转换：`;

// Prompt 模板映射
export const PROMPT_TEMPLATES = {
  default: DEFAULT_MESSAGE_ADAPTER_PROMPT,
  image: IMAGE_MESSAGE_ADAPTER_PROMPT,
  file: FILE_MESSAGE_ADAPTER_PROMPT,
  system: SYSTEM_MESSAGE_ADAPTER_PROMPT,
  plugin: PLUGIN_MESSAGE_ADAPTER_PROMPT,
} as const;

// 根据消息类型获取合适的 Prompt 模板
export function getPromptTemplate(messageType?: string, customTemplate?: string): string {
  if (customTemplate) {
    return customTemplate;
  }
  
  if (messageType && messageType in PROMPT_TEMPLATES) {
    return PROMPT_TEMPLATES[messageType as keyof typeof PROMPT_TEMPLATES];
  }
  
  return PROMPT_TEMPLATES.default;
}

// 生成完整的 Prompt
export function generatePrompt(rawMessage: any, template?: string): string {
  const promptTemplate = template || PROMPT_TEMPLATES.default;
  const messageJson = JSON.stringify(rawMessage, null, 2);
  
  return `${promptTemplate}\n\n${messageJson}`;
}

// 业务场景专用 Prompt 模板
export const BUSINESS_TEMPLATES = {
  // 客服场景
  customerService: `你是客服消息格式转换专家。请识别客户和客服的消息，并转换为标准格式。
客户消息设置 isSelf: true，客服消息设置 isSelf: false。
特别注意识别消息中的问题类型、紧急程度等信息。`,

  // 电商场景
  ecommerce: `你是电商消息格式转换专家。请识别商品信息、订单状态、支付信息等，并转换为标准格式。
特别关注商品ID、价格、库存状态等关键信息。`,

  // 社交场景
  social: `你是社交消息格式转换专家。请识别用户动态、评论、点赞等社交行为，并转换为标准格式。
注意区分不同类型的社交互动消息。`,

  // 协作场景
  collaboration: `你是协作消息格式转换专家。请识别任务分配、项目更新、文档分享等协作信息，并转换为标准格式。
特别关注任务状态、负责人、截止时间等项目管理信息。`,
};

// 获取业务场景 Prompt
export function getBusinessPrompt(scenario: keyof typeof BUSINESS_TEMPLATES): string {
  return BUSINESS_TEMPLATES[scenario] || PROMPT_TEMPLATES.default;
} 