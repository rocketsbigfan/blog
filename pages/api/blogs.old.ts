import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase"; // 导入 Supabase 客户端

// API 路由处理函数
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 处理 GET 请求，返回博客文章列表
  if (req.method === "GET") {
    try {
      // 从 Supabase 获取数据
      const { data, error } = await supabase.from("blog_visits").select("*").eq("blog_id", req.query.blog_id as string);
      // 如果查询出错，返回 500 错误
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // 返回获取到的博客数据
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
  // 处理 POST 请求，添加访问记录
  else if (req.method === "POST") {
    const ip_address =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const { blog_id } = req.body;
    const user_agent = req.headers["user-agent"] || null;
    // 检查请求体中的 blog_id 和 user_ip 是否存在
    if (!blog_id) {
      return res
        .status(400)
        .json({ error: "Blog ID are required" });
    }

    try {
      // 向 Supabase 插入一条访问记录
      const { data, error } = await supabase
        .from("blog_visits")
        .insert({
          blog_id: blog_id as string,
          ip_address: typeof ip_address === 'string' ? ip_address : null,
          user_agent
        });

      // 如果插入过程中出现错误，返回 500 错误
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // 返回插入的数据
      return res.status(201).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
  // 处理其他 HTTP 方法，返回 405 错误
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
