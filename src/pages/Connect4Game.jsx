import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import './Connect4Game.css';

function Connect4Game() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const [currentPlayer, setCurrentPlayer] = useState('red'); // 'red' or 'yellow'
  const [round, setRound] = useState(1);
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(3); // Start at middle column
  const [moveCount, setMoveCount] = useState(0); // Track number of moves

  // Keyboard controls
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

  // Check if board is full (draw)
  const isBoardFull = (board) => {
    return board.every(row => row.every(cell => cell !== null));
  };

  // Handle dropping a piece
  const handleDropPiece = () => {
    if (gameOver) return;

    // Find the lowest empty row in the selected column
    let rowIndex = -1;
    for (let i = 5; i >= 0; i--) {
      if (board[i][selectedColumn] === null) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) return; // Column is full

    // Place the piece
    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][selectedColumn] = currentPlayer;
    setBoard(newBoard);

    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    // Check for winner
    if (checkWinner(newBoard, rowIndex, selectedColumn, currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
    } else if (isBoardFull(newBoard)) {
      // Check for draw
      setGameOver(true);
      setWinner('draw');
    } else {
      // Switch player and update round after both players have moved
      const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      setCurrentPlayer(nextPlayer);

      // Increment round after yellow's turn (both players have moved)
      if (nextPlayer === 'red') {
        setRound(round + 1);
      }
    }
  };

  // Check if current move results in a win
  const checkWinner = (board, row, col, player) => {
    // Check horizontal
    let count = 1;
    // Check left
    for (let c = col - 1; c >= 0 && board[row][c] === player; c--) count++;
    // Check right
    for (let c = col + 1; c < 7 && board[row][c] === player; c++) count++;
    if (count >= 4) return true;

    // Check vertical
    count = 1;
    // Check down
    for (let r = row + 1; r < 6 && board[r][col] === player; r++) count++;
    if (count >= 4) return true;

    // Check diagonal (top-left to bottom-right)
    count = 1;
    for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i] === player; i++) count++;
    for (let i = 1; row + i < 6 && col + i < 7 && board[row + i][col + i] === player; i++) count++;
    if (count >= 4) return true;

    // Check diagonal (bottom-left to top-right)
    count = 1;
    for (let i = 1; row + i < 6 && col - i >= 0 && board[row + i][col - i] === player; i++) count++;
    for (let i = 1; row - i >= 0 && col + i < 7 && board[row - i][col + i] === player; i++) count++;
    if (count >= 4) return true;

    return false;
  };

  const handleReset = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setCurrentPlayer('red');
    setGameOver(false);
    setWinner(null);
    setRound(1); // Reset to Round 1 for new game
    setMoveCount(0);
    setSelectedColumn(3);
  };

  const handleBack = () => {
    navigate('/game/connect4/tutorial');
  };

  const handleColumnSelect = (colIndex) => {
    setSelectedColumn(colIndex);
  };

  return (
    <div className="connect4-game-container">
      {/* Background images */}
      <img src="/Resources/Game/Connect4/NatureBackground.png" alt="Background" className="nature-background" />
      <img src="/Resources/Game/Connect4/BackgroundSignal.png" alt="Signal" className="background-signal" />

      <div className="connect4-game-content">
        {/* Round indicator */}
        <div className="round-indicator">
          <span>Round {round}</span>
        </div>

        {/* Game board */}
        <div className="game-board-wrapper">
          <img src="/Resources/Game/Connect4/Connect4SetBoard.png" alt="Board" className="board-image" />

          {/* Column selection indicators */}
          <div className="column-indicators">
            {[0, 1, 2, 3, 4, 5, 6].map((colIndex) => (
              <div
                key={colIndex}
                className={`column-indicator ${selectedColumn === colIndex ? 'active' : ''}`}
                onClick={() => handleColumnSelect(colIndex)}
              >
                {selectedColumn === colIndex && !gameOver && (
                  <img
                    src={`/Resources/Game/Connect4/${currentPlayer === 'red' ? 'RedBall' : 'YellowBall'}.png`}
                    alt={currentPlayer}
                    className="indicator-ball"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Game grid with pieces */}
          <div className="game-grid">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`grid-cell ${selectedColumn === colIndex ? 'highlighted' : ''}`}
                  >
                    {cell && (
                      <img
                        src={`/Resources/Game/Connect4/${cell === 'red' ? 'RedBall' : 'YellowBall'}.png`}
                        alt={cell}
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
            src={uiModel === 'ModelR' ? '/Resources/ModelR/ChooseIcon.png' : '/Resources/ModelD/Arrows.png'}
            alt="Choose"
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
