import React, { useEffect, useState } from 'react';
import { Deck, getDecks } from '../services/DeckServices';
import { Link } from 'react-router-dom';

export const DeckListDisplay = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecks = async () => {
      const data = await getDecks();
      setDecks(data);
    };

    fetchDecks();
  }, []);
  
  return (
    <section className="deck-list" aria-label="Deck list">
      <div className="deck-list-panel">
        <header className="deck-list-header">
          <div className="deck-title-block">
            <span className="eyebrow">Library</span>
            <h1 className="deck-title">Your flashcard decks</h1>
            <p className="deck-subtitle">Browse every deck, open a topic, and jump directly into review mode.</p>
          </div>
          <div className="deck-meta">{decks.length} {decks.length === 1 ? 'deck' : 'decks'}</div>
        </header>

        {decks.length === 0 ? (
          <div className="deck-empty" role="status">
            <h3 className="deck-title">No decks yet</h3>
            <p className="empty-copy">Create your first deck to start building a focused study routine.</p>
          </div>
        ) : (
          <div className="deck-grid" aria-label="Decks">
            {decks.map((d) => (
              <Link key={d.id} to={`/deck/${d.id}`} className="deck-card" aria-label={`Open deck ${d.name}`}>
                <div className="deck-card-inner">
                  <div>
                    <div className="deck-card-title">{d.name}</div>
                    <p className="deck-subtitle">Open to review, edit, or launch a study session.</p>
                  </div>
                  <div className="deck-card-count">{d.cards.length} {d.cards.length === 1 ? 'card' : 'cards'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};