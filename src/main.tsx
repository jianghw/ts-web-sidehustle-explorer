/**
 * 文件用途：React 应用的入口文件。
 * 它的作用是：把整个网页应用挂载到 HTML 页面中的一个 <div> 上，
 * 让浏览器开始渲染我们的 React 界面。你可以把它理解为"App 的启动按钮"。
 */

// React 核心库。提供 React 运行时的基础能力，这里主要用它的 StrictMode 功能
import React from 'react'
// ReactDOM 的客户端 API，专门用于把 React 组件渲染（显示）到浏览器网页上
import ReactDOM from 'react-dom/client'
// BrowserRouter：React Router 提供的路由容器。
// 让应用支持"前进/后退"和不同网址对应不同页面，且使用的是干净的网址（不带 # 号）
import { BrowserRouter } from 'react-router-dom'
// App 是我们自己写的"根组件"，也就是整个页面的最外层结构
import App from './App'
// 引入全局样式表，让整个应用都有统一的视觉风格（颜色、字体、按钮样式等）
import './styles/index.css'

// createRoot：在页面上找到 id 为 "root" 的那个 <div>，把它作为 React 应用的"根"。
// document.getElementById('root')! 末尾的感叹号告诉 TypeScript：这个元素一定存在，不用担心为空。
// .render(...)：把下面这棵组件树渲染到刚才找到的根节点里。
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode：React 的"严格模式"。它不会影响最终产品，只在开发时帮你发现潜在问题
  // （比如不安全的写法、过时的用法），相当于一个贴心的代码检查员。
  <React.StrictMode>
    {/* BrowserRouter 包裹整个应用，这样内部所有页面才能使用路由跳转功能 */}
    <BrowserRouter>
      {/* App 是整个应用的根组件，里面包含了页面布局和所有子页面 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
