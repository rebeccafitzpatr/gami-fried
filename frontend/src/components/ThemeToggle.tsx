import React from 'react';

export const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-label="Sun" role="img" fill="currentColor">
    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm9-9h3v-2h-3v2zM17.24 4.84l1.41-1.41-1.79-1.8-1.41 1.41 1.79 1.8zM4.84 17.24L3.41 18.65l1.41 1.41 1.41-1.41-1.41-1.41zM12 6a6 6 0 100 12 6 6 0 000-12z"/>
  </svg>
);

export const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-label="Moon" role="img" fill="currentColor">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

interface ThemeToggleProps {
  theme: 'light'|'dark';
  onToggle: () => void;
  label?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, label = 'Toggle theme' }) => {
  const nextThemeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      className="theme-toggle"
      aria-label={nextThemeLabel}
      title={label}
      onClick={onToggle}
      type="button"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};