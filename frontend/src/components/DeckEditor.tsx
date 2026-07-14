import React, { useState } from 'react';
import { Deck, Card, updateDeck } from '../services/DeckServices';

interface Props {
  deck: Deck;
  onSaved?: (d: Deck) => void;
  onCancel?: () => void;
}

const DeckEditor: React.FC<Props> = ({ deck, onSaved, onCancel }) => {
  const [name, setName] = useState<string>(deck.name);
  const [prompt, setPrompt] = useState<string>(deck.prompt ?? "");
  const [cards, setCards] = useState<{ q: string; a: string }[]>(
    (deck.cards ?? []).map(c => ({ q: c.question, a: c.answer }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedCards = cards.map(c => ({ Question: c.q, Answer: c.a }));
      const updated = await updateDeck(deck.id, name, prompt, updatedCards);
      onSaved?.(updated);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Minimal UI scaffold (you’d flesh this out in your project)
  return (
    <div className="deck-editor">
      <h3>Edit Deck</h3>
      <label>Name
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>Prompt
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
      </label>
      <div className="cards-editor">
        {cards.map((c, idx) => (
          <div key={idx}>
            <input value={c.q} onChange={ev => {
              const v = ev.target.value;
              setCards(cs => cs.map((cc, i) => i === idx ? { ...cc, q: v } : cc));
            }} placeholder="Question" />
            <input value={c.a} onChange={ev => {
              const v = ev.target.value;
              setCards(cs => cs.map((cc, i) => i === idx ? { ...cc, a: v } : cc));
            }} placeholder="Answer" />
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeckEditor;