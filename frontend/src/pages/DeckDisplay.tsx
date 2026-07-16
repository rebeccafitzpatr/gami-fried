import React from 'react';
import { useNavigate } from 'react-router-dom';


type Card = { question: string; answer: string };
type Deck = { id: string; name: string; cards: Card[] };

interface DeckDisplayProps {
  deck: Deck;
}

export const DeckDisplay: React.FC<DeckDisplayProps> = ({ deck }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>{deck.name}</h2>
      <button onClick={() => navigate(`/deck/${deck.id}/session`)}>Start Session</button>

      <ul>
        {deck.cards.map((c, i) => (
          <li key={i}>
            <strong>Q:</strong> {c.question} <br />
            <strong>A:</strong> {c.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};