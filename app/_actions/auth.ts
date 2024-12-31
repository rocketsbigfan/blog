import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { flattenValidationErrors } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";

export const action = createSafeActionClient({
  validationAdapter: zodAdapter()
});

const loginSchema = z.object({
  username: z.string().min(3, "用户名至少3位"),
  password: z.string().min(6, "密码至少6位")
});

export const loginAction = action
  .schema(loginSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors
  })
  .action(async ({ parsedInput: data }) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "登录失败" };
    }
  }); 