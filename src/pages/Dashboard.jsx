import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('play');
  const navigate = useNavigate();

  const handlePlay = () => {
    setSelectedOption('play');
    // Navigate to game selection page
    navigate('/game/select');
  };

  const handleChat = () => {
    setSelectedOption('chat');
    // Navigate to chat page
    navigate('/chat');
  };

  const handleSettings = () => {
    setSelectedOption('settings');
    // Navigate to settings page
    navigate('/settings');
  };

  return (
    <div className="dashboard-container">
      {/* Main content */}
      <div className="dashboard-content">
        <button
          className={`menu-btn ${selectedOption === 'play' ? 'selected' : ''}`}
          onClick={handlePlay}
        >
          <img src="/Resources/ModelD/Console.png" alt="Play" className="btn-icon" />
          <span className="btn-text">Play</span>
        </button>

        <button
          className={`menu-btn ${selectedOption === 'chat' ? 'selected' : ''}`}
          onClick={handleChat}
        >
          <img src="/Resources/ModelD/Messenger.png" alt="Chat" className="btn-icon" />
          <span className="btn-text">Chat</span>
        </button>

        <button
          className={`menu-btn ${selectedOption === 'settings' ? 'selected' : ''}`}
          onClick={handleSettings}
        >
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
          <span className="control-btn">A</span>
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
