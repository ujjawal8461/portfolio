import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";// existing fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Fixed: Space_Grotesk supports 300–700 only
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"], // 👈 remove 800
});

export const metadata = {
  title: "Ujjawal Singh Solanki | Software Engineer",
  description: "Portfolio of Ujjawal Singh Solanki, a software engineer specializing in React and Next.js.",

  keywords: [
    "Ujjawal Singh Solanki",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Web Developer Portfolio"
  ],

  authors: [{ name: "Ujjawal Singh Solanki" }],

  openGraph: {
    title: "Ujjawal Singh Solanki Portfolio",
    description: "Software engineer portfolio with projects and skills.",
    url: "https://ujjawal-singh-solanki-portfolio.vercel.app/",
    siteName: "Ujjawal Singh Solanki Portfolio",
    images: [
      {
        url: "logo.png",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Suppress hydration warnings caused by differences injected by browser
        // extensions (e.g. Grammarly) or other client-only DOM modifications.
        // Long-term: keep server-rendered output deterministic and move any
        // non-deterministic logic into client components / useEffect.
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
