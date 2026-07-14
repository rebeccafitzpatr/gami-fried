import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import DeckCreator from './components/DeckCreator';
import { DeckListDisplay } from './components/DeckListDisplay';
import { DeckDisplayWrapper } from './pages/DeckDisplayWrapper';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <nav>
            <Link to="/">Decks</Link> | <Link to="/create">Create</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<DeckListDisplay />} />
          <Route path="/deck/:id" element={<DeckDisplayWrapper />} />
          <Route path="/create" element={<DeckCreator />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
