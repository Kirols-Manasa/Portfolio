 import "@/styles/globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import ClientLayout from "./client-layout";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-bricolage",
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Kirols' Portfolio | Full Stack Developer",
  description:
    "Kirols Manasa — Full Stack Developer specializing in building modern web applications. Check out my projects, skills, and experience.",
  authors: [{ name: "Kirols Manasa" }],
  robots: { index: true, follow: true },
  themeColor: "#E21B23",
  metadataBase: new URL("https://kirols-portfolio.vercel.app"),
  keywords: [
  "Kirols Manasa",
"Kirols Manasa Developer", 
"Kirols Manasa Portfolio",
    "Full Stack Developer",
    "Full Stack Developer Egypt",
    "Full Stack Developer Cairo",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Web Developer Portfolio",
    "Frontend Developer Portfolio Egypt",
  ],
  openGraph: {
    title: "Kirols' Portfolio | Full Stack Developer",
    description:
      "Kirols Manasa — Full Stack Developer specializing in building modern web applications. Check out my projects, skills, and experience.",
    images: [{ url: "/mata2.webp", width: 1200, height: 630 }],
    type: "website",
    url: "https://kirols-portfolio.vercel.app",
    siteName: "Kirols' Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirols' Portfolio | Full Stack Developer",
    description:
      "Kirols Manasa — Full Stack Developer specializing in building modern web applications. Check out my projects, skills, and experience.",
    images: ["/mata2.webp"],
    creator: "@kirols Manasa",
  },
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
  alternates: {
    canonical: "https://kirols-portfolio.vercel.app",
  },
  verification: {
    google: "6gbMHsyf9v0uC5eznZfuwomHsuDLYWiTj8nMCK6-GAE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${interTight.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}