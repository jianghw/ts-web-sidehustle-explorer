# 人生副业体验器

> TRAE AI 创造力大赛参赛作品 · 输入个人画像，AI 生成 3 个个性化副业方案

## 技术栈

- **前端**：React 18 + Vite 5 + TailwindCSS 3 + Zustand 5 + React Router 6 + lucide-react
- **后端**：Vercel Serverless Functions（`api/` 目录）+ 豆包大模型（火山方舟 Ark，OpenAI 兼容 SDK）
- **部署**：Vercel（Hobby 计划）

## 功能

1. **画像问卷**：技能多选 / 每日可用时间 / 月收入目标 / 风险偏好 / 启动资金
2. **AI 生成**：BFF 组装 Prompt 调用豆包（JSON mode 结构化输出），返回 3 个差异化方案（稳赚型 / 成长型 / 爆发型）
3. **方案展示**：匹配度环形评分、难度标签、收入预期、技能标签
4. **详情页**：优缺点分析、赚钱渠道（含门槛/类型）、操作指南（可折叠步骤，含工具和时长）
5. **渠道总览**：跨方案去重汇总，标注每个渠道出现在哪些方案中
6. **操作工具栏**：换一批（重新生成）/ 调整画像（回填草稿）/ 收藏（localStorage 持久化）
7. **状态兜底**：加载动画（轮播文案）、骨架屏、错误重试、Error Boundary、后端限流

## 本地启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 ARK_API_KEY / ARK_BASE_URL / ARK_MODEL_ID
# （未配置时后端自动走 mock 数据，可完整体验 UI）

# 3. 启动开发服务器（同时启动 vite:5173 与本地 BFF:3001）
npm run dev:all

# 4. 浏览器访问
# http://localhost:5173
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `ARK_API_KEY` | 火山方舟 API Key（服务端，不暴露前端） | - |
| `ARK_BASE_URL` | 火山方舟 API 地址 | `https://ark.cn-beijing.volces.com/api/v3` |
| `ARK_MODEL_ID` | 推理接入点 Endpoint ID | - |

## Vercel 部署

1. 将仓库导入 Vercel，框架自动识别为 Vite
2. 在项目 Settings → Environment Variables 配置上述三个变量
3. `vercel --prod` 部署（`vercel.json` 已配置 SPA rewrite + `/api` 直连）

## 目录结构

```
├── api/                        # Vercel Serverless Functions
│   ├── _lib/                   # 共享代码（下划线前缀，不被 Vercel 识别为 Function）
│   │   ├── ark.ts              # 豆包 API 封装（OpenAI SDK 兼容）
│   │   ├── prompt.ts           # System / User Prompt 构建
│   │   ├── schemas.ts          # 运行时类型校验与容错
│   │   ├── mock.ts             # Mock 数据（开发模式 fallback）
│   │   └── types.ts            # 后端类型定义
│   ├── generate.ts             # POST /api/generate 主接口
│   └── _dev.ts                 # 本地开发 HTTP 服务器（端口 3001）
├── src/
│   ├── components/
│   │   ├── common/             # 通用组件（LoadingScreen / ErrorState / SkeletonCard / RetryBoundary）
│   │   ├── detail/             # 详情页组件（SummaryHeader / ProsConsSection / ChannelsSection / GuideTimeline / ChannelCard / ActionToolbar）
│   │   ├── layout/             # 布局（Header / Footer）
│   │   ├── questionnaire/      # 问卷组件（SkillSelect / SliderGroup / RadioCard）
│   │   └── results/            # 结果页组件（PlanCard / MatchScoreRing / EmptyState / ChannelsOverview）
│   ├── hooks/                  # useGenerate / useFavorite / useLocalStorage
│   ├── pages/                  # QuestionnairePage / ResultsPage / DetailPage
│   ├── services/               # api.ts（前端 API 调用）
│   ├── store/                  # appStore / favoriteStore（zustand）
│   ├── types/                  # 前端类型定义
│   ├── constants/              # 问卷题目配置
│   └── styles/                 # 全局样式
├── vercel.json                 # Vercel 部署配置
└── package.json
```

## 演示流程

1. 填写画像问卷（选技能 → 调时间 → 选收入目标 → 选风险偏好 → 选预算）
2. 点击「生成我的副业方案」
3. 查看 3 个 AI 生成的方案卡片（含匹配度评分）
4. 点击卡片查看详情（优缺点 / 渠道 / 操作指南）
5. 收藏感兴趣的方案 / 换一批重新生成 / 调整画像重新填写

## 须知

- 免鉴权，单用户 Demo，无多用户/数据库依赖
- AI 生成的方案仅供参考，投资有风险，入局需谨慎
- 收藏数据存储在浏览器 localStorage，清除浏览器数据会丢失
- 后端限流为内存级（Vercel Hobby 单实例），生产环境应换 Redis
