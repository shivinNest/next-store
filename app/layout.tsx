import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Saaviya – Women's Fashion Store",
    template: "%s | Saaviya",
  },
  description:
    "Shop the latest women's fashion at Saaviya. Dresses, tops, kurtas and more with free delivery above ₹999.",
  keywords: ["women's clothing", "Indian fashion", "online shopping", "saaviya", "dresses", "tops", "kurtas"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/saaviya_icon_16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/saaviya_icon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/saaviya_icon_48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/saaviya_icon_64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/saaviya_icon_128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/saaviya_icon_256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [
      { url: "/icons/saaviya_icon_128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/saaviya_icon_192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/saaviya_icon_256.png", sizes: "256x256", type: "image/png" },
      { url: "/icons/saaviya_icon_512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/icons/favicon.png", type: "image/png" }],
    other: [
      { rel: "apple-touch-icon", url: "/icons/saaviya_icon_192.png" },
    ],
  },
  openGraph: {
    siteName: "Saaviya",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          async
        />
      </body>
    </html>
  );
}
