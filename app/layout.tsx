import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

// existing fonts
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

export const metadata: Metadata = {
  title: "Ujjawal Singh Solanki | Portfolio",
  description: "An interactive portfolio powered by circuits and light",
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
        {children}
      </body>
    </html>
  );
}
