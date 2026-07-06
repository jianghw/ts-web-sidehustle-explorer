# 人生副业体验器

> TRAE AI 创造力大赛参赛作品 · 输入个人画像，AI 生成 3 个个性化副业方案

## 技术栈

- **前端**：React 18 + Vite 5 + TailwindCSS 3 + Zustand 5 + React Router 6 + lucide-react
- **后端**：Vercel Serverless Functions（`api/` 目录）+ 豆包大模型（火山方舟 Ark，OpenAI 兼容 SDK）
- **部署**：Vercel（Hobby 计划）

## 功能

1. **画像问卷**：技能多选 / 每日可用时间 / 月收入目标 / 风险偏好 / 启动资金
2. **职业浏览**（新增）：8 大类 60+ 细分职业分类浏览，支持搜索、按分类筛选，点击"查看更多职业"进入
3. **AI 生成**：BFF 组装 Prompt 调用豆包（JSON mode 结构化输出），返回 3 个差异化方案（稳赚型 / 成长型 / 爆发型）
4. **方案展示**：匹配度环形评分、难度标签、收入预期、技能标签
5. **详情页**：优缺点分析、赚钱渠道（含门槛/类型）、操作指南（可折叠步骤，含工具和时长）
6. **副业发展路径树**（新增）：详情页可一键生成 AI 发展路径树，展示从起步到大师的多分支成长路线
7. **职业洞察**（新增）：AI 分析行业趋势、预测新型副业方向、深度分析职业技能，支持从结果页或导航栏进入
8. **渠道总览**：跨方案去重汇总，标注每个渠道出现在哪些方案中
9. **操作工具栏**：换一批（重新生成）/ 调整画像（回填草稿）/ 收藏（localStorage 持久化）
10. **状态兜底**：加载动画（轮播文案）、骨架屏、错误重试、Error Boundary、后端限流

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

本项目部署在 Vercel 上，生产访问地址：<https://traework-one.vercel.app>

已连接的 GitHub 仓库：<https://github.com/jianghw/web-app-side-hustle-explorer>

下面提供两种部署方式，任选其一即可。**如果你不太熟悉命令行，推荐使用方式一（GitHub 集成自动部署）**，配置一次后每次推送代码都会自动更新线上版本。

> 项目根目录的 `vercel.json` 已预先配置好 SPA 路由重写（rewrite）和 `/api` 直连规则，两种部署方式都无需额外修改。

---

### 方式一：GitHub 集成自动部署（推荐）

这种方式把 GitHub 仓库和 Vercel 绑定，以后只要往仓库推送代码（`git push`），Vercel 就会自动构建并发布新版本，全程无需敲命令。

**第 1 步：注册并登录 Vercel**

1. 打开 <https://vercel.com>，点击右上角「Sign Up」
2. 选择「Continue with GitHub」，用你的 GitHub 账号授权登录（推荐，这样能直接关联仓库）
3. 完成新手引导（可以一路跳过）

**第 2 步：导入仓库**

1. 登录后进入 Dashboard，点击「Add New...」→「Project」
2. 在「Import Git Repository」列表中找到 `jianghw/web-app-side-hustle-explorer`
   - 如果列表里没有，点击「Adjust GitHub App Permissions」授权 Vercel 访问该仓库
3. 点击「Import」导入项目

**第 3 步：配置构建（一般自动识别，无需改动）**

Vercel 会自动识别这是一个 Vite 项目，默认配置如下，**通常直接保持默认即可**：

- Framework Preset：`Vite`
- Build Command：`npm run build`
- Output Directory：`dist`
- Install Command：`npm install`

**第 4 步：配置环境变量（关键步骤）**

在「Environment Variables」区域逐条添加下面三个变量（值参考上方「环境变量」章节）：

| Key | Value | 说明 |
|-----|-------|------|
| `ARK_API_KEY` | 你的火山方舟 API Key | 在火山方舟控制台创建获取 |
| `ARK_BASE_URL` | `https://ark.cn-beijing.volces.com/api/v3` | 一般不用改 |
| `ARK_MODEL_ID` | 你的推理接入点 Endpoint ID | 在火山方舟控制台创建模型接入点后获取 |

> 如果暂时没有 API Key，可以先留空，项目会自动走 mock 数据，UI 可正常浏览（但 AI 生成功能不可用）。

**第 5 步：部署**

