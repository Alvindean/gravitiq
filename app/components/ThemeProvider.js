'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('gravitiq-theme');
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(themeValue) {
      let isDark;
      if (themeValue === 'dark') {
        isDark = true;
      } else if (themeValue === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
      setResolvedTheme(isDark ? 'dark' : 'light');
    }

    applyTheme(theme);
    localStorage.setItem('gravitiq-theme', theme);

    function handleChange() {
      if (theme === 'system') {
        applyTheme('system');
      }
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
