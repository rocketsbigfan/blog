import Head from 'next/head';
import { useRouter } from 'next/router';
import { MDXRemote } from "next-mdx-remote/rsc";
import Markdown from 'react-markdown';
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from 'react';

import Layout from '../../components/Layout'
import Date from '../../components/Date';
import ImageWithZoom from '../../components/ImageWithZoom';
import MDLink from '../../components/MDLink';
import { getAllPostIds, getPostData } from '../../lib/posts';
import { getBlogVisits, postBlogVisits } from '../../lib/api';

import utilStyles from '../../styles/utils.module.css';

export default function Post({ postData }: {
  postData: {
    id: string;
    title: string;
    date: string;
    content: string;
    contentHtml: string;
    readTime: string;
  }
}) {
  const [blogVisits, setBlogVisits] = useState(0);
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  useEffect(() => {
    postBlogVisits(postData.id)
    getBlogVisits(postData.id).then(res => {
      setBlogVisits(res.length);
    })
  }, [])
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <h1 className={utilStyles.headingXl}>{postData.title}</h1>
      <div className="text-gray-500 flex justify-between">
        <Date dateString={postData.date} />
        <div>
          <span className="ml-2 text-sm">{postData.readTime ? `建议阅读时间：${postData.readTime}` : ''}</span>
          <span className="ml-2 text-sm">访问量：{blogVisits}</span>
        </div>
      </div>
      <article className='prose dark:prose-invert !max-w-full'>
        {/* <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} /> */}
        {/* <MDXRemote
          // source={postData.content}
          // options={{
          //   parseFrontmatter: true,
          //   // mdxOptions: {
          //   //   remarkPlugins: [remarkGfm as any],
          //   //   rehypePlugins: [rehypePrism as any],
          //   // },
          // }}
        /> */}
        {/* <MDXRemote
          source={postData.content}
        /> */}
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypePrism]}
          components={{
            img: ImageWithZoom,
            a: MDLink,
          }}
        >
            {postData.content}
        </Markdown>
      </article>
    </Layout>
  )
}
// 获取所有文章的id
export async function getStaticPaths() {
  // 获取所有文章的id
  const paths = await getAllPostIds();
  return {
    paths,
    // true 表示在构建时不会生成所有路径，而是在运行时动态生成 ISG
    fallback: false, // 预构建，如果路径不存在，则返回404
  };
}
// 获取文章数据
export async function getStaticProps({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);
  return {
    props: { postData },
    revalidate: 1, // 1秒后重新生成页面
  };
}