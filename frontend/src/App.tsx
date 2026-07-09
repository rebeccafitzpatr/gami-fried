import logo from './logo.svg';
import './App.css';
import React from 'react';
import DeckCreator from './components/DeckCreator';
import { DeckDisplay } from './components/DeckDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <DeckDisplay />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <DeckCreator/>
      </header>
    </div>
  );
}

export default App;
