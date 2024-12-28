
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { upsertRecord } from "./supabase";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: 30000,
      },
    }),
  ],  
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      await upsertRecord<'user'>('user', {
        sub: token.sub as string
      }, {
        avatar: token.picture as string,
        email: token.email as string,
        username: token.name as string,
      }, {
        avatar: token.picture as string,
        email: token.email as string,
        platform: 'github',
        sub: token.sub as string,
        username: token.name as string,
      }, (operation, data) => {
        console.log('operation: ', operation, data);
      });
      
      return session;
    },
  },
};

