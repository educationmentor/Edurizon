/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  // experimental:{
  //       esmExternals: 'loose', 
  // },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
     
    return config;
  },
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/my-sitemap',
        permanent: true, // or false depending on your SEO preference
      },
      {
        source: '/sitemap',
        destination: '/api/my-sitemap',
        permanent: true, // or false depending on your SEO preference
      },
      {
        source:'/blogs',
        destination:'/study-destinations?category=Destination',
        permanent:true,
      },
      
    ];
  },
 
};

module.exports = nextConfig;
