import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1748684279006.cluster-c3a7z3wnwzapkx3rfr5kz62dac.cloudworkstations.dev',
      // Add other specific origins if needed, for example, the one from the logs
      // Note: Be cautious with adding origins. Only add trusted development origins.
    ],
  },
};

export default nextConfig;
