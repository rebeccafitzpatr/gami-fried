import logo from './logo.svg';
import './Navbar.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink } from 'react-router-dom';
import DeckCreator from './components/DeckCreator';
import { DeckListDisplay } from './components/DeckListDisplay';
import { DeckDisplayWrapper } from './pages/DeckDisplayWrapper';
import { DeckSession } from './pages/DeckSession';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar" aria-label="Main navigation">
          <Link to="/" className="brand" aria-label="GamiFried home">
            {/* <img src={logo} alt="" className="brand-logo" /> */}
            <span className="brand-name">GamiFried</span>
          </Link>
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
