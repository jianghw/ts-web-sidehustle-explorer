# 人生副业体验器 - Demo Day1-Day6 执行计划

## Summary

本计划为 TRAE AI 创造力大赛初赛 Demo「人生副业体验器」（生活娱乐赛道，报名帖 https://forum.trae.cn/t/topic/45038）的 Day1-Day6 落地执行方案。

项目采用「Vite + React + TailwindCSS 前端 + Vercel Serverless Functions (api/目录) BFF 后端 + 豆包大模型(火山方舟 Ark)」架构，单一 Vercel 项目部署。

核心数据流：用户填写画像问卷(技能/时间/收入目标/风险偏好) → 前端 POST `/api/generate` → BFF 组装 Prompt 调用豆包(JSON mode 结构化输出) → 返回 3 个个性化副业方案(含优缺点/赚钱渠道/操作指南) → 前端列表页展示卡片 + 详情页展开完整内容。

Day1-Day6 覆盖：项目初始化与问卷页 → 豆包API接入与Prompt工程 → 方案展示与详情交互 → 操作指南与渠道汇总 → UI打磨与状态兜底。每天均包含具体文件清单、关键代码结构、验证测试步骤。

## Current State Analysis

- 工作目录 `d:\codespace\traework` 当前为**空目录**，需从零初始化。
- 豆包API接入方式已研究确认：
  - Base URL：`https://ark.cn-beijing.volces.com/api/v3/`
  - 鉴权：HTTP Header `Authorization: Bearer <ARK_API_KEY>`
  - 路径：`/chat/completions`，兼容 OpenAI SDK 标准
  - 模型名使用火山方舟控制台创建的推理接入点 Endpoint ID（或 Model ID）
  - 支持 `response_format: { type: "json_object" }` 结构化输出 [$TRAE_REF](https://www.volcengine.com/docs/82379/1568221)
  - API 路径 `/api/v3/chat/completions`，域名 `ark.cn-beijing.volces.com` [$TRAE_REF](https://blog.csdn.net/PhoenixCPH/article/details/143823347)
- Vercel 部署：Vite 项目零配置识别；`api/` 目录自动作为 Serverless Functions；SPA 路由需 `vercel.json` rewrites（须排除 `/api` 路径避免拦截后端请求）。
- 前置准备（执行者需先在火山方舟控制台完成，非本计划编码范围）：实名认证 → 创建 API Key → 创建推理接入点(选择 doubao-1.5-pro 或 doubao-seed 系列) → 获取 Endpoint ID。
- 用户为全栈开发者，计划给架构设计和关键决策点，不需手把手教学；用户特别要求每个阶段加入验证/测试环节确保无错误。

## Proposed Changes（按 Day 组织）

### 全局技术架构与目录结构（贯穿 Day1-Day6）

```
d:\codespace\traework\
├── api/                            # Vercel Serverless Functions (BFF)
│   ├── generate.ts                 # POST /api/generate 生成3个副业方案
│   ├── _lib/                       # 共享逻辑(下划线前缀,Vercel不作为函数)
│   │   ├── ark.ts                  # 豆包客户端封装(OpenAI兼容SDK)
│   │   ├── prompt.ts               # Prompt工程
│   │   ├── schemas.ts              # 响应JSON结构/校验
│   │   └── types.ts                # 共享类型
│   └── _dev.ts                     # 本地开发api入口(配合vite proxy)
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # 路由 + 布局
│   ├── pages/
│   │   ├── QuestionnairePage.tsx   # Day1 画像问卷页
│   │   ├── ResultsPage.tsx         # Day3 方案列表展示页
│   │   └── DetailPage.tsx          # Day4-5 方案详情页
│   ├── components/
│   │   ├── layout/                 # Header/Footer
│   │   ├── questionnaire/          # 问卷表单组件
│   │   ├── results/                # 方案卡片
│   │   ├── detail/                 # 详情区块组件
│   │   └── common/                 # Loading/Error/Empty
│   ├── hooks/
│   │   ├── useGenerate.ts
│   │   ├── useLocalStorage.ts
│   │   └── useFavorite.ts
│   ├── services/api.ts             # fetch封装
│   ├── store/appStore.ts           # zustand状态管理
│   ├── types/index.ts
│   ├── constants/questionnaire.ts  # 问卷题目配置
│   ├── utils/format.ts
│   └── styles/index.css            # Tailwind入口
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── .env.example
├── .env.local                      # 本地API Key(gitignore)
└── .gitignore
```

关键架构决策：
- **BFF 方式**：用 Vercel `api/` 目录的 Serverless Functions，而非独立 Node 服务。前后端同仓库，单一部署，API Key 通过环境变量注入服务端，前端永不接触密钥。
- **SDK 选择**：后端使用 `openai` SDK（兼容模式），`baseURL` 指向火山方舟，`apiKey` 用 `ARK_API_KEY`，`model` 用 Endpoint ID。比裸 fetch 更省心（自动重试、流式、类型）。
- **本地开发**：`vite` 跑前端(5173) + `tsx watch api/_dev.ts` 跑本地api(3001) + `vite.config.ts` 的 `server.proxy` 把 `/api` 代理到 3001。生产环境 Vercel 直接走 `api/` 函数，无需 `_dev.ts`。
- **结构化输出**：豆包 JSON mode 一次性返回 3 个完整方案（含优缺点/渠道/操作指南），列表页用摘要、详情页用完整内容，避免二次 API 调用。

---

### Day1：项目初始化 + 画像问卷页

**目标**：搭建可运行的前端骨架 + 完成画像问卷页(本地能填表并持久化)。

#### 要创建的文件

| 文件 | What | Why |
|------|------|-----|
| `package.json` | 依赖：react/react-dom/react-router-dom、vite/@vitejs/plugin-react、tailwindcss/postcss/autoprefixer、zustand、lucide-react、openai(dev)、tsx(dev)、typescript/@types/* | 统一管理前后端依赖(后端依赖也在根package.json,Vercel会安装) |
| `vite.config.ts` | 配置 React 插件 + `server.proxy`(`/api` → `http://localhost:3001`) + `@` 路径别名 | 本地开发前后端联调 |
| `tailwind.config.js` | content 指向 `src/**/*`，扩展主题色(品牌色)、字体 | UI 基础 |
| `postcss.config.js` | tailwindcss + autoprefixer | Tailwind 处理链 |
| `tsconfig.json` / `tsconfig.node.json` | 路径别名 `@/*` → `src/*`，JSX，严格模式 | TS 工程 |
| `index.html` | 根挂载点 + 字体引入 + 中文 lang/title | Vite 入口 |
| `src/main.tsx` | 挂载 App + BrowserRouter + 导入 Tailwind CSS | 应用入口 |
| `src/styles/index.css` | `@tailwind base/components/utilities` + 全局样式 | Tailwind 入口 |
| `src/App.tsx` | 路由表：`/` → 问卷页、`/results` → 结果页、`/detail/:id` → 详情页 + Layout 包裹 | 页面骨架 |
| `src/store/appStore.ts` | zustand store：`profile`(画像)、`plans`(方案)、`loading`、`error`、set 方法 | 全局状态 |
| `src/types/index.ts` | `Profile`、`Plan`、`PlanSummary` 等类型定义 | 前后端类型对齐 |
| `src/constants/questionnaire.ts` | 问卷题目配置数组(技能多选/每日可用时间/月收入目标/风险偏好/启动资金等) | 问卷数据驱动渲染 |
| `src/hooks/useLocalStorage.ts` | 泛型 localStorage 读写 hook | 画像草稿持久化 |
| `src/components/layout/Header.tsx` / `Footer.tsx` | 顶部品牌栏 + 底部信息 | 布局 |
| `src/pages/QuestionnairePage.tsx` | 问卷页：分步或单页表单 + 提交跳转 `/results` | Day1 主交付 |
| `src/components/questionnaire/*` | 各题型组件(SkillSelect/SliderGroup/RadioCard 等) | 问卷组成 |
| `vercel.json` | rewrites：`/api/(.*)` 保持原路径，`/((?!api/).*)` → `/index.html` | SPA 路由 + 不拦截 API |
| `.env.example` | `ARK_API_KEY=`、`ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3`、`ARK_MODEL_ID=` | 环境变量模板 |
| `.gitignore` | node_modules、dist、.env.local、.vercel | 忽略 |

#### 关键代码结构

`src/constants/questionnaire.ts`（数据驱动问卷，避免硬编码 UI）：
```ts
export interface Question {
  id: keyof Profile;           // 如 'skills' | 'availableHours' | 'incomeGoal' | 'riskTolerance' | 'budget'
  type: 'multi-select' | 'slider' | 'radio-card' | 'number';
  title: string;
  description?: string;
  options?: { label: string; value: string; icon?: string }[];
  min?: number; max?: number; step?: number; unit?: string;
  required?: boolean;
}
export const QUESTIONS: Question[] = [ /* 技能/时间/收入目标/风险偏好/启动资金 */ ];
```

`src/store/appStore.ts`：
```ts
interface AppState {
  profile: Profile | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  setProfile: (p: Profile) => void;
  setPlans: (p: Plan[]) => void;
}
```

`vercel.json`（关键：API 路径必须排除在 SPA rewrite 之外）：
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

#### Verification Steps (Day1)
1. `npm run dev` 启动 vite，浏览器访问 `http://localhost:5173` 能看到问卷页，所有题型可交互。
2. 填写问卷 → 刷新页面 → 草稿从 localStorage 恢复(验证 useLocalStorage)。
3. 提交问卷 → URL 跳转到 `/results`(结果页可暂为占位)。
4. `npm run build` 能成功构建无 TS 报错。
5. 直接访问 `/results` 深链不报 404(验证 SPA 路由，本地需 vite 默认处理，生产靠 vercel.json)。
6. 检查 `.env.local` 不在 git 跟踪中。

---

### Day2：接豆包 API + 生成副业方案（BFF + Prompt 工程）

**目标**：后端 BFF 调通豆包 API，输入画像 → 输出 3 个结构化副业方案 JSON；前端能发起请求并 console.log 结果。

#### 要创建的文件

| 文件 | What | Why |
|------|------|-----|
| `api/_lib/ark.ts` | 封装 OpenAI 兼容客户端：`new OpenAI({ apiKey, baseURL })`，导出 `callDoubao(messages, options)` | 复用调用逻辑 |
| `api/_lib/prompt.ts` | 构建 system prompt(角色+输出规范) + 把 Profile 拼成 user message | Prompt 工程 |
| `api/_lib/schemas.ts` | 定义响应 JSON 结构 + 运行时校验函数 `validatePlans(data)` | 确保结构可靠 |
| `api/_lib/types.ts` | 后端共享类型(可与前端 types 对齐或独立) | 类型安全 |
| `api/generate.ts` | Vercel Serverless Function：POST 处理，读 body → 调 prompt → 调 ark → 校验 → 返回 JSON | 核心 BFF 接口 |
| `api/_dev.ts` | 本地 http server(原生 http 或轻量封装)，监听 3001，路由 `/api/generate` 到同一逻辑 | 本地开发 |
| `src/services/api.ts` | `fetchJSON` 封装 + `generatePlans(profile): Promise<Plan[]>` | 前端调用层 |
| `src/hooks/useGenerate.ts` | 封装调用：loading/error 状态 + 调 `generatePlans` + 写 store | Day3 直接复用 |
| `src/types/index.ts` 更新 | 补全 `Plan` 完整字段(标题/摘要/匹配度/优缺点/赚钱渠道/操作指南/预估收入/难度) | 与后端 schema 对齐 |
| `.env.local` | 填入真实 `ARK_API_KEY`、`ARK_BASE_URL`、`ARK_MODEL_ID` | 本地调试 |

#### 关键代码结构

`api/_lib/ark.ts`（OpenAI SDK 兼容模式调用豆包）：
```ts
import OpenAI from 'openai';
const client = new OpenAI({
  apiKey: process.env.ARK_API_KEY!,
  baseURL: process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3',
});
export async function callDoubao(system: string, user: string) {
  const res = await client.chat.completions.create({
    model: process.env.ARK_MODEL_ID!,        // Endpoint ID
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    response_format: { type: 'json_object' }, // 豆包 JSON mode
    temperature: 0.8,
  });
  return res.choices[0].message.content;      // JSON 字符串
}
```

`api/_lib/prompt.ts`（Prompt 工程核心，决定方案质量）：
```ts
export function buildSystemPrompt(): string {
  return `你是一位资深副业规划师。根据用户画像，生成3个最适合其个性化条件的副业方向。
输出必须是 JSON，结构：{ "plans": [{ "id":"p1", "title":"", "summary":"", "matchScore":85,
"difficulty":"低|中|高", "estimatedIncome":"", "pros":[""], "cons":[""],
"channels":[""], "guide":[{"step":1,"title":"","content":""}], "tags":[""] }, ...] }
要求：3个方案风格差异化(稳赚型/成长型/爆发型)；匹配度基于用户技能时间收入目标风险偏好；
赚钱渠道和操作指南具体可执行，不要空话。只返回JSON，不要多余解释。`;
}
export function buildUserPrompt(profile: Profile): string {
  return `用户画像：技能[${profile.skills.join(',')}]；每日可用时间${profile.availableHours}小时；
月收入目标${profile.incomeGoal}元；风险偏好${profile.riskTolerance}；启动资金${profile.budget}元。`;
}
```

`api/generate.ts`（Vercel Function 标准签名）：
```ts
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  try {
    const profile = await req.json();
    const sys = buildSystemPrompt();
    const usr = buildUserPrompt(profile);
    const raw = await callDoubao(sys, usr);
    const data = JSON.parse(raw);
    const plans = validatePlans(data);     // 运行时校验+容错
    return Response.json({ plans });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
```

`api/_dev.ts`（本地开发入口，共享 _lib 逻辑）：
```ts
import http from 'http';
import handler from './generate';
http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/generate')) {
    const body = await readBody(req);
    const r = await handler(new Request('http://localhost'+req.url, { method:'POST', body }));
    res.writeHead(r.status, {'Content-Type':'application/json'}); res.end(await r.text());
  }
}).listen(3001);
```

#### Verification Steps (Day2)
1. 先用 curl/Postman 直接打火山方舟 `/api/v3/chat/completions` 验证 API Key 和 Endpoint ID 有效(排除接入点配置问题)。
2. 配置 `.env.local` 后运行 `npx tsx watch api/_dev.ts`，用 curl POST `http://localhost:3001/api/generate` 带一个示例 profile，确认返回合法 JSON 且含 3 个方案。
3. 验证 `validatePlans` 能拦截畸形输出（手动传错数据测试兜底）。
4. 启动前端 `npm run dev`，在问卷页提交，控制台能看到 fetch `/api/generate` 成功(vite proxy 生效)并打印 plans。
5. 故意填错误 API Key → 确认返回 500 + 错误信息，前端不崩溃。
6. 检查浏览器 Network 面板：请求体不含 API Key，响应体是结构化 plans（密钥未泄露验证）。

---

### Day3-4：方案展示页 + 详情交互

**目标**：方案列表卡片展示 + 点击进入详情页 + 详情页分区渲染(优缺点/渠道/操作指南)。

#### 要创建的文件

| 文件 | What | Why |
|------|------|-----|
| `src/pages/ResultsPage.tsx` | 进入即调 `useGenerate`(若 store 无 plans 则触发) + 渲染方案卡片网格 + "重新生成"按钮 | Day3 主交付 |
| `src/components/results/PlanCard.tsx` | 单卡片：标题/摘要/匹配度环/难度标签/预估收入/标签 + 点击跳详情 | 列表项 |
| `src/components/results/MatchScoreRing.tsx` | 匹配度环形进度(SVG) | 视觉强化 |
| `src/components/results/EmptyState.tsx` | 无方案时引导回问卷 | 空态 |
| `src/pages/DetailPage.tsx` | 从 store 按 `id` 取方案 + 分区渲染 + 顶部返回 | Day4 主交付 |
| `src/components/detail/ProsConsSection.tsx` | 优缺点双栏(✓/✗) | 详情区块 |
| `src/components/detail/ChannelsSection.tsx` | 赚钱渠道列表(带图标) | 详情区块 |
| `src/components/detail/GuideTimeline.tsx` | 操作指南步骤时间线 | 详情区块 |
| `src/components/detail/SummaryHeader.tsx` | 详情页头部(标题/匹配度/收入/难度) | 详情区块 |
| `src/hooks/useGenerate.ts` 更新 | 接入 `generatePlans` + store + 跳转 `/results` | 串联流程 |
| `src/pages/QuestionnairePage.tsx` 更新 | 提交时调 `useGenerate` 并跳转 | 闭环 |

#### 关键代码结构

`ResultsPage.tsx`：
```tsx
const { plans, loading, error, generate } = useGenerate();
useEffect(() => { if (!plans.length) generate(profile); }, []);
if (loading) return <LoadingScreen />;
if (error) return <ErrorState onRetry={() => generate(profile)} />;
if (!plans.length) return <EmptyState />;
return (
  <div className="grid gap-6 md:grid-cols-3">
    {plans.map(p => <PlanCard key={p.id} plan={p} />)}
  </div>
);
```

`DetailPage.tsx` 取数据方式：
```tsx
const { id } = useParams();
const plan = useAppStore(s => s.plans.find(p => p.id === id));
if (!plan) return <Navigate to="/results" replace />;
```

`GuideTimeline.tsx`（操作指南步骤渲染）：
```tsx
<ol className="relative border-l-2 border-primary/30">
  {plan.guide.map(g => (
    <li className="ml-6 pb-6">
      <span className="absolute -left-3 ...">{g.step}</span>
      <h4>{g.title}</h4>
      <p className="text-gray-600">{g.content}</p>
    </li>
  ))}
</ol>
```

**关键决策**：详情页数据来自 Day2 一次性生成的完整方案（store 内），不再发 API 请求。若 token 超限再拆分为 Day5 单独 `/api/detail` 接口(作为 fallback 方案记录，但默认不启用)。

#### Verification Steps (Day3-4)
1. 问卷提交 → 自动跳 `/results` → 显示 3 张卡片，匹配度/难度/收入标签正确。
2. 直接访问 `/results`(无 store 数据) → 应触发重新生成或引导回问卷(验证刷新兜底)。
3. 点击任一卡片 → 跳 `/detail/p1` → 优缺点/渠道/操作指南分区完整渲染。
4. 直接访问 `/detail/p1`(store 空) → 重定向回 `/results`，不白屏。
5. 浏览器后退键从详情页能回到列表页且数据保留。
6. 移动端视口(375px)下卡片单列、详情可读(响应式验证)。

---

### Day5：操作指南 + 渠道汇总

**目标**：完善操作指南的步骤化呈现 + 全部方案的赚钱渠道汇总视图 + 「换一批/调整画像」入口。

#### 要创建/更新的文件

| 文件 | What | Why |
|------|------|-----|
| `src/components/detail/GuideTimeline.tsx` 增强 | 步骤折叠/展开 + 每步「所需工具」「预计耗时」字段 | 指南更实用 |
| `src/components/detail/ChannelCard.tsx` | 单渠道卡：渠道名/类型/入门门槛/收益模式 | 渠道细化 |
| `src/components/detail/ChannelsSection.tsx` 更新 | 用 ChannelCard 网格 + 「汇总所有方案渠道」切换 | 渠道汇总 |
| `src/pages/ChannelsOverviewPage.tsx` 或 `ResultsPage` 内 Section | 跨 3 个方案的所有赚钱渠道汇总(去重+标注来源方案) | 渠道汇总视图 |
| `src/components/detail/ActionToolbar.tsx` | 详情页底部：换一批 / 调整画像 / 收藏(本地) | 操作入口 |
| `src/hooks/useFavorite.ts` | 收藏方案(localStorage) | 轻交互 |
| `api/_lib/schemas.ts` 更新 | 补充 guide 每步的 `tools`/`duration` 字段、channel 的 `type`/`barrier` | 结构细化 |
| `api/_lib/prompt.ts` 更新 | Prompt 中要求输出每步工具与耗时、渠道类型与门槛 | 输出更丰富 |

#### 关键代码结构

渠道汇总(跨方案去重)：
```ts
const allChannels = useMemo(() => {
  const map = new Map<string, Channel & { from: string[] }>();
  plans.forEach(p => p.channels.forEach(ch => {
    const key = ch.name;
    if (map.has(key)) map.get(key)!.from.push(p.title);
    else map.set(key, { ...ch, from: [p.title] });
  }));
  return [...map.values()];
}, [plans]);
```

Prompt 增强（在 Day2 system prompt 基础上补充字段约束）：
```
guide 每步需含：step/title/content/tools(数组)/duration(如"1-2小时")
channels 每项需含：name/type(平台/私域/线下)/barrier(低中高)/incomeModel
```

#### Verification Steps (Day5)
1. 详情页操作指南每步显示工具与耗时，折叠交互正常。
2. 渠道汇总视图列出所有渠道并标注来源方案，无重复。
3. 「换一批」重新调用 `/api/generate`，结果与上次有差异(temperature 起效)。
4. 「调整画像」跳回问卷页且原画像回填。
5. 收藏功能刷新后保留。
6. 重新生成后详情页旧链接不失效（按 id 查找，找不到时友好提示而非崩溃）。

---

### Day6：UI 打磨 + 加载/空状态/错误兜底

**目标**：视觉精修 + 全链路状态兜底 + 部署上线可访问。

#### 要创建/更新的文件

| 文件 | What | Why |
|------|------|-----|
| `src/components/common/LoadingScreen.tsx` | 问卷提交后的趣味加载态(副业生成中动画 + 文案轮播) | 体验 |
| `src/components/common/ErrorState.tsx` | 统一错误组件(图标+消息+重试) | 错误兜底 |
| `src/components/common/SkeletonCard.tsx` | 方案卡片骨架屏 | 加载态 |
| `src/components/common/RetryBoundary.tsx` | React Error Boundary 包裹路由 | 运行时崩溃兜底 |
| `src/App.tsx` 更新 | 包入 ErrorBoundary + 全局 Toast/通知 | 全局兜底 |
| `src/services/api.ts` 更新 | 超时控制(AbortController)、错误分类(网络/限流/服务端) | 健壮性 |
| `api/generate.ts` 更新 | 超时处理、限流简单防护、CORS/Method 校验、日志 | 后端健壮性 |
| `src/styles/index.css` + `tailwind.config.js` | 品牌色定稿、字体、阴影、圆角统一、深色模式(可选) | 视觉统一 |
| `src/components/layout/Header.tsx` 更新 | Logo + 步骤指示器 + GitHub 链接 | 品牌感 |
| `README.md` | 项目介绍/本地启动/Vercel 部署/环境变量配置/演示账号说明 | 交付文档 |
| `vercel.json` 复核 | 确认 rewrites + 函数配置正确 | 部署 |

#### 关键代码结构

超时与错误分类(`api.ts`)：
```ts
export async function generatePlans(profile: Profile): Promise<Plan[]> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60000);  // 60s 超时
  try {
    const res = await fetch('/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile), signal: ctrl.signal,
    });
    if (!res.ok) throw new ApiError(mapStatus(res.status), await safeMsg(res));
    const { plans, error } = await res.json();
    if (error) throw new ApiError('upstream', error);
    return plans;
  } catch (e) {
    if (e instanceof DOMException) throw new ApiError('timeout', '请求超时');
    throw e;
  } finally { clearTimeout(t); }
}
```

后端限流与兜底(`generate.ts`)：
```ts
// 简单内存限流(单实例 Demo 够用)
const last = new Map<string, number>();
// 校验 method、CORS、body 字段；捕获 SDK 错误区分 401/429/500
```

#### Verification Steps (Day6)
1. 模拟慢网络(Chrome throttling)→ 加载动画与骨架屏正常显示。
2. 断网提交 → 错误态显示 + 重试按钮可用。
3. 后端返回 429/500 → 前端错误分类提示准确(非笼统"出错了")。
4. 人为在组件抛异常 → ErrorBoundary 捕获不白屏。
5. 直接访问任意深链(`/detail/p9` 等)→ 均有合理兜底。
6. `vercel deploy`（或 `vercel --prod`）→ 线上访问问卷→生成→详情全流程跑通。
7. 线上检查：浏览器 Sources 不含 `ARK_API_KEY`；Network 请求只走 `/api/generate`。
8. 移动端 + 桌面端视觉走查，无错位。

---

## Assumptions & Decisions

### 假设
1. 执行者已在火山方舟控制台完成实名认证、创建 API Key、创建推理接入点(Endpoint)并取得 Endpoint ID。
2. 模型选型：推荐 `doubao-1.5-pro-32k`（性价比高、32k 上下文足够 3 方案完整输出）或 `doubao-seed-1.6`（更强）。具体由执行者在控制台接入点配置，代码侧只填 Endpoint ID。
3. 豆包 JSON mode 对所选模型可用（doubao-1.5-pro 及以上支持）。若个别模型不支持，fallback 为 prompt 强约束 + 正则提取 JSON（在 `validatePlans` 中做容错）。
4. Vercel 免费额度(Hobby 计划) 足够 Demo 演示。
5. 初赛评审通过线上 Demo 链接访问，无需鉴权/多用户。

### 关键决策
1. **前后端同仓库 + Vercel api/ 目录 BFF**：相比独立 Node 服务，部署最简、密钥安全、零额外运维。`api/` 下划线前缀目录(`_lib`/`_dev`)不会被 Vercel 识别为函数，可安全放共享代码。
2. **OpenAI 兼容 SDK 而非裸 fetch**：自动处理流式/重试/类型，火山方舟官方明确兼容，开发效率高。
3. **一次性生成完整方案(JSON mode)**：列表+详情同源数据，避免二次请求，体验流畅。token 成本可控(3 方案约 2-4k tokens)。
4. **zustand 而非 Redux/Context**：Demo 状态中等复杂度，zustand 一个文件搞定，避免 Context 嵌套与 Redux 样板。
5. **本地开发双进程(vite + tsx dev server + proxy)**：比 `vercel dev` 的 HMR 体验更稳，生产/本地共用 `_lib` 逻辑保证一致性。
6. **vercel.json rewrite 排除 `/api`**：这是 SPA + BFF 同站的坑点，必须显式排除否则 API 被重写到 index.html。
7. **不引入 SSR/Next.js**：Demo 无 SEO 需求，Vite SPA 足够，降低复杂度。
8. **状态兜底前置考虑**：Day2 即在 BFF 做 `validatePlans` 运行时校验，Day6 做前端兜底，分层防御 LLM 输出不稳定。

### 风险与备选
- **风险**：豆包 JSON mode 偶发不返回合法 JSON → `validatePlans` 做正则提取兜底 + 失败重试 1 次。
- **风险**：Vercel 函数冷启动延迟 → 加载态 + 骨架屏掩盖。
- **风险**：单次生成 token 超限 → 备选拆分为 Day5 `/api/detail` 按需拉取详情(默认不启用)。
- **风险**：本地 `tsx` 跑 `_dev.ts` 与生产 Vercel 函数签名不一致 → `_dev.ts` 统一构造 `Request` 转交 `generate.ts` 的 handler，保证逻辑单点。

---

## 全局验证清单（Day6 收尾）

- [ ] 本地 `npm run dev` 全流程：问卷 → 生成 → 列表 → 详情 → 换一批 → 调整画像，无报错。
- [ ] `npm run build` 无 TS 错误，产物体积合理。
- [ ] Vercel 部署成功，线上域名可访问，环境变量已在 Vercel 项目设置中配置(`ARK_API_KEY`/`ARK_BASE_URL`/`ARK_MODEL_ID`)。
- [ ] 浏览器侧无 API Key 泄露(查 Sources / 网络请求)。
- [ ] 错误路径(断网/超时/5xx/深链)均有兜底 UI。
- [ ] 移动端 + 桌面端响应式正常。
- [ ] README 含本地启动、部署、环境变量、演示说明。
