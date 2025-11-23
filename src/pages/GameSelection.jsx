import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSelection.css';

function GameSelection() {
  const [selectedGame, setSelectedGame] = useState('Connect4');
  const navigate = useNavigate();

  const games = [
    {
      id: 'MatchingPairs',
      name: 'Matching Pairs',
      icon: '/Resources/Game/MatchingPairs/MatchingPairsIcon.png',
      display: '/Resources/Game/MatchingPairs/MatchingPairsDisplay.png',
      route: '/game/matchingpairs/tutorial'
    },
    {
      id: 'Solitaire',
      name: 'Solitaire',
      icon: '/Resources/Game/Solitaire/SolitaireIcon.png',
      display: '/Resources/Game/Solitaire/SolitaireDisplay.png',
      route: '/game/solitaire/tutorial'
    },
    {
      id: 'Connect4',
      name: 'Connect 4',
      icon: '/Resources/Game/Connect4/Connect4Display.png',
      display: '/Resources/Game/Connect4/Connect4Icon.png',
      route: '/game/connect4/tutorial'
    }
  ];

  const currentGame = games.find(game => game.id === selectedGame);

  const handleGameClick = (gameId) => {
    setSelectedGame(gameId);
    // Navigate to the game's tutorial page
    const game = games.find(g => g.id === gameId);
    if (game) {
      navigate(game.route);
    }
  };

  const handleConfirm = () => {
    const game = games.find(g => g.id === selectedGame);
    if (game) {
      navigate(game.route);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="game-selection-container">
      <div className="game-selection-content">
        {/* Game Display Title */}
        <h1 className="game-display-title">{currentGame?.name}</h1>

        {/* Game Display Image */}
        <div className="game-display">
          <img
            src={currentGame?.display}
            alt={currentGame?.name}
            className="game-display-image"
          />
        </div>

        {/* Game Icons */}
        <div className="game-icons-row">
          {games.map((game) => (
            <div
              key={game.id}
              className={`game-icon-card ${selectedGame === game.id ? 'selected' : ''}`}
              onClick={() => handleGameClick(game.id)}
            >
              <img
                src={game.icon}
                alt={game.name}
                className="game-icon-image"
              />
              <span className="game-icon-label">{game.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img src="/Resources/ModelD/Arrows.png" alt="Choose" className="control-icon" />
          <span className="hint-text">CHOOSE</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleConfirm}>A</span>
          <span className="hint-text">SELECT/RECORD</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleBack}>B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default GameSelection;
