import React from 'react'
import styles from './index.module.css';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import classNames from 'classnames';
import LoginForm from '../LoginForm';
import { getCurrentUser } from '@/lib/session';
const name = 'Harden';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: 'Learn how to build a personal website using Next.js',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [`https://og-image.now.sh/${encodeURI(
      process.env.NEXT_PUBLIC_SITE_TITLE
    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`],
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    twitter: {
      card: 'summary_large_image',
    },
  },
}

export default function Layout({ children, home }: { children?: React.ReactNode, home?: boolean }) {
  return (
    <>
      <div>
        <Header home={home} />
        <div className={classNames(styles.container, 'max-md:!w-full')}>
          <main className="my-40">
            {children}
          </main>
          {
            !home && (
              <div className="my-12">
                <Link href="/">
                  <span>← Back to home</span>
                </Link>
              </div>
            )
          }
        </div>
      </div >
      <canvas id="canvas" className="fixed top-0 left-0 w-full h-full z-[-1]" />
    </>
  )
}

export async function Header({ home }: { home?: boolean }) {
  const user = await getCurrentUser();

  return (

    <header className="sticky top-0 left-0 w-full py-2 filter backdrop-blur-sm">
      <div className="px-4 flex w-[60vw] max-md:!w-full justify-between items-center mx-auto">
        <Link href={home ? '/about' : '/'} className="text-black dark:text-white">
          <div className="flex items-center">
            <img
              src="/images/profile.jpg"
              className={`w-8 h-8 rounded-full`}
              alt={name}
            />
            <span className="ml-2 text-xl font-bold ">{name}</span>
          </div>
        </Link>
        <div className="flex items-center">
          <ThemeToggle />
          <LoginForm user={user} />
        </div>
      </div>
    </header >
  )
}