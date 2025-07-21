import { NextRequest, NextResponse } from "next/server";
// 位置变动，需要重启
export function middleware(req: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  const end = Date.now();

  console.log(`Request to ${req.url} took ${end - start}ms`);
  
  return response;
}

export const config = {
  matcher: ["/api/test/:path*"],
};
