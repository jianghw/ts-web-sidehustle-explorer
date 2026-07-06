/**
 * @file tailwind.config.js —— TailwindCSS 配置
 * @description TailwindCSS 是一个"原子化 CSS"框架，提供了大量预设的样式类名（如 flex、text-center），
 *              在 HTML 里直接写类名就能完成排版，不用手写 CSS。
 *              这个文件配置了：扫描哪些文件来生成样式、自定义品牌色/字体/阴影、启用的插件。
 */

// @type-check 注释：告诉编辑器对这个文件做类型检查，import('tailwindcss').Config 是 Tailwind 的配置类型
// 这样写配置时有自动补全，能避免拼错配置项名称
/** @type {import('tailwindcss').Config} */
export default {
  // content：告诉 Tailwind 去扫描哪些文件，从中提取用到的类名，只生成用到的样式（Tree-shaking 机制）。
  // 不配置的话 Tailwind 不知道去哪找类名，最终打包的 CSS 会缺失样式或包含全部样式导致体积过大
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  // theme.extend：在 Tailwind 默认主题基础上扩展自定义样式。
  // 用 extend 而非直接覆盖，是为了保留默认值（如默认的蓝色、间距等仍然可用）
  theme: {
    extend: {
      // 自定义品牌色系。定义后就能用 bg-brand-500、text-brand-600 等类名，
      // 比每次写十六进制颜色方便，也保证全站配色统一
      colors: {
        brand: {
          50: '#f3f0ff',   // 最浅，用于背景底色
          100: '#e9e3ff',
          200: '#d6ccff',
          300: '#b8a4ff',
          400: '#9b78ff',
          500: '#7c4dff',  // 主色调，用于按钮、强调元素
          600: '#6b3fe6',
          700: '#5a32c4',
          800: '#4a2aa0',
          900: '#3d2580',  // 最深，用于深色背景或文字
        },
      },
      // 自定义字体族。优先使用 Inter（英文优美的无衬线字体），
      // 没有就用系统字体；中文环境优先苹方（macOS）和微软雅黑（Windows）
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      // 自定义阴影效果。card 用于卡片默认状态，card-hover 用于鼠标悬停时的强调效果
      boxShadow: {
        // 卡片默认阴影：很轻微，营造层次感但不喧宾夺主
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        // 悬停阴影：更大更明显，且带品牌色光晕，吸引用户注意
        'card-hover': '0 8px 24px -4px rgb(124 77 255 / 0.18)',
      },
    },
  },
  // 插件列表：目前没有使用额外插件，留空数组
  plugins: [],
}
