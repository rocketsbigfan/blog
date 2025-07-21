import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET (req: NextRequest) {

  const params = req.nextUrl.searchParams
  try {

    if (params.get('id') === 'error') {
      // 模拟错误
      return NextResponse.json(JSON.stringify({error: 'An error occurred'}), {
        status: 502
      })
    }

    // 模拟获取数据
    const data = {
      id: params.get('id')
    };
    // await sleep(300)
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

export async function POST (req: NextRequest) {

  const body = await req.json()
  try {
    // 模拟获取数据
    const data = {
      ...body,
      message: "This is a POST request"
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