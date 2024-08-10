/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        console.log('rewrites');
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*',
          },
        ]
      },
};



export default nextConfig;
