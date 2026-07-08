import React, { JSX, useState } from 'react';
import { createDeck, Deck, Card } from '../services/DeckServices';

const DeckCreator= (): JSX.Element =>  {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("My Anki Style Deck");

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await createDeck(name);
      setDeck(d);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Deck name"
      />
      <button onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate New Deck'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {deck && (
        <div style={{ marginTop: 20, textAlign: 'left' }}>
          <h3>Deck: {deck.name}</h3>
          <p>ID: {deck.id}</p>
          <h4>Cards</h4>
          <ul>
            {(deck.cards ?? []).map((c, i) => (
              <li key={i}>
                <strong>Q:</strong> {c.question} <br />
                <strong>A:</strong> {c.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeckCreator;