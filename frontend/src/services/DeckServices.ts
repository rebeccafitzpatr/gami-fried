export interface Card {
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
}

export const createDeck = async (name: string = "My Anki Style Deck"): Promise<Deck> => {
  const resp = await fetch('http://localhost:5200/decks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: name, Prompt: prompt })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed: ${resp.status} ${text}`);
  }
  const data: Deck = await resp.json();
  return data;
};

export const generateAIDeck = async (prompt: string, name: string): Promise<Deck> => {
  const resp = await fetch('http://localhost:5200/api/DeckGeneration/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: name, Prompt: prompt })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed: ${resp.status} ${text}`);
  }

  const data: Deck = await resp.json();
  return data;
}

export const getDecks = async (): Promise<Deck[]> => {
  const resp = await fetch('http://localhost:5200/decks');
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed: ${resp.status} ${text}`);
  }
  const data: Deck[] = await resp.json();
  return data;
};

export const getDeckById = async (id: string): Promise<Deck> => {
  const resp = await fetch(`http://localhost:5200/decks/${id}`);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed: ${resp.status} ${text}`);
  }
  const data: Deck = await resp.json();
  return data;
};
