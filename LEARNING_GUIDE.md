# 人生副业体验器 · 代码学习指南

> 本文档以「人生副业体验器」项目为教材，带你从零开始，沿着代码执行路径一步步追踪，在实践中掌握 React + TypeScript + Vite + Vercel Serverless 的全栈开发知识。
>
> **适合人群**：完全不懂 JavaScript 的初学者，或有一定基础想系统学习现代前端工程化的人。
>
> **学习方式**：按章节顺序阅读，每读完一个章节就打开对应的源代码文件对照理解。

---

## 目录

- [第一站：项目骨架与构建工具](#第一站项目骨架与构建工具)
- [第二站：应用入口与路由系统](#第二站应用入口与路由系统)
- [第三站：类型系统 —— TypeScript 类型定义](#第三站类型系统--typescript-类型定义)
- [第四站：状态管理 —— Zustand Store](#第四站状态管理--zustand-store)
- [第五站：自定义 Hooks —— 逻辑复用的艺术](#第五站自定义-hooks--逻辑复用的艺术)
- [第六站：API 调用 —— 前后端通信](#第六站api-调用--前后端通信)
- [第七站：Serverless 后端 —— Vercel Functions](#第七站serverless-后端--vercel-functions)
- [第八站：AI 集成 —— 豆包大模型调用](#第八站ai-集成--豆包大模型调用)
- [第九站：页面组件 —— 用户交互的入口](#第九站页面组件--用户交互的入口)
- [第十站：业务组件 —— 从问卷到结果](#第十站业务组件--从问卷到结果)
- [第十一站：详情页与学习资源](#第十一站详情页与学习资源)
- [第十二站：通用组件与错误处理](#第十二站通用组件与错误处理)
- [知识点速查表](#知识点速查表)

---

## 第一站：项目骨架与构建工具

### 1.1 `package.json` —— 项目的"身份证"

**文件**：`package.json`

每个 Node.js 项目都从 `package.json` 开始。它回答三个问题：这个项目叫什么？依赖什么？能运行什么命令？

```json
{
  "name": "side-hustle-explorer",  // 项目名
  "type": "module",                 // 使用 ES Module（import/export）而非 CommonJS（require）
  "scripts": {
    "dev": "vite",                  // 启动前端开发服务器（热更新）
    "dev:api": "tsx watch api/_dev.ts",  // 启动后端本地服务器（文件变化自动重启）
    "build": "tsc --noEmit && vite build",  // 先类型检查，再打包
    "dev:all": "concurrently -k -n web,api -c blue,green \"npm run dev\" \"npm run dev:api\""
    // concurrently 同时跑两条命令，-k 表示一条挂了全停，-n 给标签名，-c 给颜色
  }
}
```

**学习知识点**：
- `scripts` 里的命令可以用 `npm run 命令名` 执行
- `"type": "module"` 决定了项目用 `import` 还是 `require`
- `^` 前缀（如 `"^18.3.1"`）表示"至少这个版本，次版本可以更高"

### 1.2 `vite.config.ts` —— 构建工具配置

**文件**：`vite.config.ts`

Vite 是现代前端构建工具，负责把 TypeScript 编译成浏览器能运行的 JavaScript，并提供开发服务器。

```typescript
import { defineConfig } from 'vite'          // defineConfig 提供类型提示
import react from '@vitejs/plugin-react'      // 让 Vite 能理解 JSX 语法
import path from 'node:path'                  // Node.js 内置模块，处理文件路径

export default defineConfig({
  plugins: [react()],          // 启用 React 支持（JSX 转换）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 路径别名：@ 指向 src 目录
    },
  },
  server: {
    port: 5173,                // 前端开发服务器端口
    proxy: {
      '/api': {                // 以 /api 开头的请求转发到后端
        target: 'http://localhost:3001',  // 后端本地服务器地址
        changeOrigin: true,
      },
    },
  },
})
```

**学习知识点**：
- **路径别名**：`@/components/xxx` 等价于 `src/components/xxx`，避免 `../../../` 的相对路径地狱
- **开发代理**：前端 5173 端口把 `/api` 请求转发到后端 3001 端口，解决跨域问题
- **`__dirname`**：Node.js 全局变量，表示当前文件所在目录

### 1.3 `tsconfig.json` —— TypeScript 编译规则

**文件**：`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",          // 编译目标：ES2022 标准的 JavaScript
    "jsx": "react-jsx",          // JSX 转换模式：React 17+ 自动导入
    "strict": true,              // 开启所有严格类型检查（强烈推荐）
    "noEmit": true,              // 只做类型检查，不输出文件（由 Vite 负责编译）
    "paths": {
      "@/*": ["src/*"]           // 与 vite.config.ts 的 alias 对齐
    }
  },
  "include": ["src", "api", "vite.config.ts"]  // 哪些文件参与类型检查
}
```

**学习知识点**：
- `strict: true` 会让 TypeScript 编译器更严格，捕获更多潜在错误
- `noEmit: true` 意味着 TypeScript 只负责"检查"，实际编译由 Vite 用 esbuild 完成（更快）

### 1.4 `tailwind.config.js` —— CSS 框架配置

**文件**：`tailwind.config.js`

```javascript
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],  // 扫描这些文件，提取用到的 CSS 类
  theme: {
    extend: {
      colors: {
        brand: {  // 自定义品牌色（紫色系），从 50 到 900 共 10 个色阶
          50: '#f3f0ff',  // 最浅，用于背景
          500: '#7c4dff', // 主色，用于按钮
          900: '#3d2580', // 最深，用于深色文字
        },
      },
    },
  },
}
```

**学习知识点**：
- TailwindCSS 是"原子化 CSS"，用 `bg-brand-500`、`text-white` 等类名组合样式
- `extend` 是"追加"自定义配置，不写 `extend` 则是"覆盖"默认值
- `content` 告诉 Tailwind 扫描哪些文件，只打包用到的 CSS 类（减小体积）

---

## 第二站：应用入口与路由系统

### 2.1 `index.html` —— 真正的第一个页面

**文件**：`index.html`

浏览器加载的最初文件。它只有一个 `<div id="root">`，React 会把整个应用挂载到这个 div 里。

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

### 2.2 `src/main.tsx` —— React 应用启动入口

**文件**：`src/main.tsx`

这是 JavaScript 代码的**第一个执行点**。跟踪路径：`index.html` → `main.tsx` → `App.tsx`。

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'   // React 18 的新 API
import { BrowserRouter } from 'react-router-dom'  // 路由容器
import App from './App'                    // 根组件
import './styles/index.css'                // 全局样式（TailwindCSS）

// createRoot 是 React 18 的挂载方式，替代了旧版的 ReactDOM.render
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>          {/* StrictMode 在开发模式下会额外检查潜在问题 */}
    <BrowserRouter>           {/* BrowserRouter 让应用支持 URL 路由 */}
      <App />                 {/* 渲染根组件 */}
    </BrowserRouter>
  </React.StrictMode>,
)
```

**学习知识点**：
- **`!` 非空断言**：`getElementById` 返回 `HTMLElement | null`，`!` 告诉 TypeScript"我确定它不为 null"
- **JSX 语法**：`<App />` 看起来像 HTML，实际是 JavaScript 语法扩展，编译后变成 `React.createElement(App)`
- **组件嵌套**：`StrictMode > BrowserRouter > App`，外层组件包裹内层，提供上下文环境

### 2.3 `src/App.tsx` —— 根组件与路由表

**文件**：`src/App.tsx`

```typescript
import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RetryBoundary } from '@/components/common/RetryBoundary'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <RetryBoundary>       {/* 错误边界：子组件崩溃时显示兜底 UI */}
          <Routes>            {/* 路由表：URL 路径 → 组件的映射 */}
            <Route path="/" element={<QuestionnairePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="*" element={<QuestionnairePage />} />  {/* 兜底 */}
          </Routes>
        </RetryBoundary>
      </main>
      <Footer />
    </div>
  )
}
```

**学习知识点**：
- **`export default`**：默认导出，一个文件只能有一个，导入时可以随意命名
- **`export function`**：命名导出，导入时必须用花括号 `{ Header }`
- **`:id` 路径参数**：`/detail/p1` 中的 `p1` 会被提取为 `id` 参数
- **`path="*"`**：通配符路由，匹配所有未定义的路径（404 兜底）
- **`flex-1`**：TailwindCSS 类，让 main 区域自动撑满剩余空间，Footer 始终在底部

---

## 第三站：类型系统 —— TypeScript 类型定义

### 3.1 `src/types/index.ts` —— 前端数据模型

**文件**：`src/types/index.ts`

TypeScript 的核心价值：用类型定义描述数据的"形状"，在编译前捕获错误。

```typescript
// 用户画像 —— 用户在问卷页填写的数据
export interface Profile {
  skills: string[]                                    // 技能列表，如 ['coding', 'writing']
  availableHours: number                              // 每天可投入时间
  incomeGoal: number                                  // 期望月收入
  riskTolerance: 'low' | 'medium' | 'high'           // 联合类型：只能是这三个值之一
  budget: number                                      // 启动资金
}

// 副业方案 —— AI 生成的完整方案
export interface Plan {
  id: string                                          // 唯一标识
  title: string                                       // 方案名称
  matchScore: number                                  // 匹配度 0-100
  difficulty: '低' | '中' | '高'                     // 中文联合类型也可以
  channels: Channel[]                                 // 赚钱渠道数组
  learningResources?: LearningResource[]              // ? 表示可选属性
  tags: string[]
}

// API 响应 —— 后端返回给前端的数据结构
export interface GenerateResponse {
  plans: Plan[]                                       // 方案数组
  error?: string                                      // 可选的错误信息
}
```

**学习知识点**：
- **`interface`**：定义对象的结构，是 TypeScript 最常用的类型工具
- **联合类型 `|`**：`'low' | 'medium' | 'high'` 表示值只能是这三个字符串之一
- **可选属性 `?`**：`learningResources?` 表示这个字段可能存在也可能不存在
- **数组类型 `[]`**：`string[]` 表示字符串数组，等价于 `Array<string>`
- **`interface` vs `type`**：`interface` 用于对象结构，`type` 更灵活（可以定义联合类型、交叉类型等）

---

## 第四站：状态管理 —— Zustand Store

### 4.1 为什么需要状态管理？

React 组件之间共享数据有两种方式：
1. **props 传递**：父组件传给子组件（适合相邻 1-2 层）
2. **全局 Store**：所有组件都能直接读取（适合跨多层共享）

本项目用 **Zustand** 管理全局状态，它比 Redux 更简洁。

### 4.2 `src/store/appStore.ts` —— 应用状态

**文件**：`src/store/appStore.ts`

```typescript
import { create } from 'zustand'       // Zustand 的核心 API
import type { Profile, Plan } from '@/types'

// 定义状态仓库的"形状"：包含数据 + 操作数据的方法
interface AppState {
  // —— 数据 ——
  profile: Profile | null    // 用户画像（未填写时为 null）
  plans: Plan[]              // AI 生成的方案列表
  loading: boolean           // 是否正在加载
  error: string | null       // 错误信息

  // —— 操作方法 ——
  setProfile: (p: Profile | null) => void
  setPlans: (p: Plan[]) => void
  reset: () => void
}

// create() 创建一个全局 Store，所有组件共享同一个实例
export const useAppStore = create<AppState>((set) => ({
  // 初始值
  profile: null,
  plans: [],
  loading: false,
  error: null,

  // set() 是 Zustand 提供的更新方法，类似 React 的 setState
  setProfile: (profile) => set({ profile }),      // 简写：set({ profile: profile })
  setPlans: (plans) => set({ plans }),

  // reset 同时恢复多个字段
  reset: () => set({ profile: null, plans: [], loading: false, error: null }),
}))
```

**学习知识点**：
- **`create<T>((set) => ({...}))`**：Zustand 的固定写法，`T` 是类型参数，`set` 是更新函数
- **对象简写**：`set({ profile })` 等价于 `set({ profile: profile })`，ES6 语法糖
- **`null` vs `undefined`**：`null` 表示"明确为空"，`undefined` 表示"未定义"

### 4.3 `src/store/favoriteStore.ts` —— 收藏状态（带持久化）

**文件**：`src/store/favoriteStore.ts`

这个 Store 比 appStore 多了一个 `persist` 中间件 —— 数据会自动保存到浏览器 localStorage，刷新页面不丢失。

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'  // 持久化中间件

export const useFavoriteStore = create<FavoriteState>()(
  // persist 包裹整个 Store，自动同步到 localStorage
  persist(
    (set, get) => ({
      favorites: {},  // 用对象存储而非数组，查找/删除更快（O(1) vs O(n)）

      toggleFavorite: (plan) =>
        set((state) => {
          const next = { ...state.favorites }  // 浅拷贝，不可变更新
          if (next[plan.id]) {
            delete next[plan.id]  // 已收藏 → 取消收藏
          } else {
            next[plan.id] = plan  // 未收藏 → 添加收藏
          }
          return { favorites: next }
        }),

      isFavorite: (id) => Boolean(get().favorites[id]),  // get() 读取当前状态
    }),
    { name: 'side-hustle-favorites' },  // localStorage 的 key
  ),
)
```

**学习知识点**：
- **中间件模式**：`persist` 包裹 Store，在不修改业务逻辑的情况下添加持久化能力
- **不可变更新**：`{ ...state.favorites }` 先浅拷贝再修改，React 才能检测到变化
- **`get()`**：Zustand 提供的读取当前状态的方法，用于在方法内部访问数据
- **为什么用对象而非数组**：`favorites[id]` 是 O(1) 查找，`array.find()` 是 O(n)

---

## 第五站：自定义 Hooks —— 逻辑复用的艺术

### 5.1 什么是 Hook？

Hook 是 React 提供的特殊函数，以 `use` 开头（如 `useState`、`useEffect`）。自定义 Hook 让你把组件中的可复用逻辑提取出来。

### 5.2 `src/hooks/useGenerate.ts` —— 生成方案的核心逻辑

**文件**：`src/hooks/useGenerate.ts`

```typescript
import { useCallback } from 'react'           // useCallback 缓存函数引用
import { useAppStore } from '@/store/appStore'
import { generatePlans } from '@/services/api'

export function useGenerate() {
  // 从 Store 订阅数据：每个 useAppStore 调用只订阅需要的字段
  // 这样只有该字段变化时才触发组件重渲染
  const plans = useAppStore((s) => s.plans)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  const setPlans = useAppStore((s) => s.setPlans)
  const setLoading = useAppStore((s) => s.setLoading)
  const setError = useAppStore((s) => s.setError)

  // useCallback 缓存函数，避免每次渲染都创建新函数（依赖项不变时引用稳定）
  const generate = useCallback(
    async (profile: Profile) => {
      setLoading(true)      // 1. 设置加载状态
      setError(null)        // 2. 清空之前的错误

      try {
        const result = await generatePlans(profile)  // 3. 调用 API
        setPlans(result)    // 4. 保存结果到 Store
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : '生成失败'
        setError(msg)       // 5. 捕获错误
        return []
      } finally {
        setLoading(false)   // 6. 无论成功失败，都关闭加载状态
      }
    },
    [setPlans, setLoading, setError],  // 依赖数组：这些函数变化时才重新创建 generate
  )

  return { plans, loading, error, generate }
}
```

**学习知识点**：
- **`async/await`**：异步编程语法。`await` 暂停函数执行直到 Promise 完成，让异步代码看起来像同步
- **`try/catch/finally`**：错误处理三件套。`try` 尝试执行，`catch` 捕获异常，`finally` 无论如何都执行
- **`useCallback`**：缓存函数引用。不传 `useCallback` 的话每次渲染都会创建新函数，可能导致子组件不必要地重渲染
- **`err instanceof Error`**：检查错误对象类型，安全地访问 `.message` 属性
- **选择器模式**：`useAppStore((s) => s.plans)` 只订阅 `plans` 字段，其他字段变化不会触发重渲染

### 5.3 `src/hooks/useLocalStorage.ts` —— 封装 localStorage

**文件**：`src/hooks/useLocalStorage.ts`

```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  // useState 的"懒初始化"：传入函数，只在首次渲染时执行
  // 避免每次渲染都读取 localStorage（性能优化）
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue  // 有缓存就解析，没有就用默认值
    } catch {
      return initialValue  // localStorage 不可用时（如隐私模式）静默降级
    }
  })

  // useEffect：value 变化时自动同步到 localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 忽略写入失败（隐私模式或配额已满）
    }
  }, [key, value])  // 依赖数组：key 或 value 变化时重新执行

  return [value, setValue, reset] as const  // as const 让返回类型更精确
}
```

**学习知识点**：
- **泛型 `<T>`**：函数的类型参数。调用时 `useLocalStorage<Profile>(...)`，T 就被确定为 `Profile`
- **懒初始化**：`useState(() => {...})` 传入函数，React 只在首次渲染时调用它
- **`useEffect`**：副作用 Hook。组件渲染后执行，用于同步外部状态（localStorage、网络请求等）
- **依赖数组 `[key, value]`**：只有这些值变化时才重新执行 effect。空数组 `[]` 表示只在首次渲染执行
- **`as const`**：让 TypeScript 推断为元组类型 `[T, Dispatch<...>, () => void]` 而非普通数组

---

## 第六站：API 调用 —— 前后端通信

### 6.1 `src/services/api.ts` —— 前端 API 请求层

**文件**：`src/services/api.ts`

```typescript
export async function generatePlans(profile: Profile): Promise<Plan[]> {
  // AbortController 可以主动取消 fetch 请求
  // 这里用于实现 60 秒超时自动取消
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 60_000)  // 60秒后触发 abort

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),  // 将 JS 对象序列化为 JSON 字符串
      signal: ctrl.signal,                // 绑定取消信号
    })

    if (!res.ok) {  // HTTP 状态码非 2xx
      const msg = await safeExtractError(res)
      throw new Error(msg)
    }

    const data: GenerateResponse = await res.json()  // 解析 JSON 响应

    // 业务层校验：即使 HTTP 200，也可能有逻辑错误
    if (data.error) throw new Error(data.error)
    if (!Array.isArray(data.plans) || data.plans.length === 0) {
      throw new Error('未生成任何方案，请重试')
    }

    return data.plans
  } catch (err) {
    // 区分超时错误和其他错误，给用户更清晰的提示
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试')
    }
    throw err  // 其他错误继续向上抛
  } finally {
    clearTimeout(timeout)  // 清理定时器，避免内存泄漏
  }
}
```

**学习知识点**：
- **`fetch` API**：浏览器内置的网络请求函数。返回 Promise，需要 `await`
- **`AbortController`**：取消异步操作的 Web API。`ctrl.abort()` 会触发 `fetch` 抛出 `AbortError`
- **`JSON.stringify` / `JSON.parse`**：JSON 序列化与反序列化。对象 → 字符串 → 网络 → 字符串 → 对象
- **`res.ok`**：HTTP 状态码 200-299 为 true，其他为 false
- **多层错误处理**：HTTP 错误（!res.ok）→ 业务错误（data.error）→ 数据校验（空数组）→ 超时错误
- **`60_000`**：数字分隔符，等价于 `60000`，提高可读性

---

## 第七站：Serverless 后端 —— Vercel Functions

### 7.1 `api/generate.ts` —— 后端主接口

**文件**：`api/generate.ts`

当用户点击"生成方案"时，前端发送 POST 请求到 `/api/generate`，Vercel 自动调用这个函数。

```typescript
// 限流模块：防止恶意用户刷接口
const RATE_LIMIT_WINDOW_MS = 60_000  // 60秒窗口
const RATE_LIMIT_MAX = 10            // 最多10次
const hits = new Map<string, number[]>()  // 记录每个 IP 的请求时间戳

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  // 过滤掉窗口外的旧记录
  const arr = (hits.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (arr.length >= RATE_LIMIT_MAX) {
    hits.set(key, arr)
    return false  // 超过限制，拒绝
  }
  arr.push(now)   // 记录本次请求时间
  hits.set(key, arr)
  return true
}

// 主处理函数：接收 Web 标准 Request，返回 Web 标准 Response
async function handleRequest(req: Request): Promise<Response> {
  // 1. CORS 预检（浏览器跨域检查）
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // 2. 只接受 POST 请求
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 })
  }

  // 3. 限流检查
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  if (!checkRateLimit(ip)) {
    return Response.json({ error: '请求过于频繁' }, { status: 429 })
  }

  try {
    // 4. 解析请求体
    const body = await req.json()
    const profile = body?.profile

    // 5. 参数校验
    if (!profile?.skills || !Array.isArray(profile.skills)) {
      return Response.json({ error: '参数无效' }, { status: 400 })
    }

    // 6. 构建 Prompt 并调用 AI
    const system = buildSystemPrompt()
    const user = buildUserPrompt(profile)
    let raw: string
    try {
      raw = await callDoubao(system, user)        // 第一次尝试
    } catch (firstErr) {
      console.warn('首次调用失败，重试中...')
      raw = await callDoubao(system, user)        // 失败则重试一次
    }

    // 7. 解析 AI 返回的 JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)                    // 直接解析
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)      // 容错：从文本中提取 JSON
      if (match) parsed = JSON.parse(match[0])
      else throw new Error('无法解析为 JSON')
    }

    // 8. 运行时校验 + 容错
    const plans = validatePlans(parsed)

    // 9. 返回成功响应
    return Response.json({ plans })
  } catch (err) {
    // 10. 错误兜底：API Key 未配置时返回 mock 数据
    const msg = err instanceof Error ? err.message : '未知错误'
    if (msg.includes('未配置')) {
      const { getMockPlans } = await import('./_lib/mock')  // 动态导入（按需加载）
      return Response.json({ plans: getMockPlans() })
    }
    return Response.json({ error: `生成失败：${msg}` }, { status: 500 })
  }
}

// Vercel 官方推荐导出格式
export default { fetch: handleRequest }
```

**学习知识点**：
- **Web 标准 API**：`Request`、`Response`、`headers`、`json()` 都是浏览器和 Node.js 都支持的标准接口
- **`Map` 数据结构**：比普通对象更适合做映射，键可以是任意类型，有 `get/set/has/delete` 方法
- **CORS**：跨域资源共享。`OPTIONS` 请求是浏览器自动发送的"预检"，询问服务器是否允许跨域
- **可选链 `?.`**：`req.headers.get('x-forwarded-for')?.split(',')` —— 如果 header 不存在，返回 `undefined` 而非报错
- **空值合并 `||`**：`value || 'unknown'` —— 如果 `value` 是 falsy（null/undefined/''），使用默认值
- **正则匹配 `/\{[\s\S]*\}/`**：`[\s\S]` 匹配所有字符（含换行），`*` 表示匹配 0 次或多次
- **动态导入 `await import()`**：运行时按需加载模块，减小初始包体积
- **HTTP 状态码**：200 成功、400 参数错误、405 方法不允许、429 限流、500 服务器错误

### 7.2 `api/_dev.ts` —— 本地开发服务器

**文件**：`api/_dev.ts`

Vercel Functions 只能在 Vercel 上运行。本地开发时需要一个模拟服务器，把 Node.js 原生 `http` 请求转成 Web 标准 `Request` 再交给 handler。

```typescript
import http from 'node:http'       // Node.js 内置 HTTP 模块
import handler from './generate'   // 导入 Vercel Function

const server = http.createServer(async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.url?.startsWith('/api/generate')) {
    // 读取请求体：Node.js 的 req 是流（Stream），需要手动拼接
    const chunks: Buffer[] = []
    for await (const chunk of req) {     // for await 异步迭代流
      chunks.push(chunk as Buffer)
    }
    const body = Buffer.concat(chunks).toString('utf-8')

    // 构造 Web 标准 Request 转交给 handler
    const request = new Request(`http://localhost:${PORT}${req.url}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: body || '{}',
    })

    // 调用 handler.fetch() —— Vercel { fetch } 对象的方法
    const response = await handler.fetch(request)
    const text = await response.text()

    res.writeHead(response.status, { 'Content-Type': 'application/json' })
    res.end(text)
  }
})

server.listen(PORT)  // 启动服务器，监听端口
```

**学习知识点**：
- **`http.createServer`**：Node.js 创建 HTTP 服务器的原生方法
- **Stream 流**：Node.js 中数据以流的形式传递，需要手动收集拼接
- **`for await...of`**：异步迭代语法，用于逐块读取流数据
- **`Buffer`**：Node.js 处理二进制数据的类。`Buffer.concat()` 合并多个 Buffer

---

## 第八站：AI 集成 —— 豆包大模型调用

### 8.1 `api/_lib/ark.ts` —— 豆包 API 封装

**文件**：`api/_lib/ark.ts`

```typescript
import OpenAI from 'openai'  // OpenAI 官方 SDK，兼容所有 OpenAI 接口格式的 API

// 从环境变量读取配置（服务端环境变量，不暴露给前端）
const apiKey = process.env.ARK_API_KEY
const baseURL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const modelId = process.env.ARK_MODEL_ID

// 创建 SDK 客户端实例
const client = new OpenAI({
  apiKey: apiKey || 'missing',  // 没有配置时传 'missing'，让 SDK 报错而非崩溃
  baseURL,                       // 指向火山方舟（豆包）的 API 地址
})

export async function callDoubao(system: string, user: string): Promise<string> {
  if (!apiKey || !modelId) {
    throw new Error('服务端未配置 ARK_API_KEY 或 ARK_MODEL_ID')
  }

  // 调用大模型的对话补全接口
  const res = await client.chat.completions.create({
    model: modelId,                    // 模型 ID（推理接入点）
    messages: [                        // 对话消息列表
      { role: 'system', content: system },  // 系统提示词：定义 AI 角色
      { role: 'user', content: user },      // 用户消息：具体请求
    ],
    response_format: { type: 'json_object' }, // 强制返回 JSON 格式
    temperature: 0.8,                  // 创造性程度：0=最确定，2=最随机，0.8 适中
    max_tokens: 4096,                  // 最大输出 token 数
  })

  const content = res.choices[0]?.message?.content
  if (!content) throw new Error('模型返回内容为空')
  return content
}
```

**学习知识点**：
- **`process.env`**：Node.js 全局对象，读取系统环境变量。Vercel 会在部署时注入
- **OpenAI SDK 兼容**：很多 AI 平台（豆包、Moonshot、DeepSeek）都兼容 OpenAI 接口格式，可以直接用 OpenAI SDK
- **`messages` 数组**：对话历史。`system` 设定 AI 行为，`user` 是用户输入，`assistant` 是 AI 回复
- **`temperature`**：控制随机性。低温度适合事实性任务，高温度适合创意任务
- **`response_format: json_object`**：强制模型输出合法 JSON，而非自由文本

### 8.2 `api/_lib/prompt.ts` —— 提示词工程

**文件**：`api/_lib/prompt.ts`

```typescript
export function buildSystemPrompt(): string {
  return `你是一位资深副业规划师...
  输出必须是合法 JSON，结构如下：
  {
    "plans": [
      {
        "id": "p1",
        "title": "副业方向名称",
        "matchScore": 85,
        ...
      }
    ]
  }
  要求：
  1. 必须返回恰好 3 个方案...
  2. matchScore 为 0-100 的整数...
  5. 只返回 JSON，不要任何多余解释`
}

export function buildUserPrompt(profile: Profile): string {
  const riskMap: Record<string, string> = {
    low: '稳健型（低风险、回本快）',
    medium: '平衡型（适度投入）',
    high: '进取型（可接受前期投入）',
  }
  return `请根据以下用户画像生成 3 个方案：
  - 技能特长：${profile.skills.join('、')}
  - 每日可投入时间：${profile.availableHours} 小时
  - 期望月收入：${profile.incomeGoal} 元
  - 风险偏好：${riskMap[profile.riskTolerance]}`
}
```

**学习知识点**：
- **模板字符串**：反引号包裹的字符串，支持 `${变量}` 插值和多行文本
- **`.join('、')`**：数组方法，用指定分隔符拼接成字符串。`['a','b'].join('、')` → `'a、b'`
- **提示词工程**：通过精确的指令控制 AI 的输出格式和内容质量

### 8.3 `api/_lib/schemas.ts` —— 运行时数据校验

**文件**：`api/_lib/schemas.ts`

AI 返回的内容不可完全信任，需要逐字段校验和容错。

```typescript
export function validatePlans(data: unknown): Plan[] {
  // 1. 顶层校验
  if (!data || typeof data !== 'object') {
    throw new Error('数据格式异常：非对象')
  }

  // 2. 提取 plans 数组（容错：有些模型直接返回数组）
  let plans = (data as Record<string, unknown>).plans
  if (!Array.isArray(plans)) {
    if (Array.isArray(data)) plans = data
    else throw new Error('缺少 plans 数组')
  }

  // 3. 逐个方案校验和容错
  return (plans as unknown[]).map((raw, idx) => {
    const p = (raw || {}) as Record<string, unknown>
    return {
      id: typeof p.id === 'string' ? p.id : `p${idx + 1}`,        // 类型检查 + 默认值
      title: typeof p.title === 'string' ? p.title : `方案 ${idx + 1}`,
      matchScore: clampScore(p.matchScore),                        // 数值范围限制
      difficulty: normalizeDifficulty(p.difficulty),               // 枚举值标准化
      pros: toStringArray(p.pros),                                 // 数组容错
      channels: toChannelArray(p.channels),
      // ...每个字段都有容错处理
    }
  })
}

// 限制分数在 0-100 之间
function clampScore(v: unknown): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseInt(v, 10) : 75
  if (Number.isNaN(n)) return 75          // 解析失败给默认值
  return Math.max(0, Math.min(100, n))    // 限制范围
}
```

**学习知识点**：
- **`unknown` 类型**：TypeScript 的安全类型。不同于 `any`，`unknown` 必须先做类型检查才能操作
- **`typeof` 运算符**：运行时检查变量类型。返回 `'string'`、`'number'`、`'object'` 等
- **`Array.isArray()`**：判断变量是否为数组（`typeof []` 返回 `'object'`，所以需要专门方法）
- **`parseInt(str, 10)`**：字符串转整数。第二个参数 `10` 表示十进制
- **`Math.max/min`**：取最大/最小值。`Math.max(0, Math.min(100, n))` 是经典的数值范围限制写法
- **防御性编程**：不信任外部输入，每个字段都有类型检查和默认值

---

## 第九站：页面组件 —— 用户交互的入口

### 9.1 `src/pages/QuestionnairePage.tsx` —— 问卷页

**文件**：`src/pages/QuestionnairePage.tsx`

用户第一步填写的页面。跟踪路径：用户填写 → localStorage 草稿 → 点击提交 → 存入 appStore → 跳转结果页。

```typescript
export function QuestionnairePage() {
  // useLocalStorage：问卷草稿自动保存，刷新不丢失
  const [draft, setDraft, resetDraft] = useLocalStorage<Profile>('side-hustle-profile', DEFAULT_PROFILE)
  const setProfile = useAppStore((s) => s.setProfile)  // 全局 Store
  const navigate = useNavigate()                        // 路由跳转

  // useMemo 缓存计算结果：只有 draft.skills 变化时才重新计算
  const canSubmit = useMemo(() => draft.skills.length > 0, [draft.skills])

  // 泛型函数：<K extends keyof Profile> 约束 K 必须是 Profile 的某个键
  const update = <K extends keyof Profile>(key: K, val: Profile[K]) => {
    setDraft({ ...draft, [key]: val })  // 展开运算符 + 计算属性名
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    setProfile(draft)      // 草稿存入全局 Store
    navigate('/results')   // 路由跳转到结果页
  }

  return (
    <div>
      {QUESTIONS.map((q, idx) => (  // 遍历题目配置渲染问卷
        <section key={q.id}>
          {/* 根据 q.type 渲染不同的输入组件 */}
          {q.type === 'multi-select' && <SkillSelect ... />}
          {q.type === 'slider' && <SliderGroup ... />}
          {q.type === 'radio-card' && <RadioCard ... />}
        </section>
      ))}

      <button onClick={handleSubmit} disabled={!canSubmit}>
        生成我的副业方案
      </button>
    </div>
  )
}
```

**学习知识点**：
- **`useMemo`**：缓存计算结果。依赖数组不变时返回缓存值，避免重复计算
- **`<K extends keyof Profile>`**：泛型约束。K 必须是 Profile 的键之一（'skills' | 'availableHours' | ...）
- **`[key]: val`**：计算属性名。`key` 是变量时用方括号包裹
- **`{...draft, [key]: val}`**：展开运算符更新对象 —— 先复制所有字段，再覆盖指定字段
- **`map()` 渲染列表**：React 中渲染列表的标准方式，每个元素需要唯一的 `key` 属性
- **条件渲染**：`{condition && <Component />}` —— 条件为 true 时渲染组件

### 9.2 `src/pages/ResultsPage.tsx` —— 结果页

**文件**：`src/pages/ResultsPage.tsx`

```typescript
export function ResultsPage() {
  const profile = useAppStore((s) => s.profile)
  const { generate, loading, error } = useGenerate()  // 自定义 Hook

  // useEffect：组件挂载后自动触发生成
  useEffect(() => {
    if (!profile) {
      navigate('/', { replace: true })  // 没有画像数据 → 重定向到问卷页
      return
    }
    if (plans.length === 0 && !loading && !error) {
      void generate(profile)  // 自动生成方案（void 忽略 Promise 返回值）
    }
  }, [profile])  // 只在 profile 变化时执行

  // 条件渲染链：根据状态显示不同 UI
  if (loading && plans.length === 0) return <LoadingScreen />       // 首次加载
  if (loading && plans.length > 0) return <SkeletonGrid />          // 刷新中
  if (error && plans.length === 0) return <ErrorState />            // 错误
  if (plans.length === 0) return <EmptyState />                     // 空态

  // 成功：渲染方案卡片列表
  return (
    <div>
      {plans.map((plan, idx) => (
        <PlanCard key={plan.id} plan={plan} index={idx} />
      ))}
      <ChannelsOverview plans={plans} />
    </div>
  )
}
```

**学习知识点**：
- **`useEffect` 依赖数组**：`[profile]` 表示只在 `profile` 变化时重新执行。如果传 `[]` 则只在挂载时执行一次
- **`navigate('/', { replace: true })`**：`replace` 替换历史记录，用户按返回键不会回到结果页
- **`void`**：显式忽略 Promise 返回值，避免未处理的 Promise 警告
- **条件渲染链**：多个 `if return` 按优先级处理不同状态，最后的 `return` 是正常状态

---

## 第十站：业务组件 —— 从问卷到结果

### 10.1 `src/components/results/MatchScoreRing.tsx` —— SVG 环形进度条

**文件**：`src/components/results/MatchScoreRing.tsx`

```typescript
export function MatchScoreRing({ score, size = 56 }: MatchScoreRingProps) {
  // SVG 圆形进度条数学计算
  const radius = (size - 8) / 2           // 半径（减去描边宽度）
  const circumference = 2 * Math.PI * radius  // 周长公式：2πr
  // strokeDashoffset 控制弧长：分数越高，偏移越小，弧越长
  const offset = circumference - (score / 100) * circumference

  // 分数对应颜色：80+绿色，60+紫色，其他橙色
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#7c4dff' : '#f59e0b'

  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">  {/* 旋转-90度让起点在顶部 */}
        {/* 背景圆 */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        {/* 进度圆（dasharray + dashoffset 控制弧长） */}
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}      // 虚线总长 = 周长
          strokeDashoffset={offset}            // 偏移量 = 周长 - 已完成部分
          className="transition-all duration-500"  // CSS 过渡动画
        />
      </svg>
      <div className="absolute">
        <span style={{ color }}>{score}</span>
      </div>
    </div>
  )
}
```

**学习知识点**：
- **SVG 基础**：`<svg>` `<circle>` 是矢量图形标签，`cx/cy` 是圆心坐标，`r` 是半径
- **strokeDasharray/Dashoffset**：虚线模式。`dasharray` 设总长，`dashoffset` 设偏移，实现进度条效果
- **三元运算符嵌套**：`a ? x : b ? y : z` —— 等价于 if/else if/else
- **解构默认值**：`{ score, size = 56 }` —— 如果不传 `size`，默认用 56

### 10.2 `src/components/results/ChannelsOverview.tsx` —— 渠道去重合并

**文件**：`src/components/results/ChannelsOverview.tsx`

```typescript
export function ChannelsOverview({ plans }: { plans: Plan[] }) {
  // useMemo：跨方案合并同名渠道，标注来源
  const merged = useMemo<ChannelWithSources[]>(() => {
    const map = new Map<string, ChannelWithSources>()

    plans.forEach((plan) => {
      plan.channels.forEach((ch) => {
        const key = ch.name.trim()  // 用渠道名作为去重键
        const exist = map.get(key)
        if (exist) {
          exist.sources.push(plan.title)  // 已存在：追加来源
        } else {
          map.set(key, { ...ch, sources: [plan.title] })  // 不存在：新建
        }
      })
    })

    return Array.from(map.values())  // Map → Array
  }, [plans])

  return (
    <section>
      {merged.map((ch) => (
        <ChannelCard key={ch.name} channel={ch} sources={ch.sources} />
      ))}
    </section>
  )
}
```

**学习知识点**：
- **Map 去重模式**：用 `Map<key, value>` 实现按 key 去重，比 `Array.find()` 更高效
- **`Array.from(map.values())`**：Map 的 `values()` 返回迭代器，`Array.from` 转为数组
- **`useMemo` 缓存**：只有 `plans` 变化时才重新计算合并结果

### 10.3 `src/components/detail/ChannelCard.tsx` —— 配置驱动的样式

**文件**：`src/components/detail/ChannelCard.tsx`

```typescript
// 配置对象：渠道类型 → 图标 + 颜色
const TYPE_CONFIG: Record<string, { icon: typeof Store; bg: string; border: string }> = {
  '平台': { icon: Store, bg: 'bg-blue-500', border: 'border-l-blue-500' },
  '私域': { icon: Users, bg: 'bg-violet-500', border: 'border-l-violet-500' },
  '线下': { icon: MapPin, bg: 'bg-emerald-500', border: 'border-l-emerald-500' },
}

export function ChannelCard({ channel, sources }: ChannelCardProps) {
  // 从配置中获取样式，找不到时用默认值
  const config = TYPE_CONFIG[channel.type || ''] || {
    icon: Store, bg: 'bg-slate-500', border: 'border-l-slate-500'
  }
  const Icon = config.icon  // 组件赋值给变量，JSX 中可以用 <Icon />

  return (
    <div className={`border-l-4 ${config.border}`}>
      <span className={`${config.bg}`}>
        <Icon size={20} />  {/* 动态渲染图标组件 */}
      </span>
    </div>
  )
}
```

**学习知识点**：
- **配置驱动开发**：把映射关系提取为配置对象，避免大量 if/else
- **`Record<string, T>`**：TypeScript 工具类型，表示"键为 string、值为 T 的对象"
- **组件作为变量**：React 组件本质是函数，可以赋值给变量后在 JSX 中渲染
- **模板字符串拼接 className**：`` `border-l-4 ${config.border}` `` 动态拼接 CSS 类名

---

## 第十一站：详情页与学习资源

### 11.1 `src/pages/DetailPage.tsx` —— 详情页

**文件**：`src/pages/DetailPage.tsx`

```typescript
import { useParams, Navigate } from 'react-router-dom'

export function DetailPage() {
  const { id } = useParams()  // 从 URL 提取 :id 参数
  const plans = useAppStore((s) => s.plans)

  // 在方案列表中查找匹配的方案
  const plan = plans.find((p) => p.id === id)

  // 找不到方案时重定向（如直接输入 URL 或刷新页面）
  if (!plan) return <Navigate to="/results" replace />

  return (
    <div>
      <SummaryHeader plan={plan} />
      <ProsConsSection pros={plan.pros} cons={plan.cons} />
      <ChannelsSection channels={plan.channels} />
      <GuideTimeline guide={plan.guide} />
      {plan.learningResources?.length > 0 && (  // 可选链 + 条件渲染
        <LearningResourcesSection resources={plan.learningResources} />
      )}
      <ActionToolbar plan={plan} />
    </div>
  )
}
```

**学习知识点**：
- **`useParams()`**：从 URL 路径参数中取值。路由 `/detail/:id` 匹配 `/detail/p1` 时，`id` 为 `'p1'`
- **`Navigate` 组件**：声明式重定向。渲染 `<Navigate to="..." />` 会触发路由跳转
- **`.find()`**：数组方法，返回第一个满足条件的元素，找不到返回 `undefined`
- **`?.` 可选链**：`plan.learningResources?.length` —— 如果 `learningResources` 是 undefined，不会报错

### 11.2 `src/components/detail/LearningResourcesSection.tsx` —— 平台搜索链接生成

**文件**：`src/components/detail/LearningResourcesSection.tsx`

```typescript
// 平台 → 搜索 URL 生成函数
const SEARCH_URLS: Record<string, (kw: string) => string> = {
  'B站': (kw) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(kw)}`,
  '小红书': (kw) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(kw)}`,
  '知乎': (kw) => `https://www.zhihu.com/search?q=${encodeURIComponent(kw)}`,
}

export function LearningResourcesSection({ resources }: { resources: LearningResource[] }) {
  return (
    <div>
      {resources.map((res, idx) => {
        const searchUrl = SEARCH_URLS[res.platform]
        const link = searchUrl ? searchUrl(res.keyword || res.title) : null

        return (
          <a href={link} target="_blank" rel="noopener noreferrer">
            去搜索
          </a>
        )
      })}
    </div>
  )
}
```

**学习知识点**：
- **`encodeURIComponent`**：URL 编码函数。把中文等特殊字符转为 `%XX` 格式，避免 URL 解析错误
- **`target="_blank"`**：在新标签页打开链接
- **`rel="noopener noreferrer"`**：安全属性。防止新页面通过 `window.opener` 访问原页面（防钓鱼攻击）
- **函数作为值**：`SEARCH_URLS` 的值是函数，通过 `searchUrl(keyword)` 调用

### 11.3 `src/components/detail/GuideTimeline.tsx` —— 可折叠步骤

**文件**：`src/components/detail/GuideTimeline.tsx`

```typescript
function GuideStepItem({ step }: { step: GuideStep }) {
  const [open, setOpen] = useState(false)  // 局部状态：是否展开

  return (
    <li>
      <button onClick={() => setOpen(!open)}>  {/* 点击切换展开/收起 */}
        {step.title}
        <ChevronDown className={open ? 'rotate-180' : ''} />  {/* 旋转图标 */}
      </button>

      {open && (  // 条件渲染：只有展开时才渲染内容
        <div>
          <p>{step.content}</p>
          {step.tools?.length ? (
            <span><Wrench size={12} /> {step.tools.join('、')}</span>
          ) : null}
        </div>
      )}
    </li>
  )
}
```

**学习知识点**：
- **`useState`**：React 最基础的 Hook。`[状态, 设置函数] = useState(初始值)`
- **状态切换**：`setOpen(!open)` —— 取反当前值
- **`&& 短路渲染**：`{open && <div>...</div>}` —— open 为 false 时不渲染

---

## 第十二站：通用组件与错误处理

### 12.1 `src/components/common/RetryBoundary.tsx` —— 错误边界

**文件**：`src/components/common/RetryBoundary.tsx`

React 默认不会捕获渲染时的错误 —— 一个组件崩溃会白屏。Error Boundary 是 React 的安全网。

```typescript
// 错误边界必须是 class 组件（React 限制，函数组件不支持）
export class RetryBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  // 静态方法：子组件抛出错误时调用，返回新状态触发重渲染
  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  // 生命周期方法：错误发生后的副作用（如上报日志）
  componentDidCatch(err: Error, info: unknown) {
    console.error('[RetryBoundary] 捕获渲染异常:', err, info)
  }

  handleReset = () => this.setState({ hasError: false })  // 重置状态，重试渲染

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>页面出错了</h1>
          <button onClick={this.handleReset}>重试</button>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      )
    }
    return this.props.children  // 正常渲染子组件
  }
}
```

**学习知识点**：
- **Class 组件**：React 的老写法。现在推荐函数组件 + Hooks，但 Error Boundary 必须用 class
- **`static` 方法**：类方法，不需要实例化就能调用。`RetryBoundary.getDerivedStateFromError()`
- **生命周期方法**：`componentDidCatch` 在错误发生后调用，类似 `useEffect`
- **`this.props.children`**：组件的子节点。`<Boundary><App /></Boundary>` 中 `children` 就是 `<App />`

### 12.2 `src/components/common/SkeletonCard.tsx` —— 骨架屏

**文件**：`src/components/common/SkeletonCard.tsx`

```typescript
export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">  {/* animate-pulse 闪烁动画 */}
      {/* 用灰色块模拟内容布局，让用户预知即将展示的结构 */}
      <div className="h-5 w-16 rounded-full bg-slate-200" />     {/* 模拟标签 */}
      <div className="h-14 w-14 rounded-full bg-slate-200" />    {/* 模拟环形评分 */}
      <div className="h-4 w-3/4 rounded bg-slate-200" />         {/* 模拟标题 */}
      <div className="h-3 w-full rounded bg-slate-100" />        {/* 模拟描述 */}
    </div>
  )
}
```

**学习知识点**：
- **骨架屏**：加载过程中展示灰色占位块，比空白页面或转圈更友好
- **`animate-pulse`**：TailwindCSS 内置动画类，让元素透明度循环变化

### 12.3 `src/components/common/LoadingScreen.tsx` —— 加载文案轮播

**文件**：`src/components/common/LoadingScreen.tsx`

```typescript
const TIPS = ['正在分析你的技能树…', '匹配最适合的副业赛道…', ...]

export function LoadingScreen() {
  const [idx, setIdx] = useState(0)

  // useEffect + setInterval：每 1.8 秒切换一条文案
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % TIPS.length)  // 取模运算实现循环
    }, 1800)
    return () => clearInterval(timer)  // ⚠️ 清理函数：组件卸载时清除定时器
  }, [])

  return <p>{TIPS[idx]}</p>
}
```

**学习知识点**：
- **`setInterval`**：定时器函数，每隔指定毫秒执行一次回调
- **`clearInterval`**：清除定时器。**必须在 useEffect 清理函数中调用**，否则组件卸载后定时器还在运行，导致内存泄漏
- **取模 `%`**：`(i + 1) % length` 实现循环递增。如 length=5，i 从 0 到 4 再回到 0
- **函数式更新**：`setIdx((i) => (i+1) % length)` —— 使用前一个状态计算新状态，避免闭包陷阱

---

## 知识点速查表

### TypeScript 语法

| 语法 | 含义 | 示例 |
|------|------|------|
| `interface` | 定义对象结构 | `interface Profile { name: string }` |
| `type` | 定义类型别名 | `type ID = string \| number` |
| `T<U>` | 泛型参数 | `useState<string>('hello')` |
| `as` | 类型断言 | `data as Profile` |
| `!` | 非空断言 | `element!` 表示"一定不为 null" |
| `?.` | 可选链 | `a?.b?.c` 链中任一为 null 则返回 undefined |
| `??` | 空值合并 | `a ?? b` —— a 为 null/undefined 时用 b |
| `\|` | 联合类型 | `string \| number` |
| `&` | 交叉类型 | `A & B` 同时满足 A 和 B |
| `Record<K,V>` | 键值对类型 | `Record<string, number>` |
| `typeof` | 运行时类型检查 | `typeof x === 'string'` |
| `instanceof` | 实例类型检查 | `err instanceof Error` |
| `keyof` | 提取键的联合类型 | `keyof Profile` → `'name' \| 'age'` |

### React Hooks

| Hook | 用途 | 关键点 |
|------|------|--------|
| `useState` | 局部状态 | `[值, 设值函数] = useState(初始值)` |
| `useEffect` | 副作用 | 依赖数组控制执行时机，清理函数防止泄漏 |
| `useMemo` | 缓存计算结果 | 依赖不变时返回缓存值 |
| `useCallback` | 缓存函数引用 | 避免子组件不必要重渲染 |
| `useRef` | 引用 DOM 或可变值 | `.current` 访问，不触发重渲染 |
| `useParams` | 读取 URL 参数 | 路由 `/detail/:id` → `{ id: 'p1' }` |
| `useNavigate` | 编程式跳转 | `navigate('/results')` |
| `useLocation` | 当前 URL 信息 | `{ pathname, search, hash }` |

### JavaScript/ES6+ 语法

| 语法 | 含义 | 示例 |
|------|------|------|
| `let / const` | 块级作用域变量 | `const` 不可重新赋值 |
| 箭头函数 | 简写函数，无自己的 `this` | `(x) => x * 2` |
| 解构赋值 | 从对象/数组提取值 | `const { name } = user` |
| 展开运算符 | 展开数组/对象 | `{ ...obj, key: newVal }` |
| 模板字符串 | 带插值的字符串 | `` `Hello ${name}` `` |
| `async/await` | 异步语法 | `await fetch(url)` |
| `Map` | 键值对集合 | `map.set(k, v)` / `map.get(k)` |
| `Set` | 去重集合 | `new Set([1,1,2])` → `{1, 2}` |
| 可选链 `?.` | 安全访问嵌套属性 | `user?.address?.city` |
| 空值合并 `??` | 提供默认值 | `value ?? 'default'` |

### 数组方法

| 方法 | 作用 | 返回值 |
|------|------|--------|
| `.map(fn)` | 映射转换 | 新数组 |
| `.filter(fn)` | 过滤 | 新数组 |
| `.find(fn)` | 查找第一个匹配 | 元素或 undefined |
| `.forEach(fn)` | 遍历 | undefined |
| `.includes(item)` | 是否包含 | boolean |
| `.join(sep)` | 拼接为字符串 | 字符串 |
| `.slice(start, end)` | 截取子数组 | 新数组 |
| `Array.from(iterable)` | 可迭代对象转数组 | 新数组 |
| `Array.isArray(x)` | 判断是否数组 | boolean |

---

## 学习建议

1. **按顺序阅读**：从第一站到第十二站，每站打开对应文件对照理解
2. **动手修改**：改一个配置值（如 `temperature: 0.8` 改成 `0.2`），观察 AI 输出的变化
3. **断点调试**：在 VS Code 中按 F5 启动调试，在 `handleRequest` 函数里打断点，观察请求流程
4. **扩展练习**：
   - 给问卷添加一道新题目（修改 `constants/questionnaire.ts`）
   - 在方案详情页添加一个新模块（参考 `ProsConsSection.tsx` 的结构）
   - 修改 AI 提示词，让它生成 5 个方案而非 3 个
5. **阅读官方文档**：
   - React：https://react.dev
   - TypeScript：https://www.typescriptlang.org/docs
   - Vite：https://vitejs.dev/guide
   - TailwindCSS：https://tailwindcss.com/docs
   - Zustand：https://github.com/pmndrs/zustand
   - Vercel Functions：https://vercel.com/docs/functions
