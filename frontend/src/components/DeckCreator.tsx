import React, { useState } from 'react';
import { createDeck } from '../services/DeckServices';
import { useNavigate } from 'react-router-dom';

const DeckCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Deck name is required');
      return;
    }
    setError(null);
    try {
      const deck = await createDeck({ name, cards: [] } as any);
      navigate(`/deck/${deck.id}`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create deck');
    }
  };

  return (
    <section className="deck-container" aria-label="Create new deck">
      

      <form className="deck-form" onSubmit={onSubmit} aria-label="Create new deck">
        <header className="deck-header">
          <h2 className="deck-title">Create Deck</h2>
        </header>
        <div className="field">
          <label htmlFor="deck-name">Name</label>
          <input
            id="deck-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter deck name"
            autoFocus
          />
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
          Create
        </button>
      </form>
    </section>
  );
};

export default DeckCreator;