/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async rewrites() {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'miamenu.online';
    return {
      beforeFiles: [
        // bistro.miamenu.online/* → /menu/bistro/*
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: `(?<slug>[^.]+)\\.${rootDomain.replace('.', '\\.')}`,
            },
          ],
          destination: '/menu/:slug/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
