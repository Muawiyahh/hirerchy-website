import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // The client portal is a self-contained static app living in
      // public/portal/. Serve it at the clean URL /portal (its <base href>
      // makes all its own assets resolve under /portal/).
      { source: "/portal", destination: "/portal/index.html" },
    ];
  },
};

export default nextConfig;
