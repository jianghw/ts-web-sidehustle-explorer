/**
 * 文件用途：问卷页里"查看更多职业"的入口链接。
 *
 * 显示在技能多选题（SkillSelect）的下方。问卷默认只列了 12 个常用技能，
 * 如果用户想选的不在里面，可以点这个链接跳到"职业浏览页"（/careers），
 * 按分类浏览全部职业并勾选，选好后会带回问卷页自动填入技能栏。
 *
 * 样式做成低调的文字链接（不是大按钮），避免喧宾夺主——
 * 它是技能选择的"补充入口"，主入口仍是上方的技能标签网格。
 */

// useNavigate：React Router 提供的编程式跳转钩子，点击后跳到职业浏览页
import { useNavigate } from 'react-router-dom'
// ArrowRight：向右箭头图标，提示"点击前往"
import { ArrowRight } from 'lucide-react'

export function CareerBrowserLink() {
  // 获取跳转方法
  const navigate = useNavigate()

  return (
    // 用 button 而非 a 标签：因为这是应用内的无刷新跳转，用按钮更语义化
    // type="button" 防止在表单里被当成提交按钮
    <button
      type="button"
      onClick={() => navigate('/careers')}
      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition hover:text-brand-700 hover:underline"
    >
      查看更多职业 <ArrowRight size={14} />
    </button>
  )
}
