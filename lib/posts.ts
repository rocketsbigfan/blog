import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark} from 'remark'
import html from 'remark-html'

// 获取posts目录
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // 获取posts目录下的所有文件名
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 从文件名中移除".md"以获取id
    const id = fileName.replace(/\.md$/, '');

    // 读取markdown文件为字符串
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用gray-matter解析元数据部分
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });
  // 按日期排序
  return allPostsData.sort((a: any, b: any) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: { id: fileName.replace(/\.md$/, '') },
    };
  });
}
