// 后端共享类型（与前端 types 对齐）
export interface Profile {
  skills: string[]
  availableHours: number
  incomeGoal: number
  riskTolerance: 'low' | 'medium' | 'high'
  budget: number
}

export interface GuideStep {
  step: number
  title: string
  content: string
  tools?: string[]
  duration?: string
}

export interface Channel {
  name: string
  type?: string
  barrier?: string
  incomeModel?: string
}

export interface LearningResource {
  platform: string
  type: string
  title: string
  description: string
  keyword?: string
}

export interface Plan {
  id: string
  title: string
  summary: string
  matchScore: number
  difficulty: string
  estimatedIncome: string
  pros: string[]
  cons: string[]
  channels: Channel[]
  guide: GuideStep[]
  learningResources?: LearningResource[]
  tags: string[]
}

export interface GenerateResponse {
  plans: Plan[]
  error?: string
}
