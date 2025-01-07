import Link from 'next/link';
import Layout from '../../components/Layout/index.app';
import { getSortedPostsData } from '../lib/posts';

import utilStyles from '../../styles/utils.module.css';
import Date from '../../components/Date';

type PostsProps = {
  id: string;
  [key: string]: any;
}[]

export default async function Home() {
  const allPostsData: PostsProps = await getSortedPostsData();
  return <Layout home>
    <section className="text-2xl font-bold mb-4">
      <p>Hao's Blog</p>
    </section>
    <ul className='list-none'>
      {allPostsData.map(({ id, date, title }) => (
        <li className={utilStyles.listItem} key={id}>
          <Link href={`/blog/posts/${id}`} className='text-black dark:text-white'>
            <span>{title}</span>
          </Link>
          <br />
          <small className={utilStyles.lightText}>
            <Date dateString={date} />
          </small>
        </li>
      ))}
    </ul>
  </Layout>
}