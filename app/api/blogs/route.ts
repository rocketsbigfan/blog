import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const blog_id = searchParams.get('blog_id')
  if (!blog_id) {
    return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
  } 

  try {
    // 从 Supabase 获取数据
    const { data, error } = await supabase.from("blog_visits").select("*").eq("blog_id", blog_id);
    // 如果查询出错，返回 500 错误
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // 返回获取到的博客数据
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { blog_id } = body;
  if (!blog_id) {
    return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
  }
  try {
    const ip = request.headers.get('x-forwarded-for');
    // 向 Supabase 插入一条访问记录
    const { data, error } = await supabase.from("blog_visits").insert({ blog_id, ip_address: ip, user_agent: request.headers.get('user-agent') });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}