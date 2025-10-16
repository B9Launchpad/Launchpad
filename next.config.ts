import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  distDir: 'build', // Changes the build output directory to `build`
  trailingSlash: true,  
}

export default nextConfig;