import type { Profile } from './types'

/**
 * System Prompt：定义 AI 角色与输出结构规范
 * 决定方案质量的核心，3 个方案需差异化（稳赚型/成长型/爆发型）
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
 * User Prompt：把用户画像拼装成结构化输入
 */
export function buildUserPrompt(profile: Profile): string {
  const riskMap: Record<string, string> = {
    low: '稳健型（低风险、回本快、不囤货）',
    medium: '平衡型（适度投入、有成长空间）',
    high: '进取型（可接受前期投入和较长回报周期）',
  }

  const skillsText = profile.skills.length > 0 ? profile.skills.join('、') : '暂无明确技能'

  return `请根据以下用户画像生成 3 个个性化副业方案：

- 技能特长：${skillsText}
- 每日可投入时间：${profile.availableHours} 小时
- 期望月收入：${profile.incomeGoal} 元
- 风险偏好：${riskMap[profile.riskTolerance] || profile.riskTolerance}
- 启动资金：${profile.budget} 元

请确保 3 个方案都与上述画像高度匹配，操作指南可落地执行。`
}
