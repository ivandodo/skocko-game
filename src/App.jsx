import React, { useState, useCallback } from 'react';
import {
  Smile,
  Club,
  Diamond,
  Spade,
  Heart,
  Star,
  RotateCcw,
  Check,
  Delete,
  Trophy,
  Frown
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const SkockoIcon = (props) => (
  <svg viewBox="0 0 24 24" className={props.className} style={{ overflow: 'visible', ...props.style }}>
    <defs>
      <radialGradient id="skockoHead" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#fff176" />
        <stop offset="100%" stopColor="#fbc02d" />
      </radialGradient>
    </defs>
    {/* Head */}
    <circle
      cx="12" cy="13" r="9"
      fill="url(#skockoHead)"
      stroke={props.color || "rgba(255,255,255,0.4)"}
      strokeWidth={props.strokeWidth || 1.5}
    />
    {/* Glasses */}
    <circle cx="8.5" cy="11" r="3.5" stroke="#7e22ce" strokeWidth="1.2" fill="none" />
    <circle cx="15.5" cy="11" r="3.5" stroke="#7e22ce" strokeWidth="1.2" fill="none" />
    <path d="M12 11H12.5" stroke="#7e22ce" strokeWidth="1.2" />
    {/* Eyes */}
    <ellipse cx="8.5" cy="11" rx="0.8" ry="1.2" fill="#000" />
    <ellipse cx="15.5" cy="11" rx="0.8" ry="1.2" fill="#000" />
    {/* Nose */}
    <circle cx="12" cy="14.5" r="1.5" fill="#ef4444" />
    {/* Mouth */}
    <path d="M10.8 17.5C11.2 17.8 12.8 17.8 13.2 17.5" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const RefinedSpadeIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    {...props}
    style={{ overflow: 'visible', ...props.style }}
  >
    <path
      d="M12 2C12 2 2 11 2 15C2 18.5 5 21 8.5 21C11 21 12 19 12 19C12 19 13 21 15.5 21C19 21 22 18.5 22 15C22 10 12 2 12 2Z"
      fill={props.fill || "#000000"}
      stroke={props.color || "rgba(255,255,255,0.4)"}
      strokeWidth={props.strokeWidth || 1.5}
      strokeLinejoin="round"
    />
    <path
      d="M12 19L9 23H15L12 19Z"
      fill={props.fill || "#000000"}
      stroke={props.color || "rgba(255,255,255,0.4)"}
      strokeWidth={props.strokeWidth || 1.5}
      strokeLinejoin="round"
    />
  </svg>
);

const RefinedClubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    {...props}
    style={{ overflow: 'visible', ...props.style }}
  >
    <path
      d="M10.5 9.5 A 4.5 4.5 0 1 1 13.5 9.5 A 4.5 4.5 0 1 1 14 16 L 10 16 A 4.5 4.5 0 1 1 10.5 9.5 Z"
      fill={props.fill || "#000000"}
      stroke={props.color || "rgba(255,255,255,0.4)"}
      strokeWidth={props.strokeWidth || 1.5}
      strokeLinejoin="round"
    />
    <path
      d="M12 15L9 22H15L12 15Z"
      fill={props.fill || "#000000"}
      stroke={props.color || "rgba(255,255,255,0.4)"}
      strokeWidth={props.strokeWidth || 1.5}
      strokeLinejoin="round"
    />
  </svg>
);

const SYMBOLS = [
  { id: 'skocko', icon: SkockoIcon, color: '#ffd700', label: 'Skočko' },
  { id: 'club', icon: RefinedClubIcon, color: '#000000', label: 'Tref' },
  { id: 'spade', icon: RefinedSpadeIcon, color: '#000000', label: 'Pik' },
  { id: 'heart', icon: Heart, color: '#ef4444', label: 'Herc' },
  { id: 'diamond', icon: Diamond, color: '#ef4444', label: 'Karo' },
  { id: 'star', icon: Star, color: '#fbbf24', label: 'Zvezda' },
];

const MAX_ATTEMPTS = 6;
const SLOTS = 4;

const generateSolution = () => Array.from({ length: SLOTS }, () =>
  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id
);

