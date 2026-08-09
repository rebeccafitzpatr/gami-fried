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
    <div className="deck-panel">
      <header className="deck-header">
        <div className="deck-title-block">
          <span className="eyebrow">Deck</span>
          <h2 className="deck-title">{deck.name}</h2>
          <p className="deck-subtitle">Flip any card to reveal the answer or launch a focused study session.</p>
        </div>
        <div className="deck-header-actions">
          <button className="btn btn-primary start-btn" onClick={() => navigate(`/deck/${deck.id}/session`)}>
            Start Session
          </button>
        </div>
      </header>

      <div className="toolbar" aria-label="deck toolbar">
        <label className="search-shell">
          <span aria-hidden="true">⌕</span>
          <input
            className="search-input"
            aria-label="Search cards"
            placeholder="Search questions or answers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="deck-actions">
          <span className="card-count">{filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'}</span>
          {query && <button className="btn btn-secondary" onClick={() => setQuery('')}>Clear</button>}
        </div>
      </div>

      <section className="deck-grid" aria-label="Deck cards">
        {filteredCards.length > 0 ? (
          filteredCards.map((c, i) => <CardTile key={i} card={c} />)
        ) : (
          <div className="deck-empty" role="status">
            <h3 className="deck-title">No cards match that search</h3>
            <p className="empty-copy">Try a different keyword or clear the search to browse the full deck.</p>
          </div>
        )}
      </section>
    </div>
  );
};