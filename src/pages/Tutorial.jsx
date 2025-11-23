import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tutorial.css';

function Tutorial() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 16; // Tutorial images from 1.png to 16.png
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBack = () => {
    navigate('/game/select');
  };

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
            className="nav-arrow"
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
            className="nav-arrow"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            ►
          </button>
        </div>
      </div>

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img src="/Resources/ModelD/Arrows.png" alt="Choose" className="control-icon" />
          <span className="hint-text">NAVIGATE</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleNext}>A</span>
          <span className="hint-text">NEXT</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleBack}>B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
