import React, { useEffect, useState } from 'react';
import { Deck, updateDeck, regenerateDeck } from '../services/DeckServices';

interface Props {
  deck: Deck;
  onSaved?: (d: Deck) => void;
  onCancel?: () => void;
}

export const DeckEditor: React.FC<Props> = ({ deck, onSaved, onCancel }) => {
  const [name, setName] = useState<string>(deck.name);
  const [prompt, setPrompt] = useState<string>(deck.prompt ?? "");
  const [cards, setCards] = useState<{ question: string; answer: string }[]>(
    deck.cards.map(c => ({ question: c.question, answer: c.answer }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if prompt changed from original
  const promptChanged = prompt !== (deck.prompt ?? "");

  const addCard = () => setCards(c => [...c, { question: "", answer: "" }]);

  const deleteCard = (idx: number) => {
    // Remove locally
    setCards(cs => cs.filter((_, i) => i !== idx));
  };

  const save = async () => {
    setError(null);
    setLoading(true);
    try {
      if (promptChanged) {
        // Regenerate when prompt changes
        const updated = await regenerateDeck(deck.id, prompt, name);
        onSaved?.(updated);
      } else {
        // Save only cards (no regen)
        const cardsPayload = cards.map(c => ({ Question: c.question, Answer: c.answer }));
        const updated = await updateDeck(deck.id, name, prompt, cardsPayload);
        onSaved?.(updated);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setName(deck.name);
    setPrompt(deck.prompt ?? "");
    setCards(deck.cards.map(c => ({ question: c.question, answer: c.answer })));
  }, [deck?.id, deck?.name, deck?.prompt, deck?.cards]);

  // Minimal UI scaffold
  return (
    <section className="deck-editor-shell" aria-label="Edit deck">
      <div className="deck-editor">
        <header className="deck-title-block">
          <span className="eyebrow">Edit</span>
          <h3 className="deck-title">Refine this deck</h3>
          <p className="deck-helper">Update the deck title, adjust the source prompt, or fine-tune individual flashcards.</p>
        </header>

        <div className="field">
          <label htmlFor="deck-editor-name">Deck name</label>
          <input id="deck-editor-name" value={name} onChange={e => setName(e.target.value)} className="input" />
        </div>
        <div className="field">
          <label htmlFor="deck-editor-prompt">Prompt</label>
          <textarea id="deck-editor-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} className="input" />
          <span className="field-hint">Changing the prompt will regenerate the deck with updated flashcards.</span>
        </div>
        <div className="cards-editor">
          {cards.map((c, idx) => (
            <div key={idx} className="card-edit-row">
              <input value={c.question} onChange={ev => {
                const v = ev.target.value;
                setCards(cs => cs.map((cc, i) => i === idx ? { ...cc, question: v } : cc));
              }} placeholder="Question" aria-label={`Question ${idx + 1}`} />
              <input value={c.answer} onChange={ev => {
                const v = ev.target.value;
                setCards(cs => cs.map((cc, i) => i === idx ? { ...cc, answer: v } : cc));
              }} placeholder="Answer" aria-label={`Answer ${idx + 1}`} />
              <button className="btn btn-danger" type="button" onClick={() => deleteCard(idx)}>Delete</button>
            </div>
          ))}
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        <div className="editor-footer">
          <button className="btn btn-secondary" type="button" onClick={addCard}>Add card</button>
          <button type="button" onClick={save} disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" onClick={onCancel} className="btn">Cancel</button>
        </div>
      </div>
    </section>
  );
};

