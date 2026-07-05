import type { Profile } from '@/types'

export interface QuestionOption {
  label: string
  value: string
  icon?: string
  description?: string
}

export interface Question {
  id: keyof Profile
  type: 'multi-select' | 'slider' | 'radio-card' | 'number'
  title: string
  description?: string
  placeholder?: string
  options?: QuestionOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
  required?: boolean
}

export const QUESTIONS: Question[] = [
  {
    id: 'skills',
    type: 'multi-select',
    title: '你擅长哪些技能？',
    description: '可多选，选择你最拿手的 1-5 项',
    required: true,
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
  {
    id: 'availableHours',
    type: 'slider',
    title: '每天能投入多少时间？',
    description: '按你日常可支配的碎片时间估算',
    min: 1,
    max: 12,
    step: 1,
    unit: '小时',
    required: true,
  },
  {
    id: 'incomeGoal',
    type: 'radio-card',
    title: '期望月收入目标是？',
    description: '阶段性目标，不必一步到位',
    required: true,
    options: [
      { label: '500-2000元', value: '1500', icon: '🌱' },
      { label: '2000-5000元', value: '3500', icon: '🌿' },
      { label: '5000-10000元', value: '7500', icon: '🌳' },
      { label: '10000元以上', value: '15000', icon: '🚀' },
    ],
  },
  {
    id: 'riskTolerance',
    type: 'radio-card',
    title: '你的风险偏好是？',
    description: '影响推荐方案的稳健程度',
    required: true,
    options: [
      { label: '稳健型', value: 'low', icon: '🛡️', description: '低风险、回本快、不囤货' },
      { label: '平衡型', value: 'medium', icon: '⚖️', description: '适度投入、有成长空间' },
      { label: '进取型', value: 'high', icon: '🔥', description: '可接受前期投入和较长回报周期' },
    ],
  },
  {
    id: 'budget',
    type: 'radio-card',
    title: '可接受的启动资金？',
    description: '前期一次性投入（设备/课程/囤货等）',
    required: true,
    options: [
      { label: '0元（零成本起步）', value: '0', icon: '🆓' },
      { label: '500元以内', value: '500', icon: '💸' },
      { label: '500-3000元', value: '2000', icon: '💰' },
      { label: '3000元以上', value: '5000', icon: '🏦' },
    ],
  },
]

export const RISK_LABELS: Record<Profile['riskTolerance'], string> = {
  low: '稳健型',
  medium: '平衡型',
  high: '进取型',
}
