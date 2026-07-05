# 部署方案：人生副业体验器 → Vercel（免费）

## 概述

将「人生副业体验器」部署到 Vercel Hobby Plan（免费），获取可公开访问的 `*.vercel.app` 链接，供 TRAE 创意大赛评委体验。

- **前端**：Vite + React 静态站点，Vercel 自动识别并构建
- **后端**：Vercel Serverless Functions（`api/` 目录），Web 标准 Request/Response 签名
- **费用**：Hobby Plan 完全免费，含 2GB 内存、300s 超时、足够竞赛演示用量
- **初始状态**：ARK_API_KEY 未配置 → 使用 mock 数据 fallback，评委可完整体验 UI 流程；后续配好 Key 即可切换真实 AI

## 当前状态分析

| 检查项 | 状态 | 说明 |
|--------|------|------|
| Node.js | v22.16.0 ✅ | 满足 Vercel 要求 |
| Git 仓库 | 未初始化 ❌ | 需 `git init` |
| Vercel CLI | 未安装 ❌ | 需 `npm i -g vercel` |
| TypeScript 编译 | 已通过 ✅ | Day6 已验证 |
| 生产构建 | 已通过 ✅ | `npm run build` 成功 |
| ARK_API_KEY | 空 ❌ | 部署后用 mock fallback，后续可选配置 |

## 关键问题与修复

通过阅读 Vercel 官方文档（https://vercel.com/docs/functions），发现以下需修复的问题：

### 问题 1：函数签名不符合 Vercel 官方推荐

**现状**（`api/generate.ts` 第 25 行）：
```typescript
export default async function handler(req: Request): Promise<Response> {
```

**Vercel 官方推荐**（https://vercel.com/docs/functions）：
```typescript
export default {
  fetch(request: Request) {
    return new Response('Hello from Vercel!');
  },
};
```

当前 `export default async function handler(req: Request)` 不是官方文档推荐的两种形式之一（`{ fetch }` 对象 或 命名 HTTP 方法导出），存在部署后不被识别的风险。

### 问题 2：Mock fallback 在生产环境被禁用

**现状**（`api/generate.ts` 第 97 行）：
```typescript
if (msg.includes('未配置') && process.env.NODE_ENV !== 'production') {
```

由于 ARK_API_KEY 为空，`callDoubao()` 会抛出"未配置"错误。但 `process.env.NODE_ENV !== 'production'` 条件导致生产环境下不会 fallback 到 mock 数据，API 会直接返回 500 错误。评委访问时将看到错误页面。

### 问题 3：vercel.json 缺少 maxDuration 配置

Vercel Hobby Plan 默认 300s 超时已够用，但官方建议显式设置合理上限防止失控。需添加 `functions` 配置。

### 问题 4：.gitignore 缺少 *.tsbuildinfo

项目根目录有 `tsconfig.tsbuildinfo` 和 `tsconfig.node.tsbuildinfo`，不应提交到仓库。

## 代码修改清单

### 修改 1：`api/generate.ts` — 转换函数签名 + 修复 mock fallback

**目标**：将默认导出改为 `{ fetch }` 对象形式，同时修复 mock fallback 在生产环境可用。

**改动方式**：
1. 将 `export default async function handler(req: Request): Promise<Response> {` 改为 `async function handleRequest(req: Request): Promise<Response> {`
2. 在文件末尾添加 `export default { fetch: handleRequest }`
3. 将第 97 行 `if (msg.includes('未配置') && process.env.NODE_ENV !== 'production') {` 改为 `if (msg.includes('未配置')) {`

**为什么**：
- `{ fetch }` 是 Vercel 官方推荐的 Web Standard 函数签名形式，确保部署后被正确识别
- 移除生产环境检查后，未配置 API Key 时生产环境也能返回 mock 数据，评委可完整体验 UI

### 修改 2：`api/_dev.ts` — 适配新签名

**目标**：本地开发服务器调用方式从 `handler(request)` 改为 `handler.fetch(request)`。

**改动**：第 41 行 `const response = await handler(request)` → `const response = await handler.fetch(request)`

**为什么**：`handler` 现在是 `{ fetch: handleRequest }` 对象，需通过 `.fetch()` 调用。

### 修改 3：`vercel.json` — 添加 maxDuration

**目标**：为 API 函数设置 60 秒超时上限。

