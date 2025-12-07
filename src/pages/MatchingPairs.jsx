import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useController } from "../hardware/ControllerContext";
import "./MatchingPairs.css";

const CARD_BACK = "/Resources/Game/MatchingPairs/card.svg";

const LEVEL_LAYOUTS = {
  1: { rows: 2, cols: 4 }, // 8 cards
  2: { rows: 2, cols: 5 }, // 10 cards
  3: { rows: 2, cols: 6 }, // 12 cards
  4: { rows: 2, cols: 7 }, // 14 cards
  5: { rows: 4, cols: 4 }, // 16 cards
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateCards(level) {
  const { rows, cols } = LEVEL_LAYOUTS[level];
  const totalSlots = rows * cols;

  const pool = [
    "star", "bike", "plane", "bolt", "leaf",
    "anchor", "cube", "bunny", "bird", "car",
    "flower", "dog"
  ];

  const pairsNeeded = totalSlots / 2;

  const selected = [];
  for (let i = 0; i < pairsNeeded; i++) {
    const type = pool[i % pool.length];
    selected.push({ type, img: `/Resources/Game/MatchingPairs/${type}.svg` });
  }

  let deck = selected.flatMap((c, i) => [
    { id: i * 2, ...c },
    { id: i * 2 + 1, ...c }
  ]);

  return shuffle(deck);
}

function computeCardSize(rows, cols, wrapWidth, wrapHeight) {
  const aspect = 3 / 4; // width / height

  const maxW = (wrapWidth / cols) * 0.9;
  const maxH = (wrapHeight / rows) * 0.85;

  return Math.min(maxW, maxH * aspect);
}

function formatTime(t) {
  const mm = String(Math.floor(t / 60)).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function MatchingPairs() {
  const navigate = useNavigate();

  const { lastAction, clearAction } = useController();
  const [cursor, setCursor] = useState(0);
  const [exitModal, setExitModal] = useState(false);
  const [modalCursor, setModalCursor] = useState(0);


  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState({ rows: 2, cols: 4, cardSize: 100 });

  const { rows, cols } = LEVEL_LAYOUTS[level];
  const totalSlots = rows * cols;

  const [cards, setCards] = useState(() => generateCards(level));
  const [openCards, setOpenCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [modal, setModal] = useState(false);

  // RESET GAME
  const reset = (nextLevel = level) => {
    const lv = Math.min(nextLevel, 5);

    setLevel(lv);
    setCards(generateCards(lv));
    setOpenCards([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setRunning(true);
    setModal(false);
  };

  // CARD CLICK LOGIC
  const clickCard = (i) => {
    const blocked =
      openCards.includes(i) ||
      matched.includes(i) ||
      openCards.length === 2 ||
      modal;

    if (blocked) return;

    setOpenCards(prev => [...prev, i]);
  };

  useEffect(() => {
    setCards(generateCards(level));
  }, [level]);

  useEffect(() => {
    if (openCards.length === 2) {
      const [a, b] = openCards;
      setMoves(m => m + 1);

      if (cards[a].type === cards[b].type) {
        setMatched(prev => [...prev, a, b]);
        setOpenCards([]);
      } else {
        setTimeout(() => setOpenCards([]), 900);
      }
    }
  }, [openCards]);

useEffect(() => {
  if (!lastAction) return;
  const action = lastAction.type;

  // EXIT MODAL
  if (exitModal) {
    if (action === "UP") {
      setModalCursor(prev => Math.max(prev - 1, 0));
    } 
    else if (action === "DOWN") {
      setModalCursor(prev => Math.min(prev + 1, 1));
    }
    else if (action === "A") {
      if (modalCursor === 0) navigate("/game/select");
      else setExitModal(false);
    }
    clearAction();
    return;
  }

  // B BUTTON ALWAYS OPENS EXIT MODAL
  if (action === "B") {
    setExitModal(true);
    setModalCursor(0);
    clearAction();
    return;
  }

  // WIN MODAL
  if (modal) {
    const maxIndex = 1;

    if (action === "UP") {
      setModalCursor(prev => Math.max(prev - 1, 0));
    } 
    else if (action === "DOWN") {
      setModalCursor(prev => Math.min(prev + 1, maxIndex));
    }
    else if (action === "A") {
      if (modalCursor === 0) {
        if (level < 5) reset(level + 1);
        else reset(1);
      } else {
        navigate("/game/select");
      }
    }

    clearAction();
    return;
  }

  // NORMAL GAME CONTROLS
  if (action === "UP") {
      setCursor(prev => Math.max(prev - cols, 0));
    }
    else if (action === "DOWN") {
      setCursor(prev => Math.min(prev + cols, totalSlots - 1));
    }
    else if (action === "LEFT") {
      setCursor(prev => (prev % cols === 0 ? prev : prev - 1));
    }
    else if (action === "RIGHT") {
      setCursor(prev =>
        (prev % cols === cols - 1 ? prev : prev + 1)
      );
    }
    else if (action === "A") {
      clickCard(cursor);
    }

    clearAction();
  }, [lastAction]);

  useEffect(() => {
    if (modal || exitModal) {
      setModalCursor(0);
    }
  }, [modal, exitModal]);


  // TIMER
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // CHECK FOR LEVEL COMPLETE
  useEffect(() => {
    if (matched.length === totalSlots) {
      setRunning(false);
      setModal(true);
    }
  }, [matched]);

  useEffect(() => {
    function update() {
      const wrapper = document.querySelector(".mp-grid-wrapper");
      if (!wrapper) return;

      const { width, height } = wrapper.getBoundingClientRect();
      const size = computeCardSize(rows, cols, width, height);

      setGrid({ rows, cols, cardSize: size });
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [level, rows, cols]);

  return (
    <div className="mp-container">
      <div className={modal ? "mp-content blurred" : "mp-content"}>
        
        <div className="mp-header">
          <h1>Level {level} — {rows}×{cols}</h1>
          <p>Moves: {moves} | Time: {formatTime(time)}</p>
        </div>

        <div className="mp-grid-wrapper">
          <ul
            className="mp-grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${grid.cardSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${grid.cardSize * (4 / 3)}px)`
            }}
          >
            {cards.map((c, idx) => {
              const isOpen = openCards.includes(idx) || matched.includes(idx);
              const isMatched = matched.includes(idx);

              return (
                <li
                  key={c.id}
                  className={`mp-card 
                    ${isOpen ? "open" : ""} 
                    ${isMatched ? "matched" : ""} 
                    ${cursor === idx ? "cursor" : ""}
                  `}
                  style={{
                    width: grid.cardSize,
                    height: grid.cardSize * (4 / 3),
                  }}
                  onClick={() => clickCard(idx)}
                >

                  <img
                    src={isOpen ? c.img : CARD_BACK}
                    style={{ width: "100%", height: "100%" }}
                    alt="card"
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <button className="mp-restart" onClick={() => reset(level)}>
          Restart Level
        </button>
      </div>

      {/* WIN MODAL */}
      {modal && (
        <div className="mp-modal-overlay">
          <div className="mp-modal">
            <h2>🎉 Level Complete!</h2>
            <p>Time: <b>{formatTime(time)}</b></p>
            <p>Moves: <b>{moves}</b></p>

            <div className="mp-modal-buttons">
              <button
                className={modalCursor === 0 ? "cursor" : ""}
                onClick={() => level < 5 ? reset(level + 1) : reset(1)}
              >
                {level < 5 ? "Next Level →" : "Restart from Level 1"}
              </button>

              <button
                className={modalCursor === 1 ? "cursor" : ""}
                onClick={() => navigate("/game/select")}
              >
                ⬅ Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT MODAL */}
      {exitModal && (
        <div className="mp-modal-overlay">
          <div className="mp-modal">
            <h2>Exit Game?</h2>
            <p>Are you sure you want to leave?</p>

            <div className="mp-modal-buttons">
              <button
                className={modalCursor === 0 ? "cursor" : ""}
                onClick={() => navigate("/game/select")}
              >
                Yes — Exit
              </button>

              <button
                className={modalCursor === 1 ? "cursor" : ""}
                onClick={() => setExitModal(false)}
              >
                No — Resume
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
