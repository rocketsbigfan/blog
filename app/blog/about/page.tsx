// 'use client'
import Layout from "../../../components/Layout/index.app"

const About = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6">关于我</h1>
        
        <div className="prose dark:prose-invert">
          <p className="mb-4">
            你好!我是一名前端开发工程师,正在学习nextjs...
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">技术栈</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>前端: React, Next.js, TypeScript, Tailwind CSS</li>
            <li>后端: Node.js, </li>
            <li>其他: Git, </li>
          </ul>
          <h2 className="text-2xl font-bold mt-8 mb-4">联系方式</h2>
          <ul className="list-disc pl-6">
            <li>GitHub: <a href="https://github.com/rocketsbigfan" className="text-blue-500 hover:text-blue-600">@rocketsbigfan</a></li>
            <li>Email: 920520862@qq.com</li>
          </ul>
        </div>
      </div>  
    </Layout>
  )
}

export default About
