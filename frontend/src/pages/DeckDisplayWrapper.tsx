import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DeckDisplay } from './DeckDisplay';
import { Deck, getDeckById } from '../services/DeckServices';
import { DeckEditor } from '../components/DeckEditor';

export const DeckDisplayWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);


  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('No deck id provided.');
        const d = await getDeckById(id);
        if (mounted) setDeck(d);
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Failed to load deck');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <section className="deck-container" aria-label="Deck display">
        <div className="deck-wrapper-header">
          <div className="deck-title-block">
            <span className="eyebrow">Loading</span>
            <h2 className="deck-title">Loading deck…</h2>
            <p className="deck-subtitle">Preparing your cards and session tools.</p>
          </div>
        </div>
        <div className="deck-skeleton" aria-label="Loading deck content" />
      </section>
    );
  }

  if (error) return (
    <section className="deck-container" aria-label="Deck display">
      <div className="deck-wrapper-header">
        <div className="deck-title-block">
          <span className="eyebrow">Error</span>
          <h2 className="deck-title">Couldn’t open deck</h2>
          <p className="deck-subtitle">{error}</p>
        </div>
        <div className="deck-header-actions">
          <Link to="/" className="btn btn-secondary" aria-label="Back to decks">Back to decks</Link>
        </div>
      </div>
    </section>
  );

  if (!deck) return null;

  return (
    <section className="deck-container" aria-label="Deck display">
      <div className="deck-wrapper-header">
        <div className="deck-title-block">
          <span className="eyebrow">Workspace</span>
          <h2 className="deck-title">{deck.name}</h2>
          <p className="deck-subtitle">Review the deck, polish content, or move directly into session mode.</p>
        </div>
        <div className="deck-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setEditing((e) => !e)}
            aria-expanded={editing}
            aria-label={editing ? 'Close editor' : 'Edit deck'}
          >
            {editing ? 'Close editor' : 'Edit deck'}
          </button>
          <Link to="/" className="btn" aria-label="Back to decks">Back</Link>
        </div>
      </div>

      {!editing ? (
        <DeckDisplay deck={deck} />
      ) : (
        <DeckEditor
          deck={deck}
          onSaved={(updated) => {
            setDeck(updated);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </section>
  );
};