1. 点击「Deploy」开始部署
2. 等待 1～3 分钟，看到「Congratulations」即表示部署成功
3. 部署完成后，Vercel 会分配一个形如 `xxx.vercel.app` 的域名，点击即可访问

**第 6 步：开启自动部署（默认已开启）**

导入完成后，自动部署就已经生效。之后：

- 往 `main` 分支推送代码 → 自动触发生产部署（Production Deployment）
- 往其他分支推送代码 → 自动触发预览部署（Preview Deployment），生成临时预览链接

可在项目「Settings → Git」中查看和修改触发分支。

---

### 方式二：CLI 手动部署

适合不方便授权 GitHub、或者需要本地直接推送构建产物的场景。需要本地已安装 Node.js（建议 18 以上）。

**第 1 步：安装 Vercel CLI**

打开终端（命令行），执行：

```bash
npm install -g vercel
```

**第 2 步：登录 Vercel 账号**

```bash
vercel login
```

按提示选择登录方式（推荐 GitHub 或 Email），终端会显示一个验证链接，浏览器打开确认即可。

**第 3 步：在项目根目录初始化**

进入项目根目录（包含 `package.json` 的目录）后执行：

```bash
vercel
```

首次执行会问几个问题，按以下推荐回答即可：

- Set up and deploy? → `Y`
- Which scope? → 选你的账号
- Link to existing project? → `N`（首次部署选 N）
- What's your project's name? → 回车使用默认，或自定义（如 `traework`）
- In which directory? → 回车（当前目录）
- Want to modify settings? → `N`

执行完成后会生成一个 `.vercel` 目录（已在 `.gitignore` 中忽略），并产出一个预览地址（preview URL）。

**第 4 步：配置环境变量（CLI 方式）**

用命令行添加环境变量（注意 Key 区分大小写）：

```bash
# 添加三个变量（替换成你自己的真实值）
vercel env add ARK_API_KEY
vercel env add ARK_BASE_URL
vercel env add ARK_MODEL_ID

# 每条命令执行后会提示：
# What's the value of ARK_API_KEY? → 粘贴对应的值
# Add to which environments? → 用空格选中 Production / Preview / Development，回车确认
```

> 也可以直接在 Vercel 网页端「Settings → Environment Variables」中添加，效果一样。

**第 5 步：部署到生产环境**

```bash
# 部署预览版（用于测试）
vercel

# 部署生产版（正式发布，更新线上访问地址）
vercel --prod
```

部署完成后终端会输出访问地址，`--prod` 部署的地址会更新到你的生产域名。

**第 6 步：更新部署**

以后每次代码改动后，只需重新执行 `vercel --prod` 即可更新线上版本。

---

### 环境变量配置补充说明

无论哪种方式，环境变量都支持两种配置入口：

**A. 网页 Dashboard 方式（推荐新手）**

进入 Vercel 项目 →「Settings」→「Environment Variables」，点击「Add New」逐条添加。添加后可选择作用于哪些环境（Production / Preview / Development）。

**B. CLI 命令行方式**

```bash
# 添加
vercel env add 变量名

# 查看已配置的变量（会打码显示）
vercel env ls

# 删除某个变量
vercel env rm 变量名

# 拉取到本地 .env 文件（开发用）
vercel env pull .env.local
```

> 注意：修改或新增环境变量后，需要**重新部署一次**才会生效（Dashboard 上点击「Redeploy」，或 CLI 执行 `vercel --prod`）。

---

### 常见问题 FAQ

**Q1：国内能正常访问 Vercel 部署的站点吗？**

Vercel 的默认 `*.vercel.app` 域名在国内访问不稳定，部分地区/网络可能打不开。常见解决方案：

- 使用代理 / VPN 访问
- 绑定自定义域名（见下一条），走自己的 CDN 或 DNS 解析，稳定性更好
- 仅做本地开发体验的话，用 `npm run dev:all` 在本地跑即可

**Q2：为什么我的 `xxx.vercel.app` 域名访问不了，但 `traework-one.vercel.app` 可以？**

Vercel 为每个项目分配的默认域名是随机生成的。本项目的生产域名已固定为 <https://traework-one.vercel.app>（在项目「Settings → Domains」中配置）。如果你想用自己的域名，可以：

1. 在域名服务商购买域名（如阿里云、腾讯云、Cloudflare）
2. 在 Vercel 项目「Settings → Domains」中添加该域名
3. 按提示到域名服务商处添加 CNAME 解析记录（指向 `cname.vercel-dns.com`）
4. 等待 DNS 生效（通常几分钟到几小时）即可访问

