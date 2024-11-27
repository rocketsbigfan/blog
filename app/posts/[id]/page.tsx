import Date from "@/components/Date";
import Layout from "@/components/Layout/index.app";

import View from "./components/view";
import Article from "./components/article";

import { getAllPostIds, getPostData } from "@/lib/posts";

import utilStyles from '@/styles/utils.module.css';

export type PostData = {
  id?: string;
  title?: string;
  date?: string;
  content: string;
  contentHtml: string;
  readTime: string;
}
// 禁用动态参数
export const dynamicParams = false;

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const postData: PostData = await getPostData(id);

  return {
    title: `${postData.title}`,
  }
}

export const generateStaticParams = async () => {
  const paths = await getAllPostIds();
  return paths.map((params) => ({ id: params.params.id }));
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const postData: PostData = await getPostData(id);

  return <Layout>
    <h1 className={utilStyles.headingXl}>{postData.title}</h1>
    <div className="text-gray-500 flex justify-between">
      <Date dateString={postData.date as string} />
      <div>
        <span className="ml-2 text-sm">{postData.readTime ? `建议阅读时间：${postData.readTime}` : ''}</span>
        <View id={id} />
      </div>
    </div>
    <Article content={postData.content} />
  </Layout>
}