import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../app/lib/posts';
import Link from 'next/link';
import Date from '../components/Date';
import Layout from '../components/Layout';
import { useState } from 'react';

interface HomeProps {
  allPostsData: {
    id: string;
    [key: string]: any;
  }[];
}

export default function Home({ allPostsData }: HomeProps) {

  // const [open, setOpen] = useState(false);
  // console.log('open: ', open);

  return (
    <Layout home>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
      </Head>

      <section className="text-2xl font-bold mb-4">
        <p>Hao's Blog</p>
      </section>

      <main>
        {allPostsData.map(({ id, date, title }) => (
          <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`} className='text-link dark:text-white'>
              <span>{title}</span>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
        ))}
      </main>

    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
