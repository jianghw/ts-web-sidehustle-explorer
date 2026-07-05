import dotenv from 'dotenv'
import http from 'node:http'
import handler from './generate'

// 加载本地环境变量（.env.local，含 ARK_API_KEY 等，不提交到 git）
dotenv.config({ path: '.env.local' })
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = req.url || ''

  if (url.startsWith('/api/generate')) {
    try {
      // 读取请求体
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk as Buffer)
      }
      const body = Buffer.concat(chunks).toString('utf-8')

      // 构造 Web Request 转交给 handler
      const request = new Request(`http://localhost:${PORT}${url}`, {
        method: req.method || 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body || '{}',
      })

      const response = await handler.fetch(request)
      const text = await response.text()

      res.writeHead(response.status, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(text)
    } catch (err) {
      console.error('[dev] 请求处理失败:', err)
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: '本地开发服务器错误' }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not Found' }))
})

server.listen(PORT, () => {
  console.log(`\n[dev] 本地 BFF 服务已启动: http://localhost:${PORT}`)
  console.log(`[dev] 路由: POST /api/generate`)
  console.log(`[dev] 等待 vite 代理请求...\n`)
})