const App = () => {
  const [solution, setSolution] = useState(generateSolution);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const startNewGame = useCallback(() => {
    setSolution(generateSolution());
    setGuesses([]);
    setCurrentGuess([]);
    setStatus('playing');
  }, []);

  const handleSymbolClick = (symbolId) => {
    if (status !== 'playing' || currentGuess.length >= SLOTS) return;
    setCurrentGuess(prev => [...prev, symbolId]);
  };

  const handleDelete = () => {
    if (status !== 'playing' || currentGuess.length === 0) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const checkGuess = (guess, sol) => {
    let red = 0;
    let yellow = 0;
    const solCopy = [...sol];
    const guessCopy = [...guess];

    // Hits (Red)
    for (let i = 0; i < SLOTS; i++) {
      if (guessCopy[i] === solCopy[i]) {
        red++;
        solCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Near Hits (Yellow)
    for (let i = 0; i < SLOTS; i++) {
      if (guessCopy[i] !== null) {
        const index = solCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          yellow++;
          solCopy[index] = null;
        }
      }
    }

    return { red, yellow };
  };

  const handleSubmit = () => {
    if (currentGuess.length !== SLOTS || status !== 'playing') return;

    const feedback = checkGuess(currentGuess, solution);
    const newGuesses = [...guesses, { guess: currentGuess, feedback }];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    if (feedback.red === SLOTS) {
      setStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setStatus('lost');
    }
  };

  const SymbolIcon = ({ id, className = "", glow = false, style = {} }) => {
    const symbol = SYMBOLS.find(s => s.id === id);
    if (!symbol) return null;
    const Icon = symbol.icon;
    const isSkocko = id === 'skocko';

    return (
      <Icon
        className={`symbol-icon ${className}`}
        color="rgba(255,255,255,0.4)"
        fill={isSkocko ? undefined : symbol.color}
        strokeWidth={1.5}
        glow={glow}
        style={{
          ...style,
          ...(glow ? {
            filter: `drop-shadow(0 0 10px ${isSkocko ? '#facc15' : symbol.color}88)`,
            transform: 'scale(1.1)'
          } : {})
        }}
      />
    );
  };

  return (
    <div className="game-card">
      <header className="header">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          SKOČKO
        </motion.h1>
      </header>

      <div className="board">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
          const guessData = guesses[i];
          const isActive = guesses.length === i && status === 'playing';

          return (
            <div key={i} className={`row ${isActive ? 'active' : ''}`}>
              <div className="slots">
                {Array.from({ length: SLOTS }).map((_, j) => {
                  const symbolId = guessData ? guessData.guess[j] : (isActive ? currentGuess[j] : null);
                  return (
                    <motion.div
                      key={j}
                      className={`slot ${symbolId ? 'filled' : ''}`}
                      layout
                    >
                      <AnimatePresence mode="wait">
                        {symbolId && (
                          <motion.div
                            key={symbolId + j}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', damping: 12 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <SymbolIcon id={symbolId} glow />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              <div className="feedback-area">
                {Array.from({ length: SLOTS }).map((_, k) => {
                  let type = '';
                  if (guessData) {
                    if (k < guessData.feedback.red) type = 'red';
                    else if (k < guessData.feedback.red + guessData.feedback.yellow) type = 'yellow';
                  }

                  return (
                    <motion.div
                      key={k}
                      className={`dot ${type}`}
                      initial={false}
                      animate={type ? { scale: 1 } : { scale: 1 }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="controls-container">
        <div className="selector">
          {SYMBOLS.map((s) => (
            <motion.button
              key={s.id}
              className="symbol-btn"
              onClick={() => handleSymbolClick(s.id)}
              disabled={status !== 'playing' || currentGuess.length >= SLOTS}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SymbolIcon id={s.id} />
            </motion.button>
          ))}
        </div>

        <div className="action-bar">
          <button className="btn btn-icon" onClick={handleDelete} disabled={currentGuess.length === 0 || status !== 'playing'}>
            <Delete />
          </button>

          <button
            className={`btn btn-submit ${status !== 'playing' ? `result ${status}` : ''}`}
            onClick={status === 'playing' ? handleSubmit : startNewGame}
            disabled={status === 'playing' && currentGuess.length !== SLOTS}
          >
            <AnimatePresence mode="wait">
              {status === 'playing' ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Check />
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  className="result-reveal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                >
                  {solution.map((id, i) => (
                    <SymbolIcon key={i} id={id} glow />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button className="btn btn-icon" onClick={startNewGame}>
            <RotateCcw />
          </button>
        </div>
      </div>

    </div>
  );
};

export default App;
