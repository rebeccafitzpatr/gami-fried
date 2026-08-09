import React, { JSX, useState } from 'react';
import { createDeck, Deck, Card, generateAIDeck } from '../services/DeckServices';

const DeckCreator= (): JSX.Element =>  {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await generateAIDeck(prompt, name);
      setDeck(d);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // <section className="deck-container" aria-label="Create new deck">
  //     <div className="deck-form">
  //       <header className="deck-title-block">
  //         <span className="eyebrow">Create</span>
  //         <h2 className="deck-title">Craft a new study deck</h2>
  //         <p className="deck-subtitle">
  //           Start with a title, then expand your deck with polished flashcards tailored to your topic.
  //         </p>
  //       </header>

  //       <form onSubmit={generate} aria-label="Create new deck">
  //         <div className="field">
  //           <label htmlFor="deck-name">Deck name</label>
  //           <input
  //             id="deck-name"
  //             className="input"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             placeholder="e.g. Biology Final Review"
  //             autoFocus
  //           />
  //           <span className="field-hint">
  //             Choose a concise title you can recognize at a glance.
  //           </span>
  //         </div>

  //         <div className="field">
  //           <label htmlFor="deck-prompt">Deck prompt</label>
  //           <textarea
  //             id="deck-prompt"
  //             className="input"
  //             value={prompt}
  //             onChange={(e) => setPrompt(e.target.value)}
  //             placeholder="e.g. Create a biology revision deck"
  //           />
  //           <span className="field-hint">
  //             Provide a clear prompt to guide the AI in generating relevant flashcards.
  //           </span>
  //         </div>

  //         {error && (
  //           <div className="error" role="alert">
  //             {error}
  //           </div>
  //         )}

  //         <div className="editor-footer">
  //           <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
  //             Create deck
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </section>

  return (
    <div className="deck-form">
       <header className="deck-title-block">
        <span className="eyebrow">Create</span>
        <h2 className="deck-title">Craft a new study deck</h2>
        <p className="deck-subtitle">
           Start with a title, then expand your deck with polished flashcards tailored to your topic.
        </p>
       </header>
      <div className="field" >
        <label htmlFor="deck-name">Deck name</label>
        <input
          value={name}
          className='input'
          onChange={e => setName(e.target.value)}
          placeholder="Deck name"
        />
      </div>

      <div className="field">
        <label htmlFor="deck-prompt">Deck prompt</label>
      <input
        value={prompt}
        className='input'
        onChange={e => setPrompt(e.target.value)}
        placeholder="Enter Prompt Here"
      />
      </div>
      <button onClick={generate} disabled={loading} className="btn btn-primary">
        {loading ? 'Generating...' : 'Generate New Deck'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {deck && (
        <div style={{ marginTop: 20, textAlign: 'left' }}>
          <h3>Deck: {deck.name}</h3>
          <p>ID: {deck.id}</p>
          <h4>Cards</h4>
          <ul>
            {(deck.cards ?? []).map((c, i) => (
              <li key={i}>
                <strong>Q:</strong> {c.question} <br />
                <strong>A:</strong> {c.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeckCreator;