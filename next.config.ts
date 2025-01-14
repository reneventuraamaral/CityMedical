import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

export default nextConfig;

module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora erros do ESLint durante o build
  },
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Ajuste conforme necessário
    },
  },
};
module.exports = nextConfig;