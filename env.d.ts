declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_TAG: string;
    NEXT_PUBLIC_SITE_TITLE: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    // ... 其他环境变量
  }
}