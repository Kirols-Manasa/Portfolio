 "use client";

import { useEffect } from "react";
import { TRPCReactProvider } from "@/trpc/react";
import Header from "@/layout/Header/Header";
import SmoothScroll from "@/LinesScroll";
import CustomScrollbar from "@/CustomScrollbar";
import GridOverlay from "@/GridOverlay";
import Intro, { IntroProvider, useIntro } from "@/intro";
import LayoutContent from "@/LayoutContent";
import Footer from "@/sections/Footer/Footer";

function ScrollRestoration() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { introComplete } = useIntro();

  return (
    <div
      style={{
        visibility: introComplete ? "visible" : "hidden",
        opacity: introComplete ? 1 : 0,
        transition: introComplete ? "opacity 0.3s ease-in-out" : "none",
        pointerEvents: introComplete ? "auto" : "none",
        position: introComplete ? "relative" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollRestoration />
      <TRPCReactProvider>
        <IntroProvider>
          <Intro />
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
    </>
  );
}