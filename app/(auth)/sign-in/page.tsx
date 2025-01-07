"use client";

import { useAction } from "next-safe-action/hooks";
import { loginAction } from "@/_actions/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {

  const router = useRouter();
  const { toast } = useToast();
  const { execute, result, status } = useAction(loginAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push("/admin"); // 登录成功后跳转
      }
    },
  });
  const handleLogin = () => {
    signIn('github', { // 登录方法，第一个参数标注平台
      callbackUrl: `${window.location.origin}/admin`, // 设置登录成功后的回调地址
    });
  }

  return (
    <div className="
      flex justify-center items-center h-screen w-[400px]  max-sm:!w-full mx-auto
    ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const input = Object.fromEntries(formData) as {
                username: string;
                password: string;
              };
              await execute(input);
            }}
            className="w-full"
          >
            <div>
              <div className="text-sm text-black dark:text-white">
                <label htmlFor="username">用户名</label>
              </div>
              <Input
                type="text"
                name="username"
                id="username"
                required
                className="dark:text-black"
                placeholder="请输入用户名"
              />
              {
                result?.validationErrors?.['username'] && (
                  <div className="text-red-500 text-sm">
                    {result.validationErrors['username']}
                  </div>
                )
              }
            </div>

            <div className="mt-4">
              <div className="text-sm text-black dark:text-white">
                <label htmlFor="password">密码</label>
              </div>
              <Input
                type="password"
                name="password"
                id="password"
                required
                className="dark:text-black"
                placeholder="请输入密码"
              />
              {
                result?.validationErrors?.['password'] && (
                  <div className="text-red-500 text-sm">
                    {result.validationErrors['password']}
                  </div>
                )
              }
            </div>
            {result?.data?.error && (
              <p className="text-red-500 text-sm">{result.data.error}</p>
            )}
            <Button
              type="submit"
              // disabled={status === "executing"}
              className="w-full mt-6 dark:bg-cyan-500 dark:text-white"
            >
              {/* {status === "executing" ? "登录中..." : "登录"} */}
              登录
            </Button>
          </form>
          <div className="mt-4 mb-4 border-b border-gray-200"></div>
          <Button className="w-full bg-white text-black hover:bg-white/90 dark:text-white flex items-center justify-center border" onClick={handleLogin}>
            <svg className="" fill="currentColor" width="30" height="30" viewBox="0 0 24 24" data-view-component="true">
              <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
            </svg>
            continue with github
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          没有账号？<Link href="/sign-up" className="text-sky-700">注册</Link>
        </CardFooter>
      </Card>
    </div>
  );
} 