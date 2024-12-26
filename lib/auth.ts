
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: 15000,
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
      console.log('token: ', token);
      // if (session?.user) {
      //   session.user.id = token.sub as string;
      // }
      return session;
    },
  },
};

