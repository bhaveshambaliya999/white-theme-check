"use client";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function ScrollTopBehaviour() {
  const router = useRouter();
  const positions = useRef({});

  useEffect(() => {
    if (!router) return;

    const saveScroll = (url) => {
      positions.current[url] = window.scrollY;
    };

    const handleRouteChangeStart = (url) => {
      saveScroll(router.asPath);
    };

    const handleRouteChangeComplete = (url) => {
      const y = positions.current[url] ?? 0;
      window.scrollTo(0, y);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    window.addEventListener("beforeunload", () => saveScroll(router.asPath));

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      window.removeEventListener("beforeunload", () =>
        saveScroll(router.asPath)
      );
    };
  }, [router]);
}
