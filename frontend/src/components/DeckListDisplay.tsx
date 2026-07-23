import React, { useMemo, useState } from 'react';
import { Deck } from '../services/DeckServices';
import { Link } from 'react-router-dom';

export const DeckListDisplay: React.FC<{ decks?: Deck[] }> = ({ decks }) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => decks?.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())) ?? [],
    [decks, query]
  );

  return (
    <section className="deck-list" aria-label="Deck list">
      <div className="toolbar" style={{ marginBottom: 8 }}>
        <input
          className="search-input"
          placeholder="Search decks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="card-count">{filtered.length}/{decks?.length} decks</span>
      </div>
      <div className="deck-grid">
        {filtered.map((d) => (
          <Link key={d.id} to={`/deck/${d.id}`} className="deck-card" aria-label={`Open deck ${d.name}`}>
            <div className="deck-card-inner">
              <div className="deck-card-title">{d.name}</div>
              <div className="deck-card-count">{d.cards.length} cards</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};