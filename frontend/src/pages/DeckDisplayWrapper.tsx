import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DeckDisplay } from './DeckDisplay';
import { Deck } from '../services/DeckServices';
import DeckEditor from '../components/DeckEditor';

export const DeckDisplayWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);


  useEffect(() => {
    const fetchDeck = async () => {
      if (!id) {
        setLoading(false);
        setError('No deck id provided.');
        return;
      }
      try {
        // Adjust base URL as needed for your dev/prod env
        const res = await fetch(`http://localhost:5200/decks/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Deck not found');
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
          setLoading(false);
          return;
        }
        const d = (await res.json()) as Deck;
        setDeck(d);
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [id]);

  if (loading) return <div>Loading deck...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deck) return <div>No deck data</div>;

  return (
    <div>
      <DeckDisplay deck={deck} />
      <button onClick={() => setEditing(v => !v)}>
        {editing ? 'Close Editor' : 'Edit Deck'}
      </button>
      {editing && (
        <DeckEditor
          deck={deck}
          onSaved={updated => setDeck(updated)}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
};