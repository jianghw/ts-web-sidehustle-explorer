/**
 * @file prompt.ts —— AI 提示词（Prompt）构建
 * @description 把发给豆包 AI 的提示词集中管理在这里。
 *              提示词工程是大模型应用的核心：同样的模型，提示词写得好坏直接决定输出质量。
 *              这里分为 system prompt（定义 AI 角色和输出格式）和 user prompt（注入用户信息）两部分。
 */

// 引入用户画像类型，用于约束 buildUserPrompt 的参数类型
import type { Profile } from './types'

/**
 * 构建 System Prompt（系统提示词）
 *
 * 系统提示词的作用：在对话开始前给 AI 设定"人设"和"规则"，
 * 告诉它你是谁、要做什么、必须按什么格式输出。
 * 这里设定 AI 为"资深副业规划师"，并严格规定了输出的 JSON 结构。
 *
 * 为什么不用代码生成 JSON 模板：直接把完整结构写在提示词里，AI 更容易遵循，
 * 而且字段含义一目了然，便于后续调整。
 *
 * @returns 系统提示词字符串
 */
export function buildSystemPrompt(): string {
  return `你是一位资深副业规划师，熟悉中国市场的灵活就业与副业生态。你的任务是根据用户画像，生成 3 个最适合其个性化条件的副业方向。

输出必须是合法 JSON，结构如下：
{
  "plans": [
    {
      "id": "p1",
      "title": "副业方向名称（简洁有记忆点，10字以内）",
      "summary": "一句话介绍这个副业是什么、怎么赚钱（30字以内）",
      "matchScore": 85,
      "difficulty": "低|中|高",
      "estimatedIncome": "如 2000-5000元/月",
      "pros": ["优点1", "优点2", "优点3"],
      "cons": ["缺点1", "缺点2", "缺点3"],
      "channels": [
        { "name": "渠道名", "type": "平台|私域|线下", "barrier": "低|中|高", "incomeModel": "收益模式说明" }
      ],
      "guide": [
        { "step": 1, "title": "步骤标题", "content": "具体可执行的说明", "tools": ["所需工具"], "duration": "如 1-2小时" }
      ],
      "learningResources": [
        { "platform": "B站|小红书|知乎|抖音|YouTube", "type": "UP主|视频教程|文章专栏|课程", "title": "资源标题或UP主名", "description": "推荐理由", "keyword": "搜索关键词" }
      ],
      "tags": ["标签1", "标签2"]
    }
  ]
}

要求：
1. 必须返回恰好 3 个方案，风格差异化：第1个偏稳赚型（低风险快回本）、第2个偏成长型（有积累价值）、第3个偏爆发型（天花板高但需投入）。
2. matchScore 为 0-100 的整数，需基于用户技能、时间、收入目标、风险偏好、预算综合评估，3 个方案分数应有区分度。
3. 赚钱渠道和操作指南必须具体可执行，不要空话套话。每个方案至少 2 个渠道、3 步操作指南。
4. learningResources 必须针对该副业方向推荐真实存在且有价值的学习资源，优先推荐国内平台（B站、小红书、知乎、抖音），每个方案至少 3 条。title 填具体 UP主名或教程名称；keyword 填用户可在平台搜索的关键词。如果不确定具体 UP主名，可以填该领域的通用搜索关键词作为 title。
5. 只返回 JSON，不要任何多余解释或 markdown 代码块标记。`
}

/**
 * 构建 User Prompt（用户提示词）
 *
 * 用户提示词的作用：把用户在前端填写的具体信息（技能、时间、预算等）
 * 用自然语言拼装成 AI 能理解的一段话，让 AI 据此生成个性化方案。
 *
 * 为什么要把枚举值映射成中文描述：前端存的是 low/medium/high 这种英文代码值，
 * 直接发给 AI 它可能理解不准，翻译成"稳健型""平衡型""进取型"更符合 AI 的训练语料习惯。
 *
 * @param profile 用户画像数据
 * @returns 用户提示词字符串
 */
export function buildUserPrompt(profile: Profile): string {
  // 风险偏好的中英文映射表。用映射表而非 if-else，扩展新选项时只需加一行
  const riskMap: Record<string, string> = {
    low: '稳健型（低风险、回本快、不囤货）',
    medium: '平衡型（适度投入、有成长空间）',
    high: '进取型（可接受前期投入和较长回报周期）',
  }

  // 把技能数组拼接成中文顿号分隔的字符串；如果用户没选技能，给个默认文案避免空值
  // 优先使用 skillLabels（中文名称），没有则回退到 skills 原始值
  const skillsText = profile.skills.length > 0
    ? (profile.skillLabels && profile.skillLabels.length > 0
        ? profile.skillLabels.join('、')
        : profile.skills.join('、'))
    : '暂无明确技能'

  return `请根据以下用户画像生成 3 个个性化副业方案：

- 技能特长：${skillsText}
- 每日可投入时间：${profile.availableHours} 小时
- 期望月收入：${profile.incomeGoal} 元
- 风险偏好：${riskMap[profile.riskTolerance] || profile.riskTolerance}
- 启动资金：${profile.budget} 元

请确保 3 个方案都与上述画像高度匹配，操作指南可落地执行。`
}
