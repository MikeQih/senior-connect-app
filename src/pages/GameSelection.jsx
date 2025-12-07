import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './GameSelection.css';

function GameSelection() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, clearAction } = useController();

  const games = [
    {
      id: 'MatchingPairs',
      name: 'Matching Pairs',
      icon: '/Resources/Game/MatchingPairs/MatchingPairsIcon.png',
      display: '/Resources/Game/MatchingPairs/MatchingPairsDisplay.png',
      route: '/game/matchingpairs'
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
      icon: '/Resources/Game/Connect4/Connect4Icon.png',
      display: '/Resources/Game/Connect4/Connect4Display.png',
      route: '/game/connect4/tutorial'
    }
  ];

  const [focusIndex, setFocusIndex] = useState(0);
  const selectedGame = games[focusIndex];

  const handleConfirm = () => {
    navigate(selectedGame.route);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // ------------------------------------------
  // Controller Input Logic (D-pad / Wheel)
  // ------------------------------------------
  useEffect(() => {
    if (!lastAction?.type) return;

    const action = lastAction.type;

    if (action === "LEFT") {
      setFocusIndex(prev => (prev - 1 + games.length) % games.length);
    }

    if (action === "RIGHT") {
      setFocusIndex(prev => (prev + 1) % games.length);
    }

    if (action === "A") {
      clearAction();
      handleConfirm();
      return;
    }

    if (action === "B") {
      clearAction();
      handleBack();
      return;
    }

    clearAction();
  }, [lastAction]);

  return (
    <div className="game-selection-container">
      <div className="game-selection-content">

        {/* Title */}
        <h1 className="game-display-title">{selectedGame.name}</h1>

        {/* Big game display image */}
        <div className="game-display">
          <img
            src={selectedGame.display}
            alt={selectedGame.name}
            className="game-display-image"
          />
        </div>

        {/* Row of game icons */}
        <div className="game-icons-row">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`game-icon-card ${focusIndex === index ? 'selected' : ''}`}
              onClick={() => setFocusIndex(index)}
            >
              <img src={game.icon} className="game-icon-image" />
              <span className="game-icon-label">{game.name}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Controller Hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img
            src={uiModel === 'ModelR'
              ? '/Resources/ModelR/ChooseIcon.png'
              : '/Resources/ModelD/Arrows.png'}
            alt="Choose"
            className="control-icon"
          />
          <span className="hint-text">CHOOSE</span>
        </div>

        <div className="hint-item">
          <span className="control-btn">A</span>
          <span className="hint-text">SELECT</span>
        </div>

        <div className="hint-item">
          <span className="control-btn">B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default GameSelection;
