import React from 'react'
import styles from './index.module.css';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import classNames from 'classnames';
const name = 'Harden';
export const siteTitle = 'Hao\'s Blog test';

export default function Layout({ children }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className={classNames(styles.container, 'max-md:!w-full')}>
      <header className="flex justify-between items-center">
        <div>
          <Link href="/">
            <img
              src="/images/profile.jpg"
              className={`w-24 h-24 rounded-full`}
              alt={name}
            />
          </Link>
          <h2 className="text-2xl font-bold">
            <Link className="text-black dark:text-white" href="/">
              <span>{name}</span>
            </Link>
          </h2>
        </div>
        <ThemeToggle />
      </header>
      <main className="mt-4">
        {children}
      </main>
      {/* {!home && (
            <div className="my-12">
              <Link href="/">
                <span>← Back to home</span>
              </Link>
            </div>
          )} */}
    </div>
  )
}
