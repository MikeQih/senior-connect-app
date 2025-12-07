import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, sendAction, clearAction } = useController();
  const [ selectedOption, setSelectedOption ] = useState('play');

  useEffect(() => {
  if (!lastAction || !lastAction.type) return;

  const action = lastAction.type;

  if (action === "UP") {
    setSelectedOption(prev =>
      prev === "play" ? "settings" :
      prev === "settings" ? "chat" :
      "play"
    );
  }

  if (action === "DOWN") {
    setSelectedOption(prev =>
      prev === "play" ? "chat" :
      prev === "chat" ? "settings" :
      "play"
    );
  }

  if (action === "A") {
    clearAction();
    setTimeout(() => handleConfirm(), 0);
    return;
  }

  clearAction();

}, [lastAction]);


  const handleConfirm = () => {
    if (selectedOption === 'play') navigate('/game/select');
    if (selectedOption === 'chat') navigate('/chat');
    if (selectedOption === 'settings') navigate('/settings');
  };

  // MODEL D UI
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

        {/* Control hints */}
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

  // MODEL R UI
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
