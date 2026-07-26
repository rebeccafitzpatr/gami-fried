import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import DeckCreator from './components/DeckCreator';
import { DeckListDisplay } from './components/DeckListDisplay';
import { DeckDisplayWrapper } from './pages/DeckDisplayWrapper';
import { DeckSession } from './pages/DeckSession';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Decks</Link> | <Link to="/create">Create</Link>
          </nav>
        </header>

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
