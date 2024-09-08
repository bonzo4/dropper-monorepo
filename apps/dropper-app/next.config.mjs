import path from 'path';
const __dirname = path.resolve();


/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
     transpilePackages: ["@repo/ui", "@repo/app-types"],
    experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
            {
                protocol: "https",
                hostname: "loremflickr.com",

        },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
        },
        {
            
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
            pathname: '/avatars/**',
            },
            {
            protocol: 'https',
            hostname: 'pmlweoiqgtcwuxpclgql.supabase.co',
            port: '',
            pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: "pbs.twimg.com",
                port: "",
                pathname: "/profile_images/**",
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/a/**',
            }
        ],
    },
};

export default nextConfig;