**Q3：部署成功，但点「生成副业方案」报错怎么办？**

大概率是环境变量没配置或配置有误：

1. 检查 Vercel「Settings → Environment Variables」中 `ARK_API_KEY` 和 `ARK_MODEL_ID` 是否已填写且值正确
2. 确认添加后**重新部署**过一次（环境变量改动需要重新部署才生效）
3. 查看部署日志：项目页 →「Deployments」→ 点对应记录 →「Logs」，看 `/api/generate` 接口报什么错
4. 如果是火山方舟鉴权失败，去火山方舟控制台核对 API Key 和 Endpoint ID

**Q4：不配置环境变量能部署吗？**

可以。项目后端在未配置 `ARK_API_KEY` 时会自动返回 mock 数据，UI 可正常浏览和操作，只是 AI 生成功能会返回示例数据而非真实生成。

**Q5：每次部署都要等很久吗？**

首次部署约 1～3 分钟（含依赖安装和构建）。之后增量部署通常 30 秒～1 分钟。Vercel Hobby（免费）计划对构建时长和频率有限制，个人项目通常够用。

**Q6：部署后如何回滚到上一个版本？**

进入项目「Deployments」列表，找到想回滚的历史记录，点击右侧「...」→「Promote to Production」即可把该版本切回生产环境，无需重新构建。

**Q7：CLI 部署时报 `Error: Not authenticated` 怎么办？**

重新执行 `vercel login` 完成登录即可。如果是团队/组织账号，确认 `vercel` 命令选择的 scope 正确。

**Q8：`vercel.json` 是做什么的，需要我改吗？**

不需要改。它已经配置好：

- 把所有非文件请求（如 `/results`、`/detail/xxx`）重写到 `index.html`，保证前端路由刷新不 404
- 让 `/api/*` 请求直接走 `api/` 目录下的 Serverless Functions

除非你调整了项目结构，否则保持原样即可。

---

## 目录结构

```
├── api/                        # Vercel Serverless Functions
│   ├── _lib/                   # 共享代码（下划线前缀，不被 Vercel 识别为 Function）
│   │   ├── ark.ts              # 豆包 API 封装（OpenAI SDK 兼容）
│   │   ├── prompt.ts           # System / User Prompt 构建
│   │   ├── careerPrompt.ts     # 职业洞察与路径树 Prompt 构建（新增）
│   │   ├── careerMock.ts       # 职业洞察与路径树 Mock 数据（新增）
│   │   ├── schemas.ts          # 运行时类型校验与容错
│   │   ├── mock.ts             # Mock 数据（开发模式 fallback）
│   │   └── types.ts            # 后端类型定义
│   ├── generate.ts             # POST /api/generate 主接口
│   ├── analyze.ts              # POST /api/analyze 职业洞察分析（新增）
│   ├── tree.ts                 # POST /api/tree 副业发展路径树（新增）
│   └── _dev.ts                 # 本地开发 HTTP 服务器（端口 3001）
├── src/
│   ├── components/
│   │   ├── common/             # 通用组件（LoadingScreen / ErrorState / SkeletonCard / RetryBoundary）
│   │   ├── detail/             # 详情页组件（SummaryHeader / ProsConsSection / ChannelsSection / GuideTimeline / ChannelCard / ActionToolbar）
│   │   ├── insights/           # 职业洞察组件（TrendCard / EmergingHustleCard / CareerAnalysisCard）（新增）
│   │   ├── layout/             # 布局（Header / Footer）
│   │   ├── questionnaire/      # 问卷组件（SkillSelect / SliderGroup / RadioCard / CareerBrowserLink）
│   │   ├── results/            # 结果页组件（PlanCard / MatchScoreRing / EmptyState / ChannelsOverview）
│   │   └── tree/               # 发展路径树组件（SideHustleTreeGraph / SideHustleTreeSection）（新增）
│   ├── hooks/                  # useGenerate / useFavorite / useLocalStorage / useCareerInsights / useSideHustleTree
│   ├── pages/                  # QuestionnairePage / ResultsPage / DetailPage / CareerBrowserPage / CareerInsightsPage
│   ├── services/               # api.ts / careerApi.ts（前端 API 调用）
│   ├── store/                  # appStore / favoriteStore（zustand）
│   ├── types/                  # 前端类型定义（index.ts / career.ts）
│   ├── constants/              # 问卷题目配置（questionnaire.ts）/ 职业分类数据（careers.ts）
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
