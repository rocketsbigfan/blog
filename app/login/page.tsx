"use client";

import { useAction } from "next-safe-action/hooks";
import { loginAction } from "@/_actions/auth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { execute, result, status, ...other } = useAction(loginAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push("/"); // 登录成功后跳转
      }
    },
  });

  return (
    <div className="
      flex justify-center items-center h-screen w-[400px]  max-sm:!w-full mx-auto
    ">
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
        className="w-full px-4"
      >
        <div>
          <div className="text-md text-black dark:text-white">
            <label htmlFor="username">用户名</label>
          </div>
          <Input
            type="text"
            name="username"
            id="username"
            required
            className="dark:text-black"
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
          <div className="text-md text-black dark:text-white">
            <label htmlFor="password">密码</label>
          </div>
          <Input
            type="password"
            name="password"
            id="password"
            required
            className="dark:text-black"
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
    </div>
  );
} 