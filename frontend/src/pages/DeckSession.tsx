import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeckById } from '../services/DeckServices';

export const DeckSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<null | { id: string; name: string; cards: { question: string; answer: string }[] }>(null);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    getDeckById(id!).then((d) => setDeck(d));
  }, [id]);

  const current = useMemo(() => deck?.cards[idx], [deck, idx]);

  const next = () => {
    if (!deck) return;
    setIdx((i) => Math.min(i + 1, deck.cards.length - 1));
    setRevealed(false);
  };

  if (!deck) return <div>Loading session...</div>;

  return (
    <section className="deck-session" aria-label="Deck session">
      <header className="deck-header">
        <h3 className="deck-title">{deck.name} — Session</h3>
      </header>
      <div className="card-area" role="group" aria-label="Current card">
        <div className="qa">
          <div className="q">Q: {current?.question}</div>
          {revealed && <div className="a">A: {current?.answer}</div>}
        </div>
        <div className="controls">
          <button className="btn" onClick={() => setRevealed((r) => !r)} aria-label="Toggle answer">
            {revealed ? 'Hide' : 'Show'} Answer
          </button>
          <button className="btn btn-primary" onClick={next} aria-label="Next card">Next</button>
        </div>
      </div>
    </section>
  );
};