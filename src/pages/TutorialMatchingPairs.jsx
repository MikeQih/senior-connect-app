import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './TutorialMatchingPairs.css';

function TutorialMatchingPairs() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 9;
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, clearAction } = useController();

  const [cursorRow, setCursorRow] = useState(0); // 0 = arrow row, 1 = start button
  const [cursorCol, setCursorCol] = useState(1); // 0 = prev, 1 = next

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleBack = () => navigate('/game/select');

  const handleStartGame = () => navigate('/game/matchingpairs');


  // HARDWARE INPUT
  useEffect(() => {
    if (!lastAction) return;
    let action = lastAction.type;

    const knobIndex = cursorRow === 0 ? cursorCol : 2;  // 0 = left arrow, 1 = right arrow, 2 = start btn

    function applyKnobIndex(i) {
      if (i === 0) {
        setCursorRow(0);
        setCursorCol(0);
      } else if (i === 1) {
        setCursorRow(0);
        setCursorCol(1);
      } else {
        setCursorRow(1);
      }
    }

    if (action === "B") {
      handleBack();
      clearAction();
      return;
    }

    // KNOB
    if (uiModel === "ModelR") {

      if (action === "RIGHT") {
        // clockwise
        const next = (knobIndex + 1) % 3;
        applyKnobIndex(next);
        clearAction();
        return;
      }

      if (action === "LEFT") {
        // anticlockwise
        const prev = (knobIndex + 2) % 3;
        applyKnobIndex(prev);
        clearAction();
        return;
      }
    }

    // DPAD
    if (action === "UP") {
      setCursorRow(prev => Math.max(prev - 1, 0));
      clearAction();
      return;
    }

    if (action === "DOWN") {
      setCursorRow(prev => Math.min(prev + 1, 1));
      clearAction();
      return;
    }

    if (cursorRow === 0) {
      if (action === "LEFT") {
        setCursorCol(prev => Math.max(prev - 1, 0));
        clearAction();
        return;
      }

      if (action === "RIGHT") {
        setCursorCol(prev => Math.min(prev + 1, 1));
        clearAction();
        return;
      }
    }

    if (action === "A") {
      if (cursorRow === 0) {
        if (cursorCol === 0) handlePrevious();
        else handleNext();
      } else {
        handleStartGame();
      }
      clearAction();
      return;
    }

  }, [lastAction, cursorRow, cursorCol, uiModel]);

  return (
    <div className="tutorial-mp-container">
      <div className="tutorial-mp-content">
        <div className="tutorial-mp-image-wrapper">
          <img
            src={`/Resources/Game/MatchingPairs/Tutorial/${currentPage}.png`}
            alt={`Tutorial page ${currentPage}`}
            className="tutorial-mp-image"
          />
        </div>

        <div className="tutorial-mp-navigation">
          <button
            className={`nav-mp-arrow ${cursorRow === 0 && cursorCol === 0 ? "cursor" : ""}`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            ◄
          </button>

          <div className="page-mp-indicator">
            <span className="current-mp-page">{currentPage}</span>
            <span className="page-mp-separator">/</span>
            <span className="total-mp-pages">{totalPages}</span>
          </div>

          <button
            className={`nav-mp-arrow ${cursorRow === 0 && cursorCol === 1 ? "cursor" : ""}`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            ►
          </button>
        </div>

        {/* START BUTTON */}
        <button
          className={`start-mp-game-btn ${cursorRow === 1 ? "cursor" : ""}`}
          onClick={handleStartGame}
        >
          Start the game
        </button>
      </div>

      {/* Control hints */}
      <div className="control-mp-hints">
        <div className="hint-mp-item">
          <img
            src={
              uiModel === 'ModelR'
                ? '/Resources/ModelR/ChooseIcon.png'
                : '/Resources/ModelD/Arrows.png'
            }
            alt="Choose"
            className="control-mp-icon"
          />
          <span className="hint-mp-text">NAVIGATE</span>
        </div>
        <div className="hint-mp-item">
          <span className="control-mp-btn">A</span>
          <span className="hint-mp-text">SELECT</span>
        </div>
        <div className="hint-mp-item">
          <span className="control-mp-btn">B</span>
          <span className="hint-mp-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default TutorialMatchingPairs;
