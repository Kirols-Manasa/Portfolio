 import "@/styles/globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import ClientLayout from "./client-layout";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-bricolage",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Kirol's Portfolio | Full Stack Developer",
  description:
    "Kirol Manasa — Full Stack Developer specializing in building modern web applications. Check out my projects, skills, and experience.",
  authors: [{ name: "Kirol Manasa" }],
  robots: { index: true, follow: true },
  themeColor: "#E21B23",
  metadataBase: new URL("https://kirolmanasa.com"),
  keywords: [
    "Kirol Manasa",
    "Kirol Manasa Developer",
    "Kirol Manasa Portfolio",
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
    title: "Kirol's Portfolio | Full Stack Developer",
    description:
      "Kirol Manasa — Full Stack Developer specializing in building modern web applications. Check out my projects, skills, and experience.",
    images: [{ url: "/mata2.png", width: 1200, height: 630 }],
    type: "website",
    url: "https://kirolmanasa.com",
    siteName: "Kirol's Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirol's Portfolio | Full Stack Developer",
    description:
      "Kirol Manasa — Full Stack Developer specializing in building modern web applications. Check out my projects, skills, and experience.",
    images: ["/mata2.png"],
    creator: "@kirolmanasa",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "https://kirolmanasa.com",
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