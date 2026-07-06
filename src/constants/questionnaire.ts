/**
 * 文件用途：问卷题目的配置文件。
 * 这里定义了用户在首页需要回答的所有问题——包括技能、时间、收入目标、风险偏好、启动资金。
 * 把问卷内容集中配置在一个文件里，方便日后修改题目（增删选项、调整范围）而不用改组件代码。
 * 你可以把它理解为"问卷的题目清单"。
 */

// 引入用户画像类型，确保每道题的 id 与 Profile 的字段一一对应，防止写错字段名
import type { Profile } from '@/types'

/**
 * 单个选项的配置：用于多选题和单选卡片题。
 * 每个选项由"显示给用户看的文字"和"实际存储的值"组成。
 */
export interface QuestionOption {
  label: string             // 选项显示文字（用户看到的，如"写作/文案"）
  value: string             // 选项实际值（程序内部使用的，如"writing"）
  icon?: string             // 选项图标（可选，用 emoji 增加视觉辨识度）
  description?: string      // 选项描述（可选，帮助用户理解这个选项的含义）
}

/**
 * 单道题目的配置：定义一道问卷题的完整信息。
 */
export interface Question {
  // 题目对应的 Profile 字段名。用 keyof Profile 约束，
  // 这样填写的 id 必须是 Profile 中已存在的字段，写错会报错
  id: keyof Profile
  // 题目类型：
  // - multi-select：多选（可勾选多个选项）
  // - slider：滑动条（拖动选择一个数值）
  // - radio-card：单选卡片（从几个卡片中选一个）
  // - number：数字输入（手动输入数字）
  type: 'multi-select' | 'slider' | 'radio-card' | 'number'
  title: string             // 题目标题（问题本身）
  description?: string      // 题目说明（可选，帮助用户理解怎么答）
  placeholder?: string      // 输入框占位提示文字（可选，用于 number 类型）
  options?: QuestionOption[]  // 选项列表（多选/单选卡片题才需要）
  min?: number              // 最小值（slider/number 类型用）
  max?: number              // 最大值（slider/number 类型用）
  step?: number             // 步长（slider 每次拖动变化的量）
  unit?: string             // 单位（如"小时"、"元"，显示在数值旁边）
  required?: boolean        // 是否必答（true 表示用户必须回答才能继续）
}

/**
 * QUESTIONS：问卷所有题目的完整配置。
 * 用户在首页会按这个顺序依次看到这些问题。
 * 回答完成后，所有答案会组装成一个 Profile 对象发给后端。
 */
export const QUESTIONS: Question[] = [
  // —— 第 1 题：技能特长（多选）——
  {
    id: 'skills',                              // 对应 Profile.skills 字段
    type: 'multi-select',                       // 多选题，用户可勾选多项技能
    title: '你擅长哪些技能？',
    description: '可多选，选择你最拿手的 1-5 项',  // 引导用户聚焦自己最擅长的
    required: true,                             // 必答，技能是生成方案的核心依据
    options: [
      { label: '写作/文案', value: 'writing', icon: '✍️' },
      { label: '设计/美工', value: 'design', icon: '🎨' },
      { label: '编程/开发', value: 'coding', icon: '💻' },
      { label: '视频/剪辑', value: 'video', icon: '🎬' },
      { label: '摄影', value: 'photography', icon: '📷' },
      { label: '翻译', value: 'translation', icon: '🌐' },
      { label: '运营/营销', value: 'marketing', icon: '📣' },
      { label: '教学/辅导', value: 'teaching', icon: '📚' },
      { label: '手工/烘焙', value: 'handcraft', icon: '🧁' },
      { label: '数据/分析', value: 'data', icon: '📊' },
      { label: '音乐/配音', value: 'music', icon: '🎵' },
      { label: '其他', value: 'other', icon: '✨' },
    ],
  },
  // —— 第 2 题：每日可投入时间（滑动条）——
  {
    id: 'availableHours',                       // 对应 Profile.availableHours 字段
    type: 'slider',                             // 滑动条选择，比手动输入更直观
    title: '每天能投入多少时间？',
    description: '按你日常可支配的碎片时间估算',   // 帮用户用现实标准估算，避免高估
    min: 1,                                     // 最少 1 小时
    max: 12,                                    // 最多 12 小时（留足上限）
    step: 1,                                    // 每次拖动变化 1 小时
    unit: '小时',                               // 数值后显示"小时"
    required: true,
  },
  // —— 第 3 题：月收入目标（单选卡片）——
  {
    id: 'incomeGoal',                           // 对应 Profile.incomeGoal 字段
    type: 'radio-card',                         // 单选卡片，让用户选一个收入档次
    title: '期望月收入目标是？',
    description: '阶段性目标，不必一步到位',      // 鼓励用户设定合理的初期目标
    required: true,
    options: [
      // value 存的是该档位的代表数值（取中间值），方便后端做数值比较
      { label: '500-2000元', value: '1500', icon: '🌱' },    // 入门级：先赚点零花钱
      { label: '2000-5000元', value: '3500', icon: '🌿' },   // 进阶级：副业小有规模
      { label: '5000-10000元', value: '7500', icon: '🌳' },  // 成熟级：副业收入可观
      { label: '10000元以上', value: '15000', icon: '🚀' },  // 高阶：接近或超过主业
    ],
  },
  // —— 第 4 题：风险偏好（单选卡片）——
  {
    id: 'riskTolerance',                        // 对应 Profile.riskTolerance 字段
    type: 'radio-card',
    title: '你的风险偏好是？',
    description: '影响推荐方案的稳健程度',        // 让用户明白这个选择如何影响推荐结果
    required: true,
    options: [
      // 每个选项带 description，帮用户理解各风险等级的具体含义
      { label: '稳健型', value: 'low', icon: '🛡️', description: '低风险、回本快、不囤货' },
      { label: '平衡型', value: 'medium', icon: '⚖️', description: '适度投入、有成长空间' },
      { label: '进取型', value: 'high', icon: '🔥', description: '可接受前期投入和较长回报周期' },
    ],
  },
  // —— 第 5 题：启动资金（单选卡片）——
  {
    id: 'budget',                               // 对应 Profile.budget 字段
    type: 'radio-card',
    title: '可接受的启动资金？',
    description: '前期一次性投入（设备/课程/囤货等）',  // 明确说明是"一次性"投入，不是持续成本
    required: true,
    options: [
      { label: '0元（零成本起步）', value: '0', icon: '🆓' },      // 零成本：适合试水
      { label: '500元以内', value: '500', icon: '💸' },            // 低成本：买点基础工具
      { label: '500-3000元', value: '2000', icon: '💰' },          // 中等投入：设备/课程
      { label: '3000元以上', value: '5000', icon: '🏦' },          // 较高投入：可囤货/租场地
    ],
  },
]

/**
 * RISK_LABELS：风险偏好值与中文标签的映射表。
 * 后端返回的数据中 riskTolerance 用的是英文值（low/medium/high），
 * 而页面上显示给用户看的是中文（稳健型/平衡型/进取型）。
 * 这个映射表负责把英文值转成中文，让界面更友好。
 */
export const RISK_LABELS: Record<Profile['riskTolerance'], string> = {
  low: '稳健型',
  medium: '平衡型',
  high: '进取型',
}
