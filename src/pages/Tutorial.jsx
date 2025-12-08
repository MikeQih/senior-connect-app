import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './Tutorial.css';

function Tutorial() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 16;
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

  const handleStartGame = () => navigate('/game/connect4/play');


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
    <div className="tutorial-container">
      <div className="tutorial-content">
        <div className="tutorial-image-wrapper">
          <img
            src={`/Resources/Game/Connect4/Tutorial/${currentPage}.png`}
            alt={`Tutorial page ${currentPage}`}
            className="tutorial-image"
          />
        </div>

        <div className="tutorial-navigation">
          <button
            className={`nav-arrow ${cursorRow === 0 && cursorCol === 0 ? "cursor" : ""}`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            ◄
          </button>

          <div className="page-indicator">
            <span className="current-page">{currentPage}</span>
            <span className="page-separator">/</span>
            <span className="total-pages">{totalPages}</span>
          </div>

          <button
            className={`nav-arrow ${cursorRow === 0 && cursorCol === 1 ? "cursor" : ""}`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            ►
          </button>
        </div>

        {/* START BUTTON */}
        <button
          className={`start-game-btn ${cursorRow === 1 ? "cursor" : ""}`}
          onClick={handleStartGame}
        >
          Start the game
        </button>
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
          <span className="hint-text">NAVIGATE</span>
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

export default Tutorial;
