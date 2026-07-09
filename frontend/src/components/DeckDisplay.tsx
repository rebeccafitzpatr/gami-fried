import React, { useEffect, useState } from "react";
import { Deck, getDecks } from "../services/DeckServices";

export const DeckDisplay = () => {
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
                    <li key={deck.id}>{deck.name} 
                        {deck.cards.map((card, index) => (
                            <div key={index}>
                                <strong>Q:</strong> {card.question} <br />
                                <strong>A:</strong> {card.answer}
                            </div>
                        ))} 
                    </li>

                ))}
            </ul>
        </div>
    );
}