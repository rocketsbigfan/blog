---
title: Next.js 开发小记 —— 从零开始的博客开发之旅
date: "2024-03-19"
---

## 前言

最近在使用 Next.js 重构个人博客，从技术选型到开发部署，经历了一段有趣的学习过程。在这里记录一下使用 Next.js 开发过程中的一些心得体会。
本站使用的是 Page Router。

## 为什么选择 Next.js？

在选择技术栈时，我考虑了以下几个方面：

1. **开发体验** - 基于 React 生态，拥有强大的组件化开发能力
2. **性能** - 支持 SSR/SSG，对搜索引擎友好
3. **部署便利** - 可以轻松部署到 Vercel 平台
4. **文件系统路由** - 直观的路由组织方式

## 开发过程中的一些亮点

### 1. 文件系统路由

Next.js 的文件系统路由让项目结构非常清晰。比如：

- `pages/index.tsx` 对应首页
- `pages/posts/[id].tsx` 对应文章详情页
- `pages/about.tsx` 对应关于页面

### 2. 数据获取

Next.js 提供了多种数据获取方式：

- `getStaticProps` - 构建时获取数据
- `getStaticPaths` - 生成动态路由
- `getServerSideProps` - 服务端渲染时获取数据

### 3. 图片优化

使用 Next.js 内置的 Image 组件可以自动实现：

- 图片懒加载
- 自动适配不同设备尺寸
- WebP 格式转换

### 4. API 路由实现

Next.js 的 API 路由让我们可以轻松创建后端 API。以下是本项目的一些实践：

#### 基础响应结构

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  code: number;
  data?: T;
  message?: string;
}
// lib/response.ts
export const successResponse = <T>(data: T): ApiResponse<T> => ({
  code: 0,
  data
})
export const errorResponse = (message: string): ApiResponse => ({
  code: 1,
  message
})
```

#### 错误处理中间件

```typescript
// middleware/api.ts
import { NextApiHandler } from 'next'
export function withErrorHandler(handler: NextApiHandler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error(error)
      res.status(500).json(errorResponse('服务器内部错误'))
    }
  }
}
```

#### 文章详情 API

```typescript
// pages/api/posts/[id].ts
import { withErrorHandler } from '@/middleware/api'
import { prisma } from '@/lib/prisma'
const handler = async (req, res) => {
  const { id } = req.query
  const post = await prisma.post.findUnique({
    where: { id: String(id) }
  })
  if (!post) {
    return res.status(404).json(errorResponse('文章不存在'))
  }
  res.status(200).json(successResponse(post))
}
export default withErrorHandler(handler)
```

### 5. Supabase 集成

本项目使用 Supabase 作为后端服务，提供数据库和认证功能。

#### Supabase 客户端配置

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 数据操作示例

```typescript
// pages/api/blogs.ts
// 获取博客访问量
export const getBlogVisits = async (blog_id: string) => {
  return fetch(`/api/blogs?blog_id=${blog_id}`, {
    method: 'GET',
  }).then(res => res.json());
};
// 记录博客访问量
export const postBlogVisits = async (blog_id: string) => {
  return fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blog_id })
  }).then(res => res.json());
};
```

```typescript
// pages/api/blogs.tsimport { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase"; // 导入 Supabase 客户端

// API 路由处理函数
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 处理 GET 请求，返回博客文章列表
  if (req.method === "GET") {
    try {
      // 从 Supabase 获取数据
      const { data, error } = await supabase.from("blog_visits").select("*").eq("blog_id", req.query.blog_id);
      // 如果查询出错，返回 500 错误
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // 返回获取到的博客数据
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
  // 处理 POST 请求，添加访问记录
  else if (req.method === "POST") {
    const ip_address =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const { blog_id } = req.body;
    const user_agent = req.headers["user-agent"] || null;
    // 检查请求体中的 blog_id 和 user_ip 是否存在
    if (!blog_id) {
      return res
        .status(400)
        .json({ error: "Blog ID are required" });
    }

    try {
      // 向 Supabase 插入一条访问记录
      const { data, error } = await supabase
        .from("blog_visits") // 假设访问记录存储在 'blog_visits' 表中
        .insert([{ blog_id, ip_address, user_agent }]); // 记录当前时间作为访问时间

      // 如果插入过程中出现错误，返回 500 错误
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // 返回插入的数据
      return res.status(201).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
  // 处理其他 HTTP 方法，返回 405 错误
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

```

## 遇到的挑战

1. **TypeScript 类型定义** - 需要花时间熟悉 Next.js 的类型系统
2. **构建优化** - 需要注意代码分割和资源优化
3. **部署配置** - 需要了解不同部署平台的特性
4. **Supabase 类型安全** - 需要正确配置和使用 Supabase 的类型定义
5. **数据关系处理** - 在 Supabase 中处理表之间的关系

## 后续计划

1. 添加更多交互功能
2. 优化加载性能
3. 添加评论系统
4. 优化移动端体验
5. 添加实时评论功能

## 总结

Next.js 是一个非常优秀的 React 框架，特别适合构建现代化的网站。虽然学习曲线稍陡，但带来的开发体验和性能优势值得投入时间学习。
