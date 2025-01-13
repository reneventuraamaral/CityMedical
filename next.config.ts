import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

export default nextConfig;

module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Ajuste conforme necessário
    },
  },
};
module.exports = nextConfig;