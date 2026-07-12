import React from 'react';

type Card = { question: string; answer: string };
type Deck = { id: string; name: string; cards: Card[] };

interface DeckDisplayProps {
  deck: Deck;
}

export const DeckDisplay: React.FC<DeckDisplayProps> = ({ deck }) => {
  return (
    <div>
      <h2>{deck.name}</h2>
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