import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();

  // Keyboard controls for ModelR
  useEffect(() => {
    if (uiModel === 'ModelR') {
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowRight') {
          // Cycle backwards (clockwise): play -> settings -> chat -> play
          if (selectedOption === 'play') setSelectedOption('settings');
          else if (selectedOption === 'chat') setSelectedOption('play');
          else if (selectedOption === 'settings') setSelectedOption('chat');
        } else if (e.key === 'ArrowLeft') {
          // Cycle forwards (counter-clockwise): play -> chat -> settings -> play
          if (selectedOption === 'play') setSelectedOption('chat');
          else if (selectedOption === 'chat') setSelectedOption('settings');
          else if (selectedOption === 'settings') setSelectedOption('play');
        } else if (e.key === 'a' || e.key === 'A' || e.key === ' ') {
          handleConfirm();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedOption, uiModel]);

  // Handle click on wheel sections (for ModelR)
  const handleWheelClick = (e) => {
    if (uiModel !== 'ModelR') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate angle from center (0 degrees is to the right, increases clockwise)
    const angleRad = Math.atan2(clickY - centerY, clickX - centerX);
    const angleDeg = angleRad * (180 / Math.PI);

    // Normalize angle to 0-360 degrees (0 is right, 90 is down, 180 is left, 270 is up)
    const normalizedAngle = (angleDeg + 360) % 360;

    // Divide the wheel into 3 sections of 120 degrees each
    // Play: 270-30 degrees (top, centered at 330/0)
    // Settings: 30-150 degrees (bottom-right, centered at 90)
    // Chat: 150-270 degrees (bottom-left, centered at 210)

    let newOption = selectedOption; // Default to current selection

    if (normalizedAngle >= 270 || normalizedAngle < 30) {
      // Top section - Play
      newOption = 'play';
    } else if (normalizedAngle >= 30 && normalizedAngle < 150) {
      // Bottom-right section - Settings
      newOption = 'settings';
    } else {
      // Bottom-left section - Chat
      newOption = 'chat';
    }

    // Only update if clicking a different option
    if (newOption !== selectedOption) {
      setSelectedOption(newOption);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (selectedOption === 'play') {
      navigate('/game/select');
    } else if (selectedOption === 'chat') {
      navigate('/chat');
    } else if (selectedOption === 'settings') {
      navigate('/settings');
    }
  };

  // Get the wheel image based on selected option (for ModelR)
  const getWheelImage = () => {
    switch (selectedOption) {
      case 'play':
        return '/Resources/ModelR/ClickWheelPlay.png';
      case 'chat':
        return '/Resources/ModelR/ClickWheelChat.png';
      case 'settings':
        return '/Resources/ModelR/ClickWheelSetting.png';
      default:
        return '/Resources/ModelR/ClickWheelPlay.png';
    }
  };

  // Get ChooseIcon position based on selected option
  const getChooseIconPosition = () => {
    // Position the icon based on which section is selected
    // Wheel layout: Play (top), Chat (bottom-left), Settings (bottom-right)
    switch (selectedOption) {
      case 'play':
        return { top: '8%', left: '50%', transform: 'translateX(-50%)' }; // Top center
      case 'chat':
        return { bottom: '20%', left: '18%', transform: 'none' }; // Bottom left
      case 'settings':
        return { bottom: '20%', right: '18%', transform: 'none' }; // Bottom right
      default:
        return { top: '8%', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  // Render ModelD (original button layout)
  if (uiModel === 'ModelD') {
    return (
      <div className="dashboard-container">
        {/* Main content */}
        <div className="dashboard-content">
          <button
            className={`menu-btn ${selectedOption === 'play' ? 'selected' : ''}`}
            onClick={() => handleSelect('play')}
          >
            <img src="/Resources/ModelD/Console.png" alt="Play" className="btn-icon" />
            <span className="btn-text">Play</span>
          </button>

          <button
            className={`menu-btn ${selectedOption === 'chat' ? 'selected' : ''}`}
            onClick={() => handleSelect('chat')}
          >
            <img src="/Resources/ModelD/Messenger.png" alt="Chat" className="btn-icon" />
            <span className="btn-text">Chat</span>
          </button>

          <button
            className={`menu-btn ${selectedOption === 'settings' ? 'selected' : ''}`}
            onClick={() => handleSelect('settings')}
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

  // Render ModelR (click wheel layout)
  return (
    <div className="dashboard-container">
      {/* Main content */}
      <div className="dashboard-content">
        {/* Click Wheel */}
        <div className="click-wheel-wrapper" onClick={handleWheelClick}>
          <img src={getWheelImage()} alt="Click Wheel" className="click-wheel" />
        </div>
      </div>

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img src="/Resources/ModelR/ChooseIcon.png" alt="Choose" className="control-icon" />
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
