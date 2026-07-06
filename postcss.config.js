/**
 * @file postcss.config.js —— PostCSS 配置
 * @description PostCSS 是一个 CSS 后处理工具，在 CSS 写完之后自动做优化和兼容性处理。
 *              这个文件配置了两个插件：TailwindCSS 和 Autoprefixer。
 *              Vite 会自动读取这个文件，在构建时对 CSS 做后处理。
 */

export default {
  // 插件配置：PostCSS 会按顺序执行这些插件
  plugins: {
    // tailwindcss：把 Tailwind 的指令（如 @tailwind base）编译成实际的 CSS 代码，
    // 并根据 tailwind.config.js 的 content 配置做 Tree-shaking，只保留用到的样式
    tailwindcss: {},
    // autoprefixer：自动给 CSS 属性添加浏览器前缀（如 -webkit-、-moz-）。
    // 比如你写 display: flex，它会自动补成 -webkit-box; -ms-flexbox; flex;
    // 这样不用手动写前缀就能兼容各种浏览器，省心又不出错
    autoprefixer: {},
  },
}
