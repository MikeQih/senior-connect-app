import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useController } from '../hardware/ControllerContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { lastAction, clearAction } = useController();

  const options = ["play", "chat", "settings"];
  const [focusIndex, setFocusIndex] = useState(0);

  const selectedOption = options[focusIndex];

  const handleConfirm = () => {
    if (selectedOption === 'play') {
      navigate('/game/select');
    } else if (selectedOption === 'chat') {
      navigate('/chat');
    } else if (selectedOption === 'settings') {
      navigate('/settings');
    }
  };

  useEffect(() => {
    if (!lastAction?.type) return;

    const action = lastAction.type;

    if (action === "UP") {
      setFocusIndex(prev => (prev - 1 + 3) % 3);
    }

    if (action === "DOWN") {
      setFocusIndex(prev => (prev + 1) % 3);
    }

    if (action === "A") {
      clearAction();
      handleConfirm();
    }

    clearAction();
  }, [lastAction]);

  return (
    <div className="dashboard-container">
      {/* Main content */}
      <div className="dashboard-content">

        <button className={`menu-btn ${focusIndex === 0 ? "selected" : ""}`}>
          <img src="/Resources/ModelD/Console.png" alt="Play" className="btn-icon" />
          <span className="btn-text">Play</span>
        </button>

        <button className={`menu-btn ${focusIndex === 1 ? "selected" : ""}`}>
          <img src="/Resources/ModelD/Messenger.png" alt="Chat" className="btn-icon" />
          <span className="btn-text">Chat</span>
        </button>

        <button className={`menu-btn ${focusIndex === 2 ? "selected" : ""}`}>
          <img src="/Resources/ModelD/Setting.png" alt="Settings" className="btn-icon" />
          <span className="btn-text">Settings</span>
        </button>
      </div>

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img src="/Resources/ModelD/Arrows.png" alt="Choose" className="control-icon" />
          <span className="hint-text">CHOOSE</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleConfirm}>A</span>
          <span className="hint-text">CONFIRM</span>
        </div>
        <div className="hint-item">
          <span className="control-btn">B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
