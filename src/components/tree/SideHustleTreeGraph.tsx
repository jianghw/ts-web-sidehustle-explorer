/**
 * 文件用途：副业发展路径树的可视化组件（Feature 3 核心）。
 *
 * 把一棵 SideHustleTree（树形数据）渲染成"从左到右"的生长路径图：
 *   根节点（起步期）在左侧，子节点（成长期 / 专家期 / 大师期）依次向右展开，
 *   父子之间用 CSS 边框画的连接线串联，形成清晰的发展脉络。
 *
 * 设计要点：
 * 1. 横向树（左→右）：移动端宽度有限，横向展开后可左右滑动查看，比竖向更省纵向空间。
 * 2. 递归渲染：用一个 TreeNode 组件递归画出任意深度的节点，结构简单、易理解。
 * 3. 连接线用纯 CSS（border / 绝对定位的细线），不依赖复杂 SVG 布局，保证移动端可用。
 */

// 图标：Wallet（钱包，表示收入）、Clock（时钟，表示耗时）、Network（树状网络，表示路径）
import { Wallet, Clock, Network } from 'lucide-react'
// 引入树形数据的类型定义
import type { SideHustleTree, SideHustleTreeNode } from '@/types/career'
// 引入阶段标签映射（起步期/成长期/专家期/大师期）和阶段配色映射
import { LEVEL_LABELS, LEVEL_COLORS } from '@/types/career'

interface SideHustleTreeGraphProps {
  // 要渲染的完整发展路径树
  tree: SideHustleTree
}

