/**
 * @file _dev.ts —— 本地开发服务器
 * @description 本地开发时用来模拟 Vercel Serverless 环境的简易 HTTP 服务器。
 *              开发者运行这个文件后，前端的请求就能在本地跑通，不需要每次都部署到 Vercel。
 *              注意：文件名以 _ 开头，Vercel 不会把它当作线上接口部署。
 */

// dotenv：一个读取 .env 配置文件的工具库。用它把本地 .env.local 文件里的环境变量加载进来
import dotenv from 'dotenv'
// node:http：Node.js 内置的 HTTP 服务器模块，可以不依赖任何框架创建一个 Web 服务器
import http from 'node:http'
// 引入正式的接口处理逻辑（generate.ts 导出的 handler），本地开发服务器直接复用这套逻辑，
// 这样能保证本地和线上的行为完全一致，不会出现「本地能跑线上不行」的问题
import handler from './generate'

// 加载本地环境变量文件 .env.local，里面通常存着 ARK_API_KEY（豆包密钥）等敏感信息
// 这个文件不会提交到 git，避免密钥泄露
dotenv.config({ path: '.env.local' })
// 设置运行环境为开发模式（很多库会据此开启更详细的错误提示和调试日志）
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// 本地服务器监听的端口号。选 3001 是为了避免和前端 Vite 默认的 5173 端口冲突
const PORT = 3001

// 创建 HTTP 服务器。每当有请求进来，回调函数就会被调用
const server = http.createServer(async (req, res) => {
  // ---------- CORS 跨域设置 ----------
  // 前端跑在 5173 端口，后端在 3001 端口，属于跨域，必须设置这些头浏览器才允许访问
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 浏览器跨域 POST 会先发 OPTIONS 预检请求，直接返回 204（无内容）表示允许
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = req.url || ''

  // 只处理 /api/generate 开头的请求，其他路径返回 404
  if (url.startsWith('/api/generate')) {
    try {
      // Node 的 http 模块中，请求体是流式数据（stream），需要手动拼接
      // 这里用 for-await 循环收集所有数据块（chunk），再合并成完整字符串
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk as Buffer)
      }
      const body = Buffer.concat(chunks).toString('utf-8')

      // 把 Node 原生请求对象转换成 Web 标准的 Request 对象
      // 因为 generate.ts 里的 handler 用的是 Web 标准 Request/Response，
      // 必须做这层适配才能让本地服务器和线上共用同一套处理逻辑
      const request = new Request(`http://localhost:${PORT}${url}`, {
        method: req.method || 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body || '{}',
      })

      // 调用正式的 handler 处理请求，拿到 Web 标准 Response
      const response = await handler.fetch(request)
      // 把 Response 的内容读成文本
      const text = await response.text()

      // 把处理结果写回给前端，保持状态码和响应类型一致
      res.writeHead(response.status, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(text)
    } catch (err) {
      // 兜底：万一本地处理出错，返回 500 并打印错误日志方便调试
      console.error('[dev] 请求处理失败:', err)
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: '本地开发服务器错误' }))
    }
    return
  }

  // 非 /api/generate 路径一律返回 404
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not Found' }))
})

// 启动服务器，开始监听指定端口
server.listen(PORT, () => {
  console.log(`\n[dev] 本地 BFF 服务已启动: http://localhost:${PORT}`)
  console.log(`[dev] 路由: POST /api/generate`)
  console.log(`[dev] 等待 vite 代理请求...\n`)
})
