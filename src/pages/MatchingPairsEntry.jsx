import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './MatchingPairsEntry.css';

function MatchingPairsEntry() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, clearAction } = useController();
  const [selectedButton, setSelectedButton] = useState(0); // 0 = Play, 1 = How to Play
  const [flippedCards, setFlippedCards] = useState([false, true, false, true]); // Cards 1 and 3 show icons initially

  // Auto-flip cards animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFlippedCards(prev => {
        const newFlipped = [...prev];
        // Randomly flip 1-2 cards
        const numToFlip = Math.random() > 0.5 ? 1 : 2;
        for (let i = 0; i < numToFlip; i++) {
          const randomIndex = Math.floor(Math.random() * 4);
          newFlipped[randomIndex] = !newFlipped[randomIndex];
        }
        return newFlipped;
      });
    }, 1500); // Flip every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    navigate('/game/matchingpairs');
  };

  const handleTutorial = () => {
    navigate('/game/matchingpairs/tutorial');
  };

  const handleBack = () => {
    navigate('/game/select');
  };

  // KEYBOARD INPUT
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedButton(0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedButton(1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (selectedButton === 0) {
          handlePlay();
        } else {
          handleTutorial();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedButton]);

  // HARDWARE INPUT
  useEffect(() => {
    if (!lastAction) return;
    const action = lastAction.type;

    if (action === "B") {
      handleBack();
      clearAction();
      return;
    }

    // KNOB (ModelR)
    if (uiModel === "ModelR") {
      if (action === "RIGHT" || action === "LEFT") {
        setSelectedButton(prev => (prev === 0 ? 1 : 0));
        clearAction();
        return;
      }
    }

    // DPAD Navigation
    if (action === "UP") {
      setSelectedButton(0);
      clearAction();
      return;
    }

    if (action === "DOWN") {
      setSelectedButton(1);
      clearAction();
      return;
    }

    if (action === "LEFT" || action === "RIGHT") {
      setSelectedButton(prev => (prev === 0 ? 1 : 0));
      clearAction();
      return;
    }

    if (action === "A") {
      if (selectedButton === 0) {
        handlePlay();
      } else {
        handleTutorial();
      }
      clearAction();
      return;
    }

    clearAction();
  }, [lastAction, selectedButton, uiModel]);

  return (
    <div className="mp-entry-container">
      <div className="mp-entry-content">
        {/* Title */}
        <h1 className="mp-entry-title">Matching Pairs</h1>

        {/* Sample Cards Display */}
        <div className="mp-entry-cards">
          <div className={`mp-entry-card ${flippedCards[0] ? 'flipped' : ''}`}>
            <div className="card-inner">
              <div className="card-back">
                <img src="/Resources/Game/MatchingPairs/card.svg" alt="Card back" />
              </div>
              <div className="card-front">
                <img src="/Resources/Game/MatchingPairs/bike.svg" alt="Bike" />
              </div>
            </div>
          </div>
          <div className={`mp-entry-card ${flippedCards[1] ? 'flipped' : ''}`}>
            <div className="card-inner">
              <div className="card-back">
                <img src="/Resources/Game/MatchingPairs/card.svg" alt="Card back" />
              </div>
              <div className="card-front">
                <img src="/Resources/Game/MatchingPairs/cube.svg" alt="Cube" />
              </div>
            </div>
          </div>
          <div className={`mp-entry-card ${flippedCards[2] ? 'flipped' : ''}`}>
            <div className="card-inner">
              <div className="card-back">
                <img src="/Resources/Game/MatchingPairs/card.svg" alt="Card back" />
              </div>
              <div className="card-front">
                <img src="/Resources/Game/MatchingPairs/bolt.svg" alt="Bolt" />
              </div>
            </div>
          </div>
          <div className={`mp-entry-card ${flippedCards[3] ? 'flipped' : ''}`}>
            <div className="card-inner">
              <div className="card-back">
                <img src="/Resources/Game/MatchingPairs/card.svg" alt="Card back" />
              </div>
              <div className="card-front">
                <img src="/Resources/Game/MatchingPairs/leaf.svg" alt="Leaf" />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mp-entry-buttons">
          <button
            className={`mp-entry-btn mp-entry-play ${selectedButton === 0 ? 'cursor blink' : ''}`}
            onClick={handlePlay}
          >
            <span className="mp-entry-icon">🎮</span>
            <span className="mp-entry-btn-text">Play</span>
          </button>

          <button
            className={`mp-entry-btn mp-entry-tutorial ${selectedButton === 1 ? 'cursor blink' : ''}`}
            onClick={handleTutorial}
          >
            <span className="mp-entry-icon">❓</span>
            <span className="mp-entry-btn-text">How to Play?</span>
          </button>
        </div>
      </div>

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img
            src={
              uiModel === 'ModelR'
                ? '/Resources/ModelR/ChooseIcon.png'
                : '/Resources/ModelD/Arrows.png'
            }
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
          <span className="hint-text">BACK/CANCEL</span>
        </div>
      </div>
    </div>
  );
}

export default MatchingPairsEntry;
