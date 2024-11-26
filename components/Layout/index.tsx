import React, { useEffect } from 'react'
import styles from './index.module.css';
import Head from 'next/head';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import classNames from 'classnames';
const name = 'Harden';

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {

  useEffect(() => {

    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    let options = {
      context: context,
      width: w,
      height: h,
      arcCount: 100,
      lineWidth: 1,
      fillStyle: 'rgba(0, 0, 0, .2)',
      strokeStyle: 'rgba(0, 0, 0, .1)'
    }

    // new drawAnimation(options);

  }, []);

  return (
    <>
      <div className={classNames(styles.container, 'max-md:!w-full')}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta
            property="og:image"
            content={`https://og-image.now.sh/${encodeURI(
              process.env.NEXT_PUBLIC_SITE_TITLE
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={process.env.NEXT_PUBLIC_SITE_TITLE} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <header className="flex justify-between items-center">
          {home ? (
            <div>
              <Link href="/about" className="text-black dark:text-white">
                <img
                  src="/images/profile.jpg"
                className={`w-24 h-24 rounded-full`}
                alt={name}
              />
                <h1 className="text-2xl font-bold">{name}</h1>
              </Link>
            </div>
          ) : (
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
          )}
          <ThemeToggle />
        </header>
        <main className="mt-4">
          {children}
        </main>
        {!home && (
          <div className="my-12">
            <Link href="/">
              <span>← Back to home</span>
            </Link>
          </div>
        )}
      </div>
      <canvas id="canvas" className="fixed top-0 left-0 w-full h-full z-[-1]" />
    </>
  )
}
