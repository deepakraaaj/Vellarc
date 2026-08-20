import { useEffect, useState } from 'react';

// The app toggles dark mode by adding/removing a `dark` class on
// document.body (see App.tsx), rather than via React context. Components
// that need to hand a concrete color mode to third-party libraries (like
// React Flow's `colorMode` prop) watch that class directly.
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const target = document.body;
    const observer = new MutationObserver(() => {
      setIsDark(target.classList.contains('dark'));
    });
    observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
