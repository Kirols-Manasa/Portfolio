 "use client";

import "@/styles/globals.css";

import { useEffect } from "react";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Header from "@/layout/Header/Header";
import SmoothScroll from "@/LinesScroll";
import CustomScrollbar from "@/CustomScrollbar";
import GridOverlay from "@/GridOverlay";
import Intro, { IntroProvider, useIntro } from "@/intro";
import LayoutContent from "@/LayoutContent";
import Footer from "@/sections/Footer/Footer";

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

function ScrollRestoration() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}

// ✅ Component جديد: يخفي كل شيء لما الانترو بيشتغل
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { introComplete } = useIntro();

  return (
    <div
      style={{
        visibility: introComplete ? "visible" : "hidden",
        opacity: introComplete ? 1 : 0,
        transition: introComplete ? "opacity 0.3s ease-in-out" : "none",
        pointerEvents: introComplete ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${interTight.variable}`}>
      <body>
        <ScrollRestoration />
        <TRPCReactProvider>
          <IntroProvider>
            <Intro />
            {/* ✅ كل حاجة هنا مخفية لما الانترو يبدأ */}
            <ContentWrapper>
              <LayoutContent>
                <SmoothScroll>
                  <div className="relative z-10 bg-white dark:bg-neutral-950">
                    <Header />
                    {children}
                  </div>

                  <Footer />

                  <CustomScrollbar />
                  <GridOverlay />
                </SmoothScroll>
              </LayoutContent>
            </ContentWrapper>
          </IntroProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}