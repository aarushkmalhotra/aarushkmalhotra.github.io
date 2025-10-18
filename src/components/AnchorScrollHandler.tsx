"use client";

import { useEffect } from "react";
import { handleHashOnLoad } from "@/lib/scroll-to-anchor";

/**
 * Component that handles automatic scrolling to anchor on page load
 * Should be included in pages that have anchor links
 */
export function AnchorScrollHandler() {
  useEffect(() => {
    // Handle initial hash on page load
    handleHashOnLoad({ duration: 800 });

    // Also handle hash changes (e.g., when clicking browser back/forward)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const anchorId = hash.substring(1);
        // Import is already available from the top
        import("@/lib/scroll-to-anchor").then(({ scrollToAnchor }) => {
          scrollToAnchor(anchorId, { duration: 800 });
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
