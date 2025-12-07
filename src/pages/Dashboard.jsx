import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();

  // Track selected option
  const [selectedOption, setSelectedOption] = useState('play');

  // Handle confirm (A button)
  const handleConfirm = () => {
    if (selectedOption === 'play') navigate('/game/select');
    if (selectedOption === 'chat') navigate('/chat');
    if (selectedOption === 'settings') navigate('/settings');
  };

  // Keyboard (ModelR)
  useEffect(() => {
    if (uiModel !== "ModelR") return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        if (selectedOption === 'play') setSelectedOption('settings');
        else if (selectedOption === 'settings') setSelectedOption('chat');
        else if (selectedOption === 'chat') setSelectedOption('play');
      }
      else if (e.key === 'ArrowLeft') {
        if (selectedOption === 'play') setSelectedOption('chat');
        else if (selectedOption === 'chat') setSelectedOption('settings');
        else if (selectedOption === 'settings') setSelectedOption('play');
      }
      else if (e.key === 'a' || e.key === ' ') {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);

  }, [selectedOption, uiModel]);

  // MODEL D ----------------------------
  if (uiModel === "ModelD") {
    return (
      <div className="dashboard-container">

        <div className="dashboard-content">
          <button
            className={`menu-btn ${selectedOption === 'play' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('play')}
          >
            <img src="/Resources/ModelD/Console.png" className="btn-icon" />
            <span className="btn-text">Play</span>
          </button>

          <button
            className={`menu-btn ${selectedOption === 'chat' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('chat')}
          >
            <img src="/Resources/ModelD/Messenger.png" className="btn-icon" />
            <span className="btn-text">Chat</span>
          </button>

          <button
            className={`menu-btn ${selectedOption === 'settings' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('settings')}
          >
            <img src="/Resources/ModelD/Setting.png" className="btn-icon" />
            <span className="btn-text">Settings</span>
          </button>
        </div>

        <div className="control-hints">
          <div className="hint-item">
            <img src="/Resources/ModelD/Arrows.png" className="control-icon" />
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

  // MODEL R ----------------------------
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">

        <div className="click-wheel-wrapper">
          <img
            src={
              selectedOption === "play"
                ? "/Resources/ModelR/ClickWheelPlay.png"
                : selectedOption === "chat"
                ? "/Resources/ModelR/ClickWheelChat.png"
                : "/Resources/ModelR/ClickWheelSetting.png"
            }
            className="click-wheel"
          />
        </div>

      </div>

      <div className="control-hints">
        <div className="hint-item">
          <img src="/Resources/ModelR/ChooseIcon.png" className="control-icon" />
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
