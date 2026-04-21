import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saaviya – Women's Fashion Store",
    short_name: "Saaviya",
    description: "Shop the latest women's fashion at Saaviya. Dresses, tops, kurtas and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9f523a",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/saaviya_icon_48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/saaviya_icon_64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/saaviya_icon_128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/saaviya_icon_192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/saaviya_icon_256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/saaviya_icon_512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/saaviya_icon_1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
