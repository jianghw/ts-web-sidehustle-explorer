import OpenAI from 'openai'

const apiKey = process.env.ARK_API_KEY
const baseURL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const modelId = process.env.ARK_MODEL_ID

if (!apiKey) {
  console.warn('[ark] ARK_API_KEY 未配置，BFF 将无法调用豆包 API')
}

const client = new OpenAI({
  apiKey: apiKey || 'missing',
  baseURL,
})

/**
 * 调用豆包大模型（火山方舟 Ark，兼容 OpenAI SDK）
 * @param system system prompt
 * @param user user prompt
 * @returns 模型返回的文本内容（期望为 JSON 字符串）
 */
export async function callDoubao(system: string, user: string): Promise<string> {
  if (!apiKey || !modelId) {
    throw new Error('服务端未配置 ARK_API_KEY 或 ARK_MODEL_ID，请联系管理员。')
  }

  const res = await client.chat.completions.create({
    model: modelId,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 4096,
  })

  const content = res.choices[0]?.message?.content
  if (!content) {
    throw new Error('模型返回内容为空。')
  }
  return content
}
