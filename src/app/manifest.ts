import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vex — Career Readiness",
    short_name: "Vex",
    description: "From sign-up to interview-ready in 24 hours.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f6f1e6",
    theme_color: "#f6f1e6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
