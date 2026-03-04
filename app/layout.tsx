import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/error";
import { SonnerProvider } from "@/components/providers/sonner-provider";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "LearnKeys — Type the news. Learn while you type.",
  description:
    "Improve your typing speed by typing real AI news and current affairs headlines. Monkeytype-inspired, no login required.",
  keywords: ["typing practice", "typing speed", "WPM", "AI news", "current affairs", "monkeytype"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://learnkeys.vercel.app"
  ),
  openGraph: {
    type: "website",
    title: "LearnKeys — Type the news. Learn while you type.",
    description:
      "Improve your typing speed by typing real AI news and current affairs headlines.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnKeys — Type the news. Learn while you type.",
    description:
      "Improve your typing speed by typing real AI news and current affairs headlines.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="font-mono antialiased bg-[#0a0a0a] text-white min-h-screen">
        <ErrorBoundary>
          {children}
          <SonnerProvider />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
