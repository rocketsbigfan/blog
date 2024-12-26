/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-mdx-remote'],
  images: {
    domains: ['avatars.githubusercontent.com'], // 添加github头像服务的域名
  },
};



export default nextConfig;