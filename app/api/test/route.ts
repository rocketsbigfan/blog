import { NextResponse } from "next/server";

export async function GET () {
  try {
    // 模拟获取数据
    const data = {
      message: 'Hello, this is a test response from the API!'
    };
    
    // 返回 JSON 响应
    return NextResponse.json(data, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // 错误处理
    return NextResponse.json(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}