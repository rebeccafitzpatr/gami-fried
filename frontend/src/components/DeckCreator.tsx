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
      <div className="deck-form">
        <header className="deck-title-block">
          <span className="eyebrow">Create</span>
          <h2 className="deck-title">Craft a new study deck</h2>
          <p className="deck-subtitle">Start with a title, then expand your deck with polished flashcards tailored to your topic.</p>
        </header>

        <form onSubmit={onSubmit} aria-label="Create new deck">
          <div className="field">
            <label htmlFor="deck-name">Deck name</label>
            <input
              id="deck-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Biology Final Review"
              autoFocus
            />
            <span className="field-hint">Choose a concise title you can recognize at a glance.</span>
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          <div className="editor-footer">
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              Create deck
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DeckCreator;