import Providers from "@/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// `next/font/google` is used to load Google fonts in an optimized Next.js way.
// We use it so fonts load faster and the UI looks more polished.
// Load the main fonts once so every page can use the same style.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load the monospace font for code-like text if needed.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// `metadata` is a Next.js feature used for page title and description.
// We use it so the browser tab and SEO data are managed in a clean built-in way.
// This metadata is used by Next.js for the browser title and page description.
export const metadata: Metadata = {
  title: "SkillSpill | Share and Discover Skills",
  description: "Manage your skills",
};

/**
 * RootLayout is the top-level wrapper for the whole app.
 * It sets the HTML structure, global fonts, and toast notifications.
 * In Next.js App Router, every page is placed inside this root layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Toaster shows small popup messages anywhere in the app. */}
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
