"use client";

import { useEffect } from "react";
import { handleHashOnLoad } from "@/lib/scroll-to-anchor";

/**
 * Component that handles automatic scrolling to anchor on page load and hash changes
 * Props let you customize animation duration/offset per page.
 */
export function AnchorScrollHandler({
  duration = 800,
  offset,
  maxWait,
}: {
  duration?: number;
  offset?: number;
  maxWait?: number;
} = {}) {
  useEffect(() => {
    // Handle initial hash on page load
    handleHashOnLoad({ duration, offset, maxWait });

    // Also handle hash changes (e.g., when clicking browser back/forward)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const anchorId = hash.substring(1);
        // Import is already available from the top
        import("@/lib/scroll-to-anchor").then(({ scrollToAnchor }) => {
          scrollToAnchor(anchorId, { duration, offset, maxWait });
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
