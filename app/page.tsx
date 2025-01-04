import Link from 'next/link';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen px-14'>
      <ul className='flex-1 flex flex-col items-center justify-center h-screen px-14'>
        <li className='text-left w-full mb-4'>
          <Link href="/blog" className='text-2xl font-bold text-black dark:text-white'>blog</Link>
        </li>
        <li className='text-left w-full mb-4'>
          <Link href="/admin" className='text-2xl font-bold text-black dark:text-white'>admin</Link>
        </li>
      </ul>
    </div>
  )
}
