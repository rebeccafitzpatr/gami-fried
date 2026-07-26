import React, { useEffect, useMemo, useState } from 'react';
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
      <div className="deck-grid" aria-label="Decks">
        {decks.map((d) => (
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