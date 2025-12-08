import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const { uiModel, toggleUIModel } = useUIModel();
  const { lastAction, clearAction } = useController();
  const [language, setLanguage] = useState('English');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [textSize, setTextSize] = useState('Medium');

  const [cursorRow, setCursorRow] = useState(0);
  const [cursorCol, setCursorCol] = useState(0);

  const [cursorIndex, setCursorIndex] = useState(0);

  // Mapping rows to selectable items within each row
  const rowToIndices = [
    [0], 
    [1], 
    [2, 3, 4], 
    [5, 6], 
    [7] 
  ];

  const MAX_ROWS = rowToIndices.length - 1;

  useEffect(() => {
    const target = rowToIndices[cursorRow][cursorCol];
    setCursorIndex(target);
  }, [cursorRow, cursorCol]);


  // HARDWARE INPUT
  useEffect(() => {
    if (!lastAction?.type) return;
    const action = lastAction.type;

    let normalized = action;
    if (uiModel === "ModelR") {
      if (action === "RIGHT") normalized = "DOWN";
      if (action === "LEFT") normalized = "UP";
    }

    if (action === "B") {
      navigate('/dashboard');
      clearAction();
      return;
    }

    // DPAD
    if (uiModel === "ModelD") {
      if (action === "UP") {
        setCursorRow(prev => Math.max(prev - 1, 0));
        setCursorCol(0);
        clearAction();
        return;
      }

      if (action === "DOWN") {
        setCursorRow(prev => Math.min(prev + 1, MAX_ROWS));
        setCursorCol(0);
        clearAction();
        return;
      }

      if (action === "LEFT") {
        const maxCol = rowToIndices[cursorRow].length - 1;
        setCursorCol(prev => Math.max(prev - 1, 0));
        clearAction();
        return;
      }

      if (action === "RIGHT") {
        const maxCol = rowToIndices[cursorRow].length - 1;
        setCursorCol(prev => Math.min(prev + 1, maxCol));
        clearAction();
        return;
      }
    }

    // KNOB
    if (uiModel === "ModelR") {
      if (normalized === "UP") {
        setCursorIndex(prev => (prev - 1 + 8) % 8);
        clearAction();
        return;
      }
      if (normalized === "DOWN") {
        setCursorIndex(prev => (prev + 1) % 8);
        clearAction();
        return;
      }
    }

    if (action === "A") {
      switch (cursorIndex) {
        case 0: break;
        case 1: setColorBlindMode(prev => !prev); break;
        case 2: setTextSize("Small"); break;
        case 3: setTextSize("Medium"); break;
        case 4: setTextSize("Large"); break;
        case 5: toggleUIModel("ModelD"); break;
        case 6: toggleUIModel("ModelR"); break;
        case 7: alert("Accessibility settings saved!"); break;
      }
      clearAction();
    }

  }, [lastAction, uiModel, cursorRow, cursorCol, cursorIndex]);


  /* Helper for highlighting */
  const isCursor = (idx) => cursorIndex === idx;

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        <div className="settings-main">
          <div className="settings-card">
            <div className="settings-header">
              <h1>Accessibility Settings</h1>
            </div>

            <div className="settings-content">

              {/* LANGUAGE */}
              <div className="accessibility-item">
                <label>Language</label>
                <select
                  className={isCursor(0) ? "cursor" : ""}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Chinese">中文</option>
                  <option value="Malay">Bahasa Melayu</option>
                  <option value="Tamil">தமிழ்</option>
                </select>
              </div>

              {/* COLOR BLIND MODE */}
              <div className="accessibility-item">
                <label>Color Blind Mode</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="colorBlind"
                    checked={colorBlindMode}
                    onChange={(e) => setColorBlindMode(e.target.checked)}
                  />
                  <label
                    htmlFor="colorBlind"
                    className={`toggle-label ${isCursor(1) ? "cursor" : ""}`}
                  >
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              {/* TEXT SIZE */}
              <div className="accessibility-item">
                <label>Text Size</label>
                <div className="size-options">
                  <button className={`size-btn ${textSize === 'Small' ? 'active' : ''} ${isCursor(2) ? 'cursor' : ''}`}>
                    Small
                  </button>
                  <button className={`size-btn ${textSize === 'Medium' ? 'active' : ''} ${isCursor(3) ? 'cursor' : ''}`}>
                    Medium
                  </button>
                  <button className={`size-btn ${textSize === 'Large' ? 'active' : ''} ${isCursor(4) ? 'cursor' : ''}`}>
                    Large
                  </button>
                </div>
              </div>

              {/* UI MODEL */}
              <div className="accessibility-item">
                <label>UI Model</label>
                <div className="size-options">
                  <button className={`size-btn ${uiModel === 'ModelD' ? 'active' : ''} ${isCursor(5) ? 'cursor' : ''}`}>
                    Model D
                  </button>
                  <button className={`size-btn ${uiModel === 'ModelR' ? 'active' : ''} ${isCursor(6) ? 'cursor' : ''}`}>
                    Model R
                  </button>
                </div>
              </div>

              <button className={`btn-save ${isCursor(7) ? "cursor" : ""}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
