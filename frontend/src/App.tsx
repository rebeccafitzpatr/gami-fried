import logo from './logo.svg';
import './Navbar.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink } from 'react-router-dom';
import DeckCreator from './components/DeckCreator';
import { DeckListDisplay } from './components/DeckListDisplay';
import { DeckDisplayWrapper } from './pages/DeckDisplayWrapper';
import { DeckSession } from './pages/DeckSession';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [theme, setTheme] = useState<'light'|'dark'>('dark');

  // Initialize theme from localStorage or OS preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
    setTheme(initial);
  }, []);

  // Persist theme changes
  useEffect(() => {
    if (!theme) return;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar" aria-label="Main navigation">
          <Link to="/" className="brand" aria-label="GamiFried home">
            {/* <img src={logo} alt="" className="brand-logo" /> */}
            <span className="brand-name">GamiFried</span>
          </Link>

          {/* Theme toggle button in the navbar */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} label="Toggle color theme" />


          <div className="nav-links" aria-label="Primary">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'link active' : 'link')}>Decks</NavLink>
            <NavLink to="/create" className={({ isActive }) => (isActive ? 'link active' : 'link')}>Create</NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<DeckListDisplay />} />
          <Route path="/deck/:id" element={<DeckDisplayWrapper />} />
          <Route path="/deck/:id/session" element={<DeckSession />} />
          <Route path="/create" element={<DeckCreator />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;