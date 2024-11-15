import Head from 'next/head';
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/Date';
import utilStyles from '../../styles/utils.module.css';
import { useRouter } from 'next/router';
export default function Post({ postData }: { postData: { id: string; title: string; date: string; contentHtml: string } }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
  
}

export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    // true 表示在构建时不会生成所有路径，而是在运行时动态生成
    fallback: false, // 预构建，如果路径不存在，则返回404
  };
}
export async function getStaticProps({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);
  return {
    props: { postData },
    revalidate: 1,
  };
}