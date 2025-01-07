// 获取博客访问量
export const getBlogVisits = async (blog_id: string) => {
  return fetch(`/api/blogs?blog_id=${blog_id}`, {
    method: 'GET',
  }).then(res => res.json());
};
// 记录博客访问量
export const postBlogVisits = async (blog_id: string) => {
  return fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blog_id })
  }).then(res => res.json());
};