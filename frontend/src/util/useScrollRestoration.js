import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

/**
 * Persists window.scrollY on scroll (throttled via requestAnimationFrame)
 * and restores scroll position on POP navigation.
 */
export default function useScrollRestoration() {
  const navType = useNavigationType();
  const location = useLocation();
  const storageKey = `scroll_pos_${location.pathname}`;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 0) {
            try {
              sessionStorage.setItem(storageKey, String(window.scrollY));
            } catch {}
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [storageKey]);

  useLayoutEffect(() => {
    if (navType === "POP") {
      const savedPos = sessionStorage.getItem(storageKey);
      if (savedPos) {
        const targetY = parseInt(savedPos, 10);
        if (!isNaN(targetY) && targetY > 0) {
          const rafId = requestAnimationFrame(() => {
            const prevBehavior = document.documentElement.style.scrollBehavior;
            document.documentElement.style.scrollBehavior = "auto";
            window.scrollTo({ top: targetY, behavior: "instant" });
            document.documentElement.scrollTop = targetY;
            document.documentElement.style.scrollBehavior = prevBehavior;
          });
          return () => cancelAnimationFrame(rafId);
        }
      }
    }
  }, [navType, storageKey]);
}
