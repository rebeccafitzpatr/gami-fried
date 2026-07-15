import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeckById } from '../services/DeckServices';
import { Deck } from '../services/DeckServices';

export const DeckSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // All hooks at the top level (unconditional)
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const [answerState, setAnswerState] = useState<'pending'|'correct'|'incorrect'>('pending');

  // Load deck by id
  useEffect(() => {
    const loadDeck = async () => {
      if (!id) {
        setError('No deck id provided.');
        setLoading(false);
        return;
      }
      try {
        const d = await getDeckById(id);
        setDeck(d);
        setLoading(false);
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
        setLoading(false);
      }
    };
    loadDeck();
  }, [id]);

  // Reset quiz state when deck changes
  useEffect(() => {
    // Reset all quiz state for a fresh start with a new deck
    setIdx(0);
    setShowAnswer(false);
    setInput('');
    setScore(0);
    setCompleted(false);
    setStarted(false);
    setAnswerState('pending');
  }, [deck?.id]);


  
  useEffect(() => {
    const len = deck?.cards?.length ?? 0;
    if (len > 0 && idx >= len) {
        setCompleted(true);
    }
    }, [idx, deck?.cards?.length]);

  // Current card
  const currentCard = useMemo(() => (deck?.cards ?? [])[idx], [deck, idx]);

  // Rendering guards (after all hooks)
  if (loading) return <div>Loading deck...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deck) return <div>No deck data</div>;


  const total = deck?.cards.length ?? 0;
  const isFinished = idx >= total;

  const startSession = () => {
    setStarted(true);
    setIdx(0);
    setShowAnswer(false);
    setInput('');
    setScore(0);
    setCompleted(false);
    setAnswerState('pending');
  };

  const handleCheck = () => {
    if (!currentCard) return;
    const normalized = (s: string) => (s ?? '').trim().toLowerCase();
    const correct = normalized(input) === normalized(currentCard.answer);
    if (correct) setScore(s => s + 1);
    setShowAnswer(true);
    setAnswerState(correct ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setIdx(i => i + 1);
    setShowAnswer(false);
    setInput('');
    setAnswerState('pending');
  };

  

  // Landing view
  if (!started) {
    return (
      <div className="deck-session">
        <h3>Session: {deck.name}</h3>
        <p>Cards: {deck.cards.length}</p>
        <button onClick={startSession}>Start Session</button>
      </div>
    );
  }

  // In-session rendering
  if (isFinished || completed) {
    return (
      <div className="deck-session">
        <h3>Session complete</h3>
        <p>Your score: {score} / {total}</p>
        <button onClick={() => navigate('/')} >Back to Decks</button>
        <button onClick={startSession}>Restart</button>
      </div>
    );
  }

  return (
    <div className="deck-session">
      <h3>Deck: {deck.name}</h3>
      <div className="card-area" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <div className="card-part">
          <strong>Q:</strong> {currentCard?.question}
        </div>

        {!showAnswer && (
          <div style={{ marginTop: 12 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Your answer"
              style={{ width: '100%', padding: 8 }}
            />
            <div style={{ marginTop: 8 }}>
              <button onClick={handleCheck} disabled={!currentCard}>Check</button>
              <button onClick={() => setShowAnswer(true)} style={{ marginLeft: 8 }}>Show Answer</button>
            </div>
          </div>
        )}

        {showAnswer && currentCard && (
          <div style={{ marginTop: 12 }}>
            <div><strong>A:</strong> {currentCard.answer}</div>
            <div style={{ marginTop: 8 }}>
              <span>Result: {answerState === 'correct' ? 'Correct' : answerState === 'incorrect' ? 'Incorrect' : ''}</span>
              <button onClick={handleNext} style={{ marginLeft: 8 }}>Next</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <span>Progress: {idx + 1} / {total}</span>
      </div>
    </div>
  );
};

export default DeckSession;