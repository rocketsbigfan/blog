import React from 'react'
import styles from './index.module.css';
import utilStyles from '../../styles/utils.module.css';
import Head from 'next/head';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

const name = 'Harden';
export const siteTitle = 'Hao\'s Blog test';

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <div>
            <img
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </div>
        ) : (
          <div>
            <Link href="/">
              <img
                src="/images/profile.jpg"
                className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                alt={name}
              />
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <span className={utilStyles.colorInherit}>{name}</span>
              </Link>
            </h2>
          </div>
        )}
        <ThemeToggle />
      </header>
      <main>
        {children}
      </main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <span>← Back to home</span>
          </Link>
        </div>
      )}
    </div>
  )
}
