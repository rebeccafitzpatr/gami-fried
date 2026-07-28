import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Deck.css';

type Card = { question: string; answer: string };
type Deck = { id: string; name: string; cards: Card[] };

interface DeckDisplayProps {
  deck: Deck;
}

const CardTile: React.FC<{ card: Card }> = ({ card }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <article
      className="card-tile"
      onClick={() => setRevealed((v) => !v)}
      tabIndex={0}
      role="button"
      aria-pressed={revealed}
      aria-label={revealed ? 'Show question' : 'Show answer'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setRevealed((v) => !v);
        }
      }}
    >
      <div className="card-inner">
        <div className="card-face front">
          <span><strong>Q:</strong> {card.question}</span>
        </div>
        <div className="card-face back">
          <span><strong>A:</strong> {card.answer}</span>
        </div>
      </div>
    </article>
  );
};

export const DeckDisplay: React.FC<DeckDisplayProps> = ({ deck }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredCards = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return deck.cards;
    return deck.cards.filter((c) =>
      `${c.question} ${c.answer}`.toLowerCase().includes(q)
    );
  }, [deck.cards, query]);

  return (
    <div className="deck-container">
      <header className="deck-header">
        <h2 className="deck-title">{deck.name}</h2>
        <button className="btn btn-primary start-btn" onClick={() => navigate(`/deck/${deck.id}/session`)}>
          Start Session
        </button>
      </header>

      <div className="toolbar" aria-label="deck toolbar">
        <input
          className="search-input"
          aria-label="Search cards"
          placeholder="Search questions or answers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="card-count">{filteredCards.length} cards</span>
        {query && <button className="btn" onClick={() => setQuery('')}>Clear</button>}
      </div>

      <section className="deck-grid" aria-label="Deck cards">
        {filteredCards.map((c, i) => (
          <CardTile key={i} card={c} />
        ))}
      </section>
    </div>
  );
};