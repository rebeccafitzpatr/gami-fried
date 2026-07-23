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
    <form className="deck-form" onSubmit={onSubmit} aria-label="Create new deck">
      <h3>Create Deck</h3>
      <div className="field">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter deck name" />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="btn btn-primary">Create</button>
    </form>
  );
};

export default DeckCreator;