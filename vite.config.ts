/**
 * @file vite.config.ts —— Vite 构建工具配置
 * @description Vite 是这个前端项目的构建工具和开发服务器。
 *              这个文件配置了：React 支持、路径别名、开发服务器端口和 API 代理。
 *              开发时运行 `npm run dev` 就会读取这个配置启动服务。
 */

// defineConfig：Vite 提供的辅助函数，作用是给配置对象提供 TypeScript 类型提示，
// 这样写配置时有自动补全和错误检查，不用死记配置项名称
import { defineConfig } from 'vite'
// @vitejs/plugin-react：Vite 官方的 React 插件，让 Vite 能编译 JSX/TSX 语法，
// 并提供 React Fast Refresh（热更新）能力——改代码后浏览器自动刷新且不丢失组件状态
import react from '@vitejs/plugin-react'
// node:path：Node.js 内置的路径处理模块，这里用来把相对路径转成绝对路径
import path from 'node:path'

export default defineConfig({
  // 插件列表：Vite 通过插件扩展功能。这里启用 React 插件以支持 React 项目开发
  plugins: [react()],

  // 路径解析配置
  resolve: {
    alias: {
      // 把 '@' 设置为 src 目录的别名。
      // 这样在代码里写 import xxx from '@/components/Foo'
      // 就等同于 import xxx from 'src/components/Foo'，
      // 避免写一堆 ../../../ 的相对路径，代码更整洁、重构时也方便
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 开发服务器配置（仅影响本地开发，不影响生产构建）
  server: {
    // 前端开发服务器端口。5173 是 Vite 的默认端口
    port: 5173,
    // API 代理配置：解决开发时的跨域问题
    proxy: {
      // 当前端请求以 /api 开头的地址时（如 /api/generate），
      // Vite 不会直接处理，而是把请求转发到 target 指定的后端地址
      '/api': {
        // 目标后端地址：本地开发服务器（_dev.ts 启动的 3001 端口）
        target: 'http://localhost:3001',
        // changeOrigin: true 会把请求头里的 Host 改成目标地址，
        // 这样后端收到的请求看起来就像直接访问它，不会被跨域策略拦截
        changeOrigin: true,
      },
    },
  },
})
