
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase, upsertRecord } from "./supabase";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { data, error } = await supabase
          .from('user')
          .select('*')
          .eq('username', credentials!.username)

        if (error) {
          throw new Error(error.message);
        }

        const user = data?.[0];
        // const user = await getUserByUsername(credentials.username);
        if (!user) {
          throw new Error('用户不存在');
        }
        if (user.password !== credentials!.password) {
          throw new Error('密码错误');
        }
        const result = {
          name: user.username,
          image: user.avatar,
          email: user.email,
          id: user.id.toString(), // 会转变成token的sub
          provider: 'credentials',
        };
        
        return result;

      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: 30000,
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          provider: 'github',
        }
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
    async jwt({ token, user, account }) {  
      return {
        ...token,
        // id: user?.id ?? token.id,
        provider: token.provider || account?.provider,
      };
    },
    async session({ session, token, user }) {
      if (token.provider === 'github') {
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
      }
      if (session.user) {
        // @ts-ignore
        session.user.provider = token.provider;
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

