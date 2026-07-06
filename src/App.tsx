/**
 * 文件用途：应用的"根组件"，负责搭建页面整体框架（顶部导航 + 主体内容 + 底部），
 * 并配置不同网址路径对应显示哪个页面（这就是"路由"）。
 * 你可以把它理解为整个应用的"目录骨架"。
 */

// Routes / Route：React Router 提供的路由组件。
// Routes 是"路由容器"，里面放多条 Route；Route 是"一条路由规则"，指定"网址 → 页面"的对应关系。
import { Routes, Route } from 'react-router-dom'
// 页面顶部导航栏组件（比如 logo、菜单、收藏入口等）
import { Header } from '@/components/layout/Header'
// 页面底部信息栏组件（比如版权声明、友情链接等）
import { Footer } from '@/components/layout/Footer'
// RetryBoundary：自定义的错误重试边界组件。
// 当内部页面渲染或交互出错时，不会让整个页面白屏，而是显示一个"重试"按钮，提升用户体验
import { RetryBoundary } from '@/components/common/RetryBoundary'
// 问卷填写页面：用户在这里回答几个问题（技能、时间、收入目标等），作为生成方案的依据
import { QuestionnairePage } from '@/pages/QuestionnairePage'
// 方案结果列表页：展示 AI 根据问卷生成的多个副业方案，供用户浏览比较
import { ResultsPage } from '@/pages/ResultsPage'
// 方案详情页：展示某个副业方案的完整信息（操作步骤、赚钱渠道、学习资源等）
import { DetailPage } from '@/pages/DetailPage'

/**
 * 根组件 App
 * 它定义了整个页面的布局结构和路由规则
 */
export default function App() {
  return (
    // 使用 flex 纵向布局，min-h-screen 让容器至少占满整个屏幕高度
    // 这样当内容很少时，Footer 也会始终显示在屏幕底部，不会浮在半空
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏，所有页面共用 */}
      <Header />
      {/* 主体内容区域。flex-1 让它自动撑满 Header 和 Footer 之间的所有空间 */}
      <main className="flex-1">
        {/* RetryBoundary 包裹路由区域：页面出错时提供重试能力，而非直接白屏崩溃 */}
        <RetryBoundary>
          <Routes>
            {/* 首页：问卷填写。用户进入应用后看到的第一个页面 */}
            <Route path="/" element={<QuestionnairePage />} />
            {/* 结果页：展示生成的方案列表。用户提交问卷后跳转到此 */}
            <Route path="/results" element={<ResultsPage />} />
            {/* 详情页：查看某个方案的完整内容。:id 是动态参数，代表方案编号 */}
            <Route path="/detail/:id" element={<DetailPage />} />
            {/* 兜底路由：当用户访问了不存在的网址时，默认回到问卷首页，避免显示空白页 */}
            <Route path="*" element={<QuestionnairePage />} />
          </Routes>
        </RetryBoundary>
      </main>
      {/* 底部信息栏，所有页面共用 */}
      <Footer />
    </div>
  )
}
