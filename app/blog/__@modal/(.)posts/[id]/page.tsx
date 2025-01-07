import Date from "@/components/Date";
import Modal from "@/components/Modal";
import { getPostData } from "@/lib/posts";
import Article from "@/blog/posts/[id]/components/article";
import View from "@/blog/posts/[id]/components/view";
import { PostData } from "@/blog/posts/[id]/page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const postData: PostData = await getPostData(id);

  return <Modal 
    open={true}
    title={postData.title}
    routerBack
  >
    <div className="text-gray-500 flex justify-between">
      <Date dateString={postData.date as string} />
      <div>
        <span className="ml-2 text-sm">{postData.readTime ? `建议阅读时间：${postData.readTime}` : ''}</span>
        <View id={id} />
      </div>
    </div>
    <Article content={postData.content} />
  </Modal>;
}
