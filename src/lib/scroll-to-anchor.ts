/**
 * Smooth scroll utility with slow animation for anchor navigation
 * Handles cases where content may not be fully loaded yet
 */

interface ScrollToAnchorOptions {
  /** Duration of the scroll animation in milliseconds (default: 800) */
  duration?: number;
  /** Offset from the top in pixels (default: 94 for header + padding) */
  offset?: number;
  /** Maximum time to wait for element to appear in milliseconds (default: 1500) */
  maxWait?: number;
  /** Callback when scroll completes */
  onComplete?: () => void;
}

/**
 * Smoothly scroll to an element with a given ID
 * Waits for the element to exist in the DOM before scrolling
 */
export async function scrollToAnchor(
  anchorId: string,
  options: ScrollToAnchorOptions = {}
): Promise<boolean> {
  const {
    duration = 800,
    offset = 94, // header height (64px) + padding (30px)
    maxWait = 1500,
    onComplete,
  } = options;

  // Wait for element to exist in DOM
  const element = await waitForElement(anchorId, maxWait);
  
  if (!element) {
    console.warn(`Element with id "${anchorId}" not found after ${maxWait}ms`);
    return false;
  }

  // Get the target position
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  // Perform smooth scroll animation
  await smoothScrollTo(offsetPosition, duration);

  // Update URL hash without triggering another scroll
  if (window.history.replaceState) {
    const newUrl = `${window.location.pathname}${window.location.search}#${anchorId}`;
    window.history.replaceState(null, '', newUrl);
  }

  onComplete?.();
  return true;
}

/**
 * Wait for an element to exist in the DOM
 */
function waitForElement(elementId: string, maxWait: number): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    if (element) {
      resolve(element);
      return;
    }

    const startTime = Date.now();
    const observer = new MutationObserver(() => {
      const el = document.getElementById(elementId);
      if (el) {
        observer.disconnect();
        resolve(el);
      } else if (Date.now() - startTime > maxWait) {
        observer.disconnect();
        resolve(null);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also set a timeout as a fallback
    setTimeout(() => {
      observer.disconnect();
      resolve(document.getElementById(elementId));
    }, maxWait);
  });
}

/**
 * Perform smooth scroll animation using easing function
 */
function smoothScrollTo(targetPosition: number, duration: number): Promise<void> {
  return new Promise((resolve) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    // Easing function for smooth deceleration (ease-in-out)
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animation);
  });
}

/**
 * Handle hash fragment on page load or navigation
 * Call this in a useEffect on client components
 */
export function handleHashOnLoad(options?: ScrollToAnchorOptions): void {
  // Small delay to ensure content is rendered
  setTimeout(() => {
    const hash = window.location.hash;
    if (hash) {
      const anchorId = hash.substring(1); // Remove the '#'
      scrollToAnchor(anchorId, options);
    }
  }, 50);
}
