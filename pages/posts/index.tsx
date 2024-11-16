import Head from "next/head";
import Link from "next/link";
import Layout from '../../components/Layout';

export default function Posts() {

  return (
    <Layout>
      <Head>
        <title>Posts</title>
      </Head>
      <main>
        <h1 className="text-gray-600">First Post</h1>
        <h2>
          <Link href="/" className="text-[#000]">
            <span>Back to home</span>
          </Link>
        </h2>
      </main>
    </Layout>
  );
}
