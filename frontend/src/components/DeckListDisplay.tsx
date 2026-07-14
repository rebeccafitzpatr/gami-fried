import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Deck, getDecks } from "../services/DeckServices";

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
    <div>
      <h2>Deck Display</h2>
      <ul>
        {decks.map(deck => (
          <li key={deck.id}>
            <Link to={`/deck/${deck.id}`}>{deck.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}