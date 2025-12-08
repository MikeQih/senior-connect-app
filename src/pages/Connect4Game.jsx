import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './Connect4Game.css';

function Connect4Game() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, clearAction } = useController();

  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [round, setRound] = useState(1);
  const [board, setBoard] = useState(
    Array(6).fill(null).map(() => Array(7).fill(null))
  );
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(3);
  const [moveCount, setMoveCount] = useState(0);

  const [exitModal, setExitModal] = useState(false);
  const [exitCursor, setExitCursor] = useState(0); // 0 = Yes, 1 = No
  const [modalCursor, setModalCursor] = useState(0); // 0 = Play Again, 1 = Return to Menu

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      if (e.key === 'ArrowLeft') {
        setSelectedColumn(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedColumn(prev => Math.min(6, prev + 1));
      } else if (e.key === 'a' || e.key === 'A' || e.key === ' ') {
        handleDropPiece();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedColumn, gameOver, currentPlayer, board]);

  useEffect(() => {
  if (!lastAction?.type) return;
  const action = lastAction.type;

  let normalized = action;

  if (uiModel === "ModelR") {
    if (action === "RIGHT") normalized = "DOWN";   // clockwise
    if (action === "LEFT") normalized = "UP";      // anticlockwise
  }

  // EXIT MODAL
  if (exitModal) {

    if (uiModel === "ModelR") {
      // knob
      if (action === "RIGHT") {
        setExitCursor(prev => (prev === 0 ? 1 : 0));
        clearAction();
        return;
      }
      if (action === "LEFT") {
        setExitCursor(prev => (prev === 0 ? 1 : 0));
        clearAction();
        return;
      }
    }

    // dpad
    if (action === "UP" || action === "DOWN") {
      setExitCursor(prev => (prev === 0 ? 1 : 0));
    }

    if (action === "A") {
      if (exitCursor === 0) navigate("/game/select");
      else setExitModal(false);
    }

    clearAction();
    return;
  }

  // WIN MODAL
  if (gameOver) {

    if (uiModel === "ModelR") {
      // knob
      if (action === "RIGHT") {
        setModalCursor(prev => (prev === 0 ? 1 : 0));
        clearAction();
        return;
      }
      if (action === "LEFT") {
        setModalCursor(prev => (prev === 0 ? 1 : 0));
        clearAction();
        return;
      }
    }

    // dpad
    if (action === "UP" || action === "DOWN") {
      setModalCursor(prev => (prev === 0 ? 1 : 0));
    }

    if (action === "A") {
      if (modalCursor === 0) handleReset();
      else navigate("/game/select");
    }

    if (action === "B") {
      setExitModal(true);
      setExitCursor(0);
    }

    clearAction();
    return;
  }

  // GAMEPLAY
  // KNOB
  if (uiModel === "ModelR" && action === "RIGHT") {
    setSelectedColumn(prev => Math.min(6, prev + 1));
    clearAction();
    return;
  }

  if (uiModel === "ModelR" && action === "LEFT") {
    setSelectedColumn(prev => Math.max(0, prev - 1));
    clearAction();
    return;
  }

  // DPAD
  if (action === "LEFT") {
    setSelectedColumn(prev => Math.max(0, prev - 1));
  }
  if (action === "RIGHT") {
    setSelectedColumn(prev => Math.min(6, prev + 1));
  }

  if (action === "A") {
    handleDropPiece();
  }

  if (action === "B") {
    setExitModal(true);
    setExitCursor(0);
  }

  clearAction();
}, [
  lastAction,
  uiModel,
  exitModal,
  exitCursor,
  gameOver,
  modalCursor,
  selectedColumn
]);

  // GAME LOGIC FUNCTIONS
  const isBoardFull = board =>
    board.every(row => row.every(cell => cell !== null));

  const handleDropPiece = () => {
    if (gameOver) return;

    let rowIndex = -1;
    for (let i = 5; i >= 0; i--) {
      if (board[i][selectedColumn] === null) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) return; // Column full

    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][selectedColumn] = currentPlayer;
    setBoard(newBoard);

    setMoveCount(prev => prev + 1);

    if (checkWinner(newBoard, rowIndex, selectedColumn, currentPlayer)) {
      setWinner(currentPlayer);
      setGameOver(true);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      setGameOver(true);
      return;
    }

    const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    setCurrentPlayer(nextPlayer);

    if (nextPlayer === 'red') {
      setRound(prev => prev + 1);
    }
  };

  const checkWinner = (board, row, col, player) => {
    let count = 1;

    // Horizontal
    for (let c = col - 1; c >= 0 && board[row][c] === player; c--) count++;
    for (let c = col + 1; c < 7 && board[row][c] === player; c++) count++;
    if (count >= 4) return true;

    // Vertical
    count = 1;
    for (let r = row + 1; r < 6 && board[r][col] === player; r++) count++;
    if (count >= 4) return true;

    // Diagonal TL-BR
    count = 1;
    for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i] === player; i++) count++;
    for (let i = 1; row + i < 6 && col + i < 7 && board[row + i][col + i] === player; i++) count++;
    if (count >= 4) return true;

    // Diagonal BL-TR
    count = 1;
    for (let i = 1; row + i < 6 && col - i >= 0 && board[row + i][col - i] === player; i++) count++;
    for (let i = 1; row - i >= 0 && col + i < 7 && board[row - i][col + i] === player; i++) count++;
    if (count >= 4) return true;

    return false;
  };

  const handleReset = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setCurrentPlayer('red');
    setRound(1);
    setMoveCount(0);
    setSelectedColumn(3);
    setWinner(null);
    setGameOver(false);
    setModalCursor(0);
  };

  return (
    <div className="connect4-game-container">
      <img src="/Resources/Game/Connect4/NatureBackground.png" className="nature-background" />
      <img src="/Resources/Game/Connect4/BackgroundSignal.png" className="background-signal" />

      <div className="connect4-game-content">
        <div className="round-indicator">
          <span>Round {round}</span>
        </div>

        <div className="game-board-wrapper">
          <div className="column-indicators">
            {[0,1,2,3,4,5,6].map(col => (
              <div
                key={col}
                className={`column-indicator ${selectedColumn === col ? 'active' : ''}`}
                onClick={() => setSelectedColumn(col)}
              >
                {selectedColumn === col && !gameOver && (
                  <img
                    src={`/Resources/Game/Connect4/${currentPlayer === 'red' ? 'RedBall' : 'YellowBall'}.png`}
                    className="indicator-ball"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="game-grid">
            {board.map((row, rIdx) => (
              <div className="grid-row" key={rIdx}>
                {row.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    className={`grid-cell ${selectedColumn === cIdx ? 'highlighted' : ''}`}
                  >
                    {cell && (
                      <img
                        src={`/Resources/Game/Connect4/${cell === 'red' ? 'RedBall' : 'YellowBall'}.png`}
                        className="ball-piece"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* WINNER MODAL */}
        {gameOver && (
          <div className="winner-modal-overlay">
            <div className="winner-modal">
              <h2>
                {winner === 'draw'
                  ? "It's a Draw!"
                  : `${winner === 'red' ? 'Red' : 'Yellow'} Wins!`}
              </h2>

              <div className="winner-options">
                <button
                  className={modalCursor === 0 ? "cursor" : ""}
                  onClick={handleReset}
                >
                  Play Again
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
      </div>

      {/* EXIT MODAL */}
      {exitModal && (
        <div className="exit-modal-overlay">
          <div className="exit-modal">
            <h2>Exit Game?</h2>
            <div className="exit-options">
              <button
                className={exitCursor === 0 ? "cursor" : ""}
                onClick={() => navigate('/game/select')}
              >
                Yes — Quit
              </button>

              <button
                className={exitCursor === 1 ? "cursor" : ""}
                onClick={() => setExitModal(false)}
              >
                No — Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HARDWARE HINTS */}
      <div className="control-hints">
        <div className="hint-item">
          <img
            src={uiModel === 'ModelR'
              ? '/Resources/ModelR/ChooseIcon.png'
              : '/Resources/ModelD/Arrows.png'}
            className="control-icon"
          />
          <span className="hint-text">CHOOSE COLUMN</span>
        </div>

        <div className="hint-item">
          <span className="control-btn" onClick={handleDropPiece}>A</span>
          <span className="hint-text">DROP PIECE</span>
        </div>

        <div className="hint-item">
          <span className="control-btn" onClick={() => setExitModal(true)}>B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Connect4Game;
