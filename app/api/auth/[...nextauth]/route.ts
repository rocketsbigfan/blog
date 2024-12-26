import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
// /api/auth/callback 处理认证回调
// /api/auth/signin 处理登录
// /api/auth/signout 处理登出
// /api/auth/session 获取session等等
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);

