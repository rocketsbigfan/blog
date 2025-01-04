
import ImageWithZoom from '@/components/ImageWithZoom';
import MDLink from '@/components/MDLink';
import Markdown from 'react-markdown';
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";

import '@/styles/rehype-prism-plus.css';

export default function Article({ content }: { content: string }) {
  return (
    content ? <article className='prose dark:prose-invert !max-w-full'>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrism]}
        components={{
          img: ImageWithZoom,
          a: MDLink,
        }}
      >
        {content}
      </Markdown>
    </article> : null
  );
}