export function SideHustleTreeGraph({ tree }: SideHustleTreeGraphProps) {
  return (
    <div>
      {/* 路径标题与说明：让用户先了解这棵树讲的是什么发展路线 */}
      {tree.title && (
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Network size={16} className="text-brand-500" />
          {tree.title}
        </h4>
      )}
      {tree.description && (
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{tree.description}</p>
      )}

      {/* 阶段图例：把四种阶段颜色集中展示一次，方便用户对照理解节点配色 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(LEVEL_LABELS) as SideHustleTreeNode['level'][]).map((lv) => {
          const c = LEVEL_COLORS[lv]
          return (
            <span key={lv} className={`tag ${c.bg} ${c.text}`}>
              {LEVEL_LABELS[lv]}
            </span>
          )
        })}
      </div>

      {/*
        可横向滚动的容器：树越深越宽，超出屏幕宽度时允许左右滑动，避免被挤压变形。
        - overflow-x-auto：水平方向溢出时出现滚动条
        - 内层 w-max：让内容按"最大宽度"撑开（不压缩），从而触发外层滚动
        - min-w-full：内容比屏幕窄时也至少占满整宽，视觉更饱满
      */}
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="w-max min-w-full p-2">
          {/*
            从根节点开始递归渲染整棵树。
            isRoot 用来给根节点一个强调样式（品牌色描边），让"起点"更醒目。
          */}
          <TreeNode node={tree.root} isRoot />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                           递归树节点（内部组件）                              */
/* -------------------------------------------------------------------------- */

interface TreeNodeProps {
  // 当前要画的节点数据
  node: SideHustleTreeNode
  // 是否为根节点（影响样式强调）
  isRoot?: boolean
}

/**
 * 递归树节点组件：画出一个节点卡片，并在右侧递归画出它的所有子节点。
 *
 * 布局结构（横向，左→右）：
 *   [节点卡片] ──┬── [子节点A] ──┬── [孙节点...]
 *               │                └── ...
 *               └── [子节点B]
 *
 * 连接线实现思路（纯 CSS，无 SVG）：
 * - 父卡片到"竖向脊柱"之间：一条短横线（h-px 的细条）。
 * - 每个子节点左侧有一个"连接器列"：用绝对定位画出一条竖线（脊柱）和一条横线。
 *   · 竖线把兄弟节点串起来：第一个子节点从"中线向下"，最后一个"从上到中线"，中间的"贯穿全高"。
 *   · 横线连到对应子节点卡片的垂直中心。
 * - 关键：用 items-center 让卡片始终垂直居中于它的子树，于是横线固定对齐到卡片中心，
 *   无论卡片高度是否一致都能对齐。
 */
function TreeNode({ node, isRoot = false }: TreeNodeProps) {
  // children 可能是 undefined 或空数组，统一成数组便于处理
  const children = node.children ?? []
  const hasChildren = children.length > 0

  return (
    // 外层：节点卡片 + 子树水平排列；items-center 让卡片垂直居中于子树
    <div className="flex items-center">
      {/* 节点卡片：固定宽度保证各层级对齐；shrink-0 防止被 flex 压缩 */}
      <NodeCard node={node} isRoot={isRoot} />

      {hasChildren && (
        <>
          {/* 父卡片到脊柱的横向连接线：高度仅 1px，垂直居中 */}
          <div className="h-px w-5 shrink-0 bg-slate-200" />

          {/*
            子节点列：纵向堆叠所有子节点（兄弟之间上下排列）。
            不加 gap，兄弟间距由每个子树外层的 py-3 提供，
            这样脊柱竖线才能在兄弟之间无缝衔接。
          */}
          <div className="flex shrink-0 flex-col">
            {children.map((child, i) => {
              const isFirst = i === 0
              const isLast = i === children.length - 1
              return (
                // 单个子节点行：左侧连接器 + 右侧子树；默认 items-stretch 让连接器拉伸到子树高度
                <div key={child.id} className="flex items-stretch">
                  {/*
                    连接器列：固定宽度，内部用绝对定位画"竖线 + 横线"。
                    relative 是为了让内部的 absolute 元素以它为定位参照。
                  */}
                  <div className="relative w-5 shrink-0">
                    {/*
                      竖线（脊柱）：宽 1px 的细条，颜色浅灰。
                      - 第一个子节点：top-1/2 bottom-0 —— 从自身中线往下延伸到底（连接下方兄弟）
                      - 最后一个子节点：top-0 bottom-1/2 —— 从顶延伸到自身中线（承接上方兄弟）
                      - 中间的子节点：top-0 bottom-0 —— 贯穿全高（既承接上方又连接下方）
                      这样多段竖线首尾相接，形成一条连贯的脊柱。
                    */}
                    <span
                      className={`absolute left-0 w-px bg-slate-200 ${
                        isFirst
                          ? 'top-1/2 bottom-0'
                          : isLast
                            ? 'top-0 bottom-1/2'
                            : 'top-0 bottom-0'
                      }`}
                    />
                    {/*
                      横线：连到子节点卡片，位于子树的垂直中心（top-1/2 + 上移自身一半高度）。
                      由于子树用 items-center，卡片中心正好落在子树中线，故横线刚好对准卡片中部。
                    */}
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-200" />
                  </div>

                  {/* 子树：加垂直内边距制造兄弟之间的呼吸间距 */}
                  <div className="shrink-0 py-3">
                    <TreeNode node={child} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                           节点卡片（内部组件）                                */
/* -------------------------------------------------------------------------- */

interface NodeCardProps {
  node: SideHustleTreeNode
  isRoot?: boolean
}

/**
 * 节点卡片：展示单个发展阶段的信息。
 * 内容包括：阶段徽章（按阶段配色）、名称、说明、收入、耗时、所需技能。
 * 固定宽度 w-44，让同一层级的卡片左右对齐，连接线节奏一致。
 */
function NodeCard({ node, isRoot = false }: NodeCardProps) {
  // 取出当前阶段对应的配色（背景 / 边框 / 文字）
  const colors = LEVEL_COLORS[node.level]

  return (
    <div
      className={`w-44 shrink-0 rounded-xl border-2 bg-white p-3 shadow-sm transition-shadow hover:shadow-card ${
        colors.border
      } ${isRoot ? 'ring-2 ring-brand-200' : ''}`}
    >
      {/* 阶段徽章：用对应阶段颜色的小胶囊标注（如"起步期"） */}
      <span className={`tag ${colors.bg} ${colors.text}`}>
        {LEVEL_LABELS[node.level]}
      </span>

      {/* 节点名称：加粗显示，是卡片最醒目的信息 */}
      <h4 className="mt-1.5 text-sm font-bold leading-snug text-slate-800">{node.label}</h4>

      {/* 说明：限制最多 2 行，避免长文字把卡片撑得过高影响排版 */}
      {node.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {node.description}
        </p>
      )}

      {/* 收入与耗时：用图标 + 文字小字呈现，信息密度高但不杂乱 */}
      <div className="mt-2 space-y-1">
        {node.income && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Wallet size={12} className="shrink-0 text-brand-500" />
            <span className="truncate">{node.income}</span>
          </div>
        )}
        {node.duration && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} className="shrink-0" />
            <span className="truncate">{node.duration}</span>
          </div>
        )}
      </div>

      {/* 所需技能：以小标签形式罗列，帮助用户了解每阶段要补齐的能力 */}
      {node.skills && node.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {node.skills.map((s) => (
            <span
              key={s}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