**改动后完整内容**：
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/*.ts": {
      "maxDuration": 60
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

**为什么**：`api/*.ts` 匹配 `api/generate.ts`（`api/_dev.ts` 和 `api/_lib/` 以 `_` 开头，Vercel 不会当作函数处理，不受影响）。60 秒对豆包 API 调用绰绰有余（通常 5-15 秒返回）。

### 修改 4：`.gitignore` — 添加 tsbuildinfo

**改动**：在末尾添加 `*.tsbuildinfo`

## 部署步骤

### 步骤 1：构建验证

```powershell
npm run build
```

验证 `tsc --noEmit` 和 `vite build` 均通过，`dist/` 目录正常生成。

### 步骤 2：Git 初始化

```powershell
git init
git add .
git commit -m "feat: 准备 Vercel 部署 — 修复函数签名、mock fallback、vercel.json"
```

### 步骤 3：安装 Vercel CLI

```powershell
npm i -g vercel
```

### 步骤 4：登录 Vercel

```powershell
vercel login
```

选择邮箱登录，在浏览器中完成验证。如果用户已有 GitHub 账号，也可选择 GitHub 登录。

### 步骤 5：部署到生产

```powershell
vercel --prod --yes
```

首次部署时 Vercel CLI 会交互式询问：
- **Set up and deploy?** → Y
- **Which scope?** → 选择个人账号
- **Link to existing project?** → N（首次）
- **Project name?** → `side-hustle-explorer`（或自定义）
- **Directory?** → `./`
- **Auto-detected settings correct?** → Y（Vercel 会自动识别 Vite 框架）

部署完成后输出 `Production: https://side-hustle-explorer-xxx.vercel.app` 链接。

### 步骤 6：验证部署

1. 访问部署 URL，确认首页正常加载
2. 填写问卷 → 提交 → 等待结果（mock 数据会立即返回 3 个方案）
3. 点击方案卡片进入详情页，验证渠道总览、学习资源、操作指南等模块
4. 测试收藏功能（localStorage 持久化）
5. 在 Vercel Dashboard → Logs 查看 `/api/generate` 调用日志，确认 mock fallback 正常工作

## 可选：配置真实 AI（部署后）

当需要切换到真实豆包 AI 时：

```powershell
# 通过 CLI 设置环境变量
vercel env add ARK_API_KEY production
vercel env add ARK_MODEL_ID production

# 或在 Vercel Dashboard → Settings → Environment Variables 中添加
# ARK_API_KEY = <火山方舟 API Key>
# ARK_MODEL_ID = <推理接入点 Endpoint ID>

# 重新部署使环境变量生效
vercel --prod
```

获取 API Key：https://console.volcengine.com/ark

## 风险评估与回退方案

| 风险 | 概率 | 影响 | 回退方案 |
|------|------|------|----------|
| `{ fetch }` 签名不被识别 | 低 | API 404 | 回退 A：改用命名方法导出 `export function POST(req: Request)` + `export function OPTIONS(req: Request)` |
| Mock fallback 仍不生效 | 低 | 评委看到 500 错误 | 在 `callDoubao()` 中直接判断 `!apiKey` 并返回 mock，绕过错误捕获链 |
| Vercel 构建失败 | 低 | 无法部署 | 检查 `npm run build` 本地是否通过，修复 TypeScript 错误 |
| Vercel 登录失败 | 中 | 无法部署 | 改用 GitHub OAuth 登录，或在 vercel.com 网页端直接导入 GitHub 仓库 |
| 前端路由 404 | 低 | 刷新页面 404 | vercel.json 的 SPA rewrite 已覆盖，若失效则检查 rewrite 规则 |

### 回退方案 A：命名 HTTP 方法导出

如果 `{ fetch }` 对象形式不工作，改为：

```typescript
// api/generate.ts
export async function POST(req: Request): Promise<Response> {
  return handleRequest(req)
}
export async function OPTIONS(req: Request): Promise<Response> {
  return handleRequest(req)
}
// 不再需要 export default
```

同时 `api/_dev.ts` 改为直接导入 `handleRequest`（需将其改为命名导出 `export async function handleRequest`）。

## 决策记录

1. **选择 Vercel 而非其他平台**：项目已按 Vercel Serverless Functions 架构开发（api/ 目录、Web 标准签名），迁移成本为零
2. **初始部署不配 API Key**：竞赛演示优先保证可访问性，mock 数据已涵盖完整 UI 流程
3. **maxDuration 设为 60s**：豆包 API 通常 5-15s 返回，60s 留足余量且防止失控
4. **函数签名改为 `{ fetch }`**：严格遵循 Vercel 官方文档推荐形式，降低部署风险
