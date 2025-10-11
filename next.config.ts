import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  distDir: 'build', // Changes the build output directory to `build`
}

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);