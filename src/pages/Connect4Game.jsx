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

  // ---------------------------------------
  // KEYBOARD FALLBACK (still allowed)
  // ---------------------------------------
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

  // ---------------------------------------
  // HARDWARE CONTROLLER EVENTS
  // ---------------------------------------
  useEffect(() => {
    if (!lastAction?.type || gameOver) return;

    const action = lastAction.type;

    if (action === "LEFT") {
      setSelectedColumn(prev => Math.max(0, prev - 1));
    }

    if (action === "RIGHT") {
      setSelectedColumn(prev => Math.min(6, prev + 1));
    }

    if (action === "A") {
      clearAction();
      handleDropPiece();
      return;
    }

    if (action === "B") {
      clearAction();
      handleBack();
      return;
    }

    clearAction();
  }, [lastAction, gameOver]);

  // ---------------------------------------
  // Board Helper Functions
  // ----------------------------------------

  const isBoardFull = board =>
    board.every(row => row.every(cell => cell !== null));

  const handleDropPiece = () => {
    if (gameOver) return;

    // Find lowest empty row
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

    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    // Win check
    if (checkWinner(newBoard, rowIndex, selectedColumn, currentPlayer)) {
      setWinner(currentPlayer);
      setGameOver(true);
      return;
    }

    // Draw check
    if (isBoardFull(newBoard)) {
      setWinner('draw');
      setGameOver(true);
      return;
    }

    // Switch turn
    const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    setCurrentPlayer(nextPlayer);

    // If yellow played → new round
    if (nextPlayer === 'red') {
      setRound(prev => prev + 1);
    }
  };

  // Check win conditions
  const checkWinner = (board, row, col, player) => {
    // Horizontal
    let count = 1;
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
  };

  const handleBack = () => {
    navigate('/game/connect4/tutorial');
  };

  const handleColumnSelect = (colIndex) => {
    setSelectedColumn(colIndex);
  };

  return (
    <div className="connect4-game-container">
      <img src="/Resources/Game/Connect4/NatureBackground.png" className="nature-background" />
      <img src="/Resources/Game/Connect4/BackgroundSignal.png" className="background-signal" />

      <div className="connect4-game-content">

        {/* Round indicator*/}
        <div className="round-indicator">
          <span>Round {round}</span>
        </div>

        {/* Game Board */}
        <div className="game-board-wrapper">
          <img src="/Resources/Game/Connect4/Connect4SetBoard.png" className="board-image" />

          <div className="column-indicators">
            {[0,1,2,3,4,5,6].map(col => (
              <div
                key={col}
                className={`column-indicator ${selectedColumn === col ? 'active' : ''}`}
                onClick={() => handleColumnSelect(col)}
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

          {/* Game grid with pieces */}
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

        {/* Winner message */}
        {gameOver && (
          <div className="winner-message">
            <h2>
              {winner === 'draw'
                ? "It's a Draw!"
                : `${winner === 'red' ? 'Red' : 'Yellow'} Wins!`}
            </h2>
            <button className="reset-btn" onClick={handleReset}>Play Again</button>
          </div>
        )}
      </div>

      {/* Control hints */}
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
          <span className="control-btn" onClick={handleBack}>B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Connect4Game;
