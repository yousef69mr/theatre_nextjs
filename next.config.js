/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // output: process.env.NEXT_OUTPUT_MODE,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
                pathname: '/**', // This is a wildcard pattern that matches all paths
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                pathname: '/**', // This is a wildcard pattern that matches all paths
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**', // This is a wildcard pattern that matches all paths
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**', // This is a wildcard pattern that matches all paths
            },
        ],
    }
}

module.exports = nextConfig
