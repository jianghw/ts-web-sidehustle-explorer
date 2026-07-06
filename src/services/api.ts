/**
 * 文件用途：前端与后端通信的 API 函数。
 * 负责把用户填写的问卷信息发送给后端服务器，并接收后端返回的副业方案。
 * 它是前后端之间的"通信桥梁"。
 *
 * 安全说明：AI 的 API Key 只存在后端（BFF 层），前端永远不接触密钥，
 * 这样即使前端代码被查看也无法泄露密钥，保证安全性。
 */

// 引入数据类型定义，让请求和响应都有类型检查
import type { GenerateResponse, Plan, Profile } from '@/types'

/**
 * 调用 BFF（后端）接口生成副业方案
 *
 * @param profile 用户在问卷中填写的画像信息
 * @returns 生成的方案列表（Plan 数组）
 * @throws 如果请求失败或后端返回错误，会抛出 Error，由调用方（如 useGenerate）捕获处理
 */
export async function generatePlans(profile: Profile): Promise<Plan[]> {
  // AbortController 用于"取消"网络请求。
  // 这里配合 setTimeout 实现 60 秒超时机制：如果后端 60 秒还没响应，就主动取消请求，
  // 避免用户无限等待。AI 生成可能较慢，所以给了较宽裕的时间
  const ctrl = new AbortController()
  // 60_000 毫秒 = 60 秒。下划线是数字分隔符，纯粹为了可读性，等价于 60000
  const timeout = setTimeout(() => ctrl.abort(), 60_000)

  try {
    // 发送 POST 请求到后端的 /api/generate 接口
    const res = await fetch('/api/generate', {
      method: 'POST',                                    // 用 POST 因为要发送数据（GET 一般只读取）
      headers: { 'Content-Type': 'application/json' },   // 告诉后端我们发送的是 JSON 格式数据
      body: JSON.stringify({ profile }),                  // 把用户画像转成 JSON 字符串放进请求体
      signal: ctrl.signal,                               // 绑定取消信号，超时后可中断此请求
    })

    // 如果 HTTP 状态码不是 2xx（如 400、500），说明请求出错
    if (!res.ok) {
      // 尝试从响应中提取更具体的错误信息展示给用户
      const msg = await safeExtractError(res)
      throw new Error(msg)
    }

    // 请求成功，把响应体解析成 JSON
    const data: GenerateResponse = await res.json()

    // 即使 HTTP 成功，后端业务层面仍可能返回 error 字段（如 AI 生成失败）
    if (data.error) {
      throw new Error(data.error)
    }
    // 如果返回的方案列表为空或格式不对，也视为失败，提示用户重试
    if (!Array.isArray(data.plans) || data.plans.length === 0) {
      throw new Error('未生成任何方案，请重试')
    }

    // 一切正常，返回方案列表
    return data.plans
  } catch (err) {
    // 单独处理"超时取消"的情况：AbortController 触发后会抛出 AbortError，
    // 我们把它转成更友好的中文提示，而不是显示技术性的错误名
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试')
    }
    // 其他错误原样抛出，交给调用方处理
    throw err
  } finally {
    // 无论成功失败，都要清除超时定时器，避免内存泄漏
    clearTimeout(timeout)
  }
}

/**
 * 安全地提取后端返回的错误信息
 *
 * 当请求失败时，后端可能返回 JSON 格式的错误说明，也可能返回非 JSON 内容。
 * 这个函数尝试解析 JSON 取出 error 字段；如果解析失败就退回到通用的状态码提示。
 * 设计目的：给用户显示尽量具体、有意义的错误信息，而不是冷冰冰的状态码。
 *
 * @param res 失败的响应对象
 * @returns 可展示给用户的错误提示文字
 */
async function safeExtractError(res: Response): Promise<string> {
  try {
    // 尝试把响应体当作 JSON 解析，取出 error 字段
    const data = await res.json()
    // 如果有 error 字段就用它，否则用状态码兜底
    return data?.error || `请求失败（${res.status}）`
  } catch {
    // 如果响应体不是合法 JSON（比如服务器直接返回了 HTML 错误页），就用状态码兜底
    return `请求失败（${res.status}）`
  }
}
