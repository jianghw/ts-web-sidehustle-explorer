/**
 * @file ark.ts —— 豆包 AI（火山方舟）API 调用封装
 * @description 把调用豆包大模型的具体细节封装在这里，
 *              上层只需要调用 callDoubao() 传入提示词，就能拿到 AI 生成的文字。
 *              豆包的火山方舟（Ark）平台接口兼容 OpenAI 的 SDK，所以用 openai 库就能直接调用。
 */

// openai：OpenAI 官方提供的 Node.js SDK。虽然名字叫 openai，但它兼容任何遵循 OpenAI 接口规范的服务，
// 豆包的火山方舟就是这样一个兼容服务，所以可以复用这个库，省去自己写 HTTP 请求的麻烦
import OpenAI from 'openai'

// 从环境变量读取豆包 API 密钥。密钥属于敏感信息，绝不硬编码在代码里，只能通过环境变量注入
const apiKey = process.env.ARK_API_KEY
// 火山方舟的 API 地址。默认用北京区的官方地址，也可以通过环境变量覆盖（比如用自建网关）
const baseURL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
// 模型 ID，即指定使用豆包的哪个模型（如 doubao-pro-32k 等），不同模型能力和价格不同
const modelId = process.env.ARK_MODEL_ID

// 启动时如果没有配置密钥，打印警告提醒开发者（不直接报错，是为了让无密钥时也能用 mock 数据跑起来）
if (!apiKey) {
  console.warn('[ark] ARK_API_KEY 未配置，BFF 将无法调用豆包 API')
}

// 创建 OpenAI SDK 客户端实例，后续所有 AI 调用都通过它发出
// 即使密钥不存在也传一个占位字符串 'missing'，避免 SDK 初始化报错；真正调用时会在 callDoubao 里拦截
const client = new OpenAI({
  apiKey: apiKey || 'missing',
  baseURL,
})

/**
 * 调用豆包大模型生成内容
 * @param system 系统提示词 —— 告诉 AI 它扮演什么角色、按什么格式输出
 * @param user 用户提示词 —— 包含用户的具体信息（技能、时间、预算等）
 * @returns 模型返回的文本内容（期望是 JSON 字符串，由上层负责解析）
 * @throws 如果密钥或模型 ID 未配置，抛出错误让上层走兜底逻辑
 */
export async function callDoubao(system: string, user: string): Promise<string> {
  // 密钥或模型 ID 缺失时直接报错，不发起无意义的网络请求
  if (!apiKey || !modelId) {
    throw new Error('服务端未配置 ARK_API_KEY 或 ARK_MODEL_ID，请联系管理员。')
  }

  // 调用豆包的对话补全接口（chat completions），这是大模型最常用的接口形式
  const res = await client.chat.completions.create({
    model: modelId,
    messages: [
      // system 消息定义 AI 的行为规范和输出格式
      { role: 'system', content: system },
      // user 消息是本次的具体请求内容
      { role: 'user', content: user },
    ],
    // 强制模型返回 JSON 格式，避免它输出多余的废话或 markdown 标记
    response_format: { type: 'json_object' },
    // temperature 控制输出的随机性/创造性：0 最确定、2 最发散。0.8 取中间偏创造性，让方案更多样
    temperature: 0.8,
    // 限制最大输出 token 数，防止模型啰嗦导致超时或超额计费
    max_tokens: 4096,
  })

  // 从响应中取出模型生成的文字内容
  const content = res.choices[0]?.message?.content
  // 如果模型什么都没返回（极少发生），抛出错误让上层重试或兜底
  if (!content) {
    throw new Error('模型返回内容为空。')
  }
  return content
}
