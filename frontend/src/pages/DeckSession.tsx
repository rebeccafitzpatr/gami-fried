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

  if (!deck) {
    return (
      <section className="deck-session" aria-label="Deck session loading">
        <div className="deck-title-block">
          <span className="eyebrow">Session</span>
          <h3 className="deck-title">Loading session…</h3>
          <p className="deck-subtitle">Gathering your next review card.</p>
        </div>
        <div className="deck-skeleton" aria-hidden="true" />
      </section>
    );
  }

  return (
    <section className="deck-session" aria-label="Deck session">
      <header className="deck-session-header">
        <div className="deck-title-block">
          <span className="eyebrow">Session</span>
          <h3 className="deck-title">{deck.name}</h3>
          <p className="session-progress">Card {Math.min(idx + 1, deck.cards.length)} of {deck.cards.length}</p>
        </div>
      </header>
      <div className="card-area" role="group" aria-label="Current card">
        <div className="qa">
          <div className="q">Q: {current?.question}</div>
          {revealed && <div className="a">A: {current?.answer}</div>}
        </div>
        <div className="controls">
          <button className="btn btn-secondary" onClick={() => setRevealed((r) => !r)} aria-label="Toggle answer">
            {revealed ? 'Hide answer' : 'Reveal answer'}
          </button>
          <button className="btn btn-primary" onClick={next} aria-label="Next card">Next card</button>
        </div>
      </div>
    </section>
  );
};