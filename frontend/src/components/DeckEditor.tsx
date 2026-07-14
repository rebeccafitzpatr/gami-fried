import React, { useEffect, useState } from 'react';
import { Deck, Card, updateDeck, regenerateDeck } from '../services/DeckServices';

interface Props {
  deck: Deck;
  onSaved?: (d: Deck) => void;
  onCancel?: () => void;
}

export const DeckEditor: React.FC<Props> = ({ deck, onSaved, onCancel }) => {
  const [name, setName] = useState<string>(deck.name);
  const [prompt, setPrompt] = useState<string>(deck.prompt ?? "");
  const [cards, setCards] = useState<{ question: string; answer: string }[]>(
    deck.cards.map(c => ({ question: c.question, answer: c.answer }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if prompt changed from original
  const promptChanged = prompt !== (deck.prompt ?? "");

  const addCard = () => setCards(c => [...c, { question: "", answer: "" }]);

  const deleteCard = (idx: number) => {
    // Remove locally
    setCards(cs => cs.filter((_, i) => i !== idx));
  };

  const save = async () => {
    setError(null);
    setLoading(true);
    try {
      if (promptChanged) {
        // Regenerate when prompt changes
        const updated = await regenerateDeck(deck.id, prompt, name);
        onSaved?.(updated);
      } else {
        // Save only cards (no regen)
        const cardsPayload = cards.map(c => ({ Question: c.question, Answer: c.answer }));
        const updated = await updateDeck(deck.id, name, prompt, cardsPayload);
        onSaved?.(updated);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setName(deck.name);
    setPrompt(deck.prompt ?? "");
    setCards(deck.cards.map(c => ({ question: c.question, answer: c.answer })));
  }, [deck?.id, deck?.name, deck?.prompt, deck?.cards]);

  // Minimal UI scaffold
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
            <input value={c.question} onChange={ev => {
              const v = ev.target.value;
              setCards(cs => cs.map((cc, i) => i === idx ? { ...cc, question: v } : cc));
            }} placeholder="Question" />
            <input value={c.answer} onChange={ev => {
              const v = ev.target.value;
              setCards(cs => cs.map((cc, i) => i === idx ? { ...cc, answer: v } : cc));
            }} placeholder="Answer" />
            <button type="button" onClick={() => deleteCard(idx)}>Delete</button>

          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={addCard}>Add Card</button>
      <button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

