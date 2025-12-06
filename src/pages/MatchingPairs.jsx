import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchingPairs.css";

const CARD_BACK = "/Resources/Game/MatchingPairs/card.svg";

const LEVEL_CONFIG = {
  1: { rows: 2, cols: 4 },  // 8 cards
  2: { rows: 2, cols: 5 },  // 10 cards
  3: { rows: 3, cols: 4 },  // 12 cards
  4: { rows: 2, cols: 7 },  // 14 cards
  5: { rows: 4, cols: 4 },  // 16 cards
};

function getLayout(level) {
  return LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateCards(level) {
  const { rows, cols } = getLayout(level);
  const totalSlots = rows * cols;

  const all = [
    "star", "bike", "plane", "bolt", "leaf",
    "anchor", "cube", "bunny", "bird", "car",
    "flower", "dog"
  ];

  const pairsNeeded = totalSlots / 2;
  const selected = [];

  for (let i = 0; i < pairsNeeded; i++) {
    const type = all[i % all.length];
    selected.push({ type, img: `/Resources/Game/MatchingPairs/${type}.svg` });
  }

  let deck = selected.flatMap((c, i) => [
    { id: i * 2,     ...c },
    { id: i * 2 + 1, ...c }
  ]);

  return shuffle(deck);
}

function formatTime(t) {
  const mm = String(Math.floor(t / 60)).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function MatchingPairs() {
  const navigate = useNavigate();

  const [level, setLevel] = useState(1);
  const { rows, cols } = getLayout(level);
  const totalSlots = rows * cols;

  const [cards, setCards] = useState(() => generateCards(level));
  const [openCards, setOpenCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [modal, setModal] = useState(false);

  // analytics
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lastActionTime, setLastActionTime] = useState(null);

  const [matchLatencies, setMatchLatencies] = useState([]);
  const [firstFlipTime, setFirstFlipTime] = useState(null);

  const [mistakes, setMistakes] = useState(0);
  const [misClicks, setMisClicks] = useState(0);
  const [doubleTaps, setDoubleTaps] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);

  const reset = (nextLevel = level) => {
    const targetLevel = Math.min(nextLevel, 5);
    setLevel(targetLevel);

    setCards(generateCards(targetLevel));
    setOpenCards([]);
    setMatched([]);
    setMoves(0);
    setMistakes(0);
    setTime(0);
    setRunning(true);
    setModal(false);

    setReactionTimes([]);
    setLastActionTime(null);
    setMatchLatencies([]);
    setFirstFlipTime(null);
    setMisClicks(0);
    setDoubleTaps(0);
    setLastClickTime(null);
  };

  const clickCard = (i) => {
    const now = performance.now();

    // double tap detection
    if (lastClickTime !== null && now - lastClickTime < 250) {
      setDoubleTaps(d => d + 1);
    }
    setLastClickTime(now);

    const isBlocked =
      openCards.includes(i) ||
      matched.includes(i) ||
      openCards.length === 2 ||
      modal;

    if (isBlocked) {
      setMisClicks(m => m + 1);
      return;
    }

    // reaction time between meaningful actions
    if (lastActionTime !== null) {
      setReactionTimes(arr => [...arr, now - lastActionTime]);
    }
    setLastActionTime(now);

    // match latency
    if (openCards.length === 0) {
      setFirstFlipTime(now);
    } else if (openCards.length === 1 && firstFlipTime !== null) {
      setMatchLatencies(arr => [...arr, now - firstFlipTime]);
      setFirstFlipTime(null);
    }

    setOpenCards(prev => [...prev, i]);
  };

  // regenerate cards when level changes
  useEffect(() => {
    setCards(generateCards(level));
  }, [level]);

  // matching logic
  useEffect(() => {
    if (openCards.length === 2) {
      const [a, b] = openCards;
      setMoves(m => m + 1);

      if (cards[a].type === cards[b].type) {
        setMatched(prev => [...prev, a, b]);
        setOpenCards([]);
      } else {
        setMistakes(x => x + 1);
        setTimeout(() => setOpenCards([]), 900);
      }
    }
  }, [openCards, cards]);

  // timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  // win condition
  useEffect(() => {
    if (matched.length === totalSlots) {
      setRunning(false);
      setModal(true);
    }
  }, [matched, totalSlots]);

  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // store analytics when modal opens
  useEffect(() => {
    if (!modal) return;

    const sessionSummary = {
      timestamp: new Date().toISOString(),
      level,
      rows,
      cols,
      totalTimeSeconds: time,
      moves,
      mistakes,
      avgReactionTimeMs: Math.round(avg(reactionTimes)),
      avgMatchLatencyMs: Math.round(avg(matchLatencies)),
      misClicks,
      doubleTaps,
      completedCards: matched.length,
      totalSlots
    };

    const key = "matchingPairsSessions";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(sessionSummary);
    localStorage.setItem(key, JSON.stringify(existing));

    console.log("Session summary:", sessionSummary);
  }, [modal]);

  return (
    <div className="tutorial-container">
      <div className={modal ? "tutorial-content blurred" : "tutorial-content"}>

        <div className="tutorial-header">
          <h1>Level {level} — {rows}×{cols}</h1>
          <p>Moves: {moves} | Time: {formatTime(time)}</p>
        </div>

        <div className="deck-wrapper">
          <ul
            className={`deck level-${level}`}
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              "--rows": rows,
            }}
          >
            {cards.map((c, i) => {
              const isMatched = matched.includes(i);
              const isOpen = openCards.includes(i) || isMatched;

              return (
                <li
                  key={c.id ?? i}
                  className={
                    "card" +
                    (isOpen ? " open show" : "") +
                    (isMatched ? " match disabled" : "")
                  }
                  onClick={() => clickCard(i)}
                >
                  <img src={isOpen ? c.img : CARD_BACK} alt={c.type} />
                </li>
              );
            })}
          </ul>
        </div>

        <button className="restart-btn" onClick={() => reset(level)}>
          Restart
        </button>
      </div>

      {modal && (
        <div className="mp-modal-overlay">
          <div className="mp-modal">
            <h2>🎉 Level {level} Complete!</h2>
            <p>Time: <b>{formatTime(time)}</b></p>
            <p>Moves: <b>{moves}</b></p>

            <div className="mp-modal-buttons">
              {level < 5 ? (
                <button className="primary" onClick={() => reset(level + 1)}>
                  ▶ Continue to Level {level + 1}
                </button>
              ) : (
                <button className="primary" onClick={() => reset(1)}>
                  🔁 Restart from Level 1
                </button>
              )}

              <button onClick={() => navigate("/game/select")}>
                ⬅ Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
