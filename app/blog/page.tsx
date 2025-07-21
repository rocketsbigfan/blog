import Link from 'next/link';
import Layout from '../../components/Layout/index.app';
import { getSortedPostsData } from '../lib/posts';

import utilStyles from '../../styles/utils.module.css';
import Date from '../../components/Date';
import Image from 'next/image';
import { title } from 'process';


type PostsProps = {
  id: string;
  [key: string]: any;
}[]

const Example = [
  {
    id: 'azen',
    link: 'https://azenprotocol.io/',
    src: '/images/example/azen.png',
    title: 'Azen Protocol'
  },
  {
    id: 'shuzi',
    link: 'https://shuzi.art/',
    src: '/images/example/shuzi.png',
    title: 'Shuzi Art'
  }
]

export default async function Home() {
  const allPostsData: PostsProps = await getSortedPostsData();
  return <Layout home>
    <section className="text-2xl font-bold mb-4">
      <p>Harden's Blog</p>
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

    {/* example */}
    <section className='text-2xl font-bold mb-4'>
      <p>Example</p>
    </section>

    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 '>
      {Example.map(({ id, link, src, title }) => (
        <div key={id} className='group '>
          <Link href={link} target='_blank' className='hover:no-underline'>
            <div className='relative rounded-lg h-[200px] overflow-hidden bg-[#181818]'>
              <img
                src={src}
                alt={id}
                className='group-hover:scale-125 absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover transform transition-transform duration-300 ease-in-out'
              />
            </div>
            <h3 className='mt-2 text-black ' >{title}</h3>
          </Link>
        </div>))}
    </div>

  </Layout>
}