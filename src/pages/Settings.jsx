import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const { uiModel, toggleUIModel } = useUIModel();

  // Profile settings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // Accessibility settings
  const [language, setLanguage] = useState('English');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [textSize, setTextSize] = useState('Medium');

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <button className="menu-toggle">☰</button>
        <nav className="settings-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <img src="/Resources/Home.png" alt="Dashboard" className="nav-icon" />
            Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <img src="/Resources/Profile.png" alt="Profile" className="nav-icon" />
            Your Profile
          </button>
          <button
            className={`nav-item ${activeSection === 'accessibility' ? 'active' : ''}`}
            onClick={() => setActiveSection('accessibility')}
          >
            <img src="/Resources/Language.png" alt="Accessibility" className="nav-icon" />
            Accessibility
          </button>
          <button
            className={`nav-item ${activeSection === 'chats' ? 'active' : ''}`}
            onClick={() => navigate('/chat')}
          >
            <img src="/Resources/ModelD/Messenger.png" alt="Chats" className="nav-icon" />
            Chats
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="settings-main">
        <div className="settings-card">
          <div className="settings-header">
            <h1>Settings</h1>
            <button className="notification-btn">
              <img src="/Resources/Notification.png" alt="Notifications" className="notification-icon" />
            </button>
          </div>

          {activeSection === 'profile' && (
            <div className="settings-content">
              <h2>Your Profile</h2>

              <div className="profile-picture-section">
                <div className="profile-picture-placeholder">
                  <span className="upload-icon"></span>
                  <p>Upload your photo</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="19"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="xxxxxxxxxx"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
            </div>
          )}

          {activeSection === 'accessibility' && (
            <div className="settings-content">
              <h2>Accessibility Settings</h2>

              <div className="accessibility-options">
                <div className="accessibility-item">
                  <label>Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="English">English</option>
                    <option value="Chinese">中文</option>
                    <option value="Malay">Bahasa Melayu</option>
                    <option value="Tamil">தமிழ்</option>
                  </select>
                </div>

                <div className="accessibility-item">
                  <label>Color Blind Mode</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="colorBlind"
                      checked={colorBlindMode}
                      onChange={(e) => setColorBlindMode(e.target.checked)}
                    />
                    <label htmlFor="colorBlind" className="toggle-label">
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="accessibility-item">
                  <label>Text/Button Size</label>
                  <div className="size-options">
                    <button
                      className={`size-btn ${textSize === 'Small' ? 'active' : ''}`}
                      onClick={() => setTextSize('Small')}
                    >
                      Small
                    </button>
                    <button
                      className={`size-btn ${textSize === 'Medium' ? 'active' : ''}`}
                      onClick={() => setTextSize('Medium')}
                    >
                      Medium
                    </button>
                    <button
                      className={`size-btn ${textSize === 'Large' ? 'active' : ''}`}
                      onClick={() => setTextSize('Large')}
                    >
                      Large
                    </button>
                  </div>
                </div>

                <div className="accessibility-item">
                  <label>UI Model</label>
                  <div className="size-options">
                    <button
                      className={`size-btn ${uiModel === 'ModelD' ? 'active' : ''}`}
                      onClick={() => toggleUIModel('ModelD')}
                    >
                      Model D
                    </button>
                    <button
                      className={`size-btn ${uiModel === 'ModelR' ? 'active' : ''}`}
                      onClick={() => toggleUIModel('ModelR')}
                    >
                      Model R
                    </button>
                  </div>
                </div>
              </div>

              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
            </div>
          )}
        </div>
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
          <span className="control-btn" onClick={handleBack}>B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Settings;
