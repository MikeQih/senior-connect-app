import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in animation on component mount
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className={`logo-container ${isVisible ? 'fade-in' : ''}`}>
          <img
            src="/Resources/Family.png"
            alt="SeniorConnect+"
            className="logo"
          />
        </div>

        <div className={`welcome-text ${isVisible ? 'fade-in-delay' : ''}`}>
          <h1>Welcome to SeniorConnect+</h1>
          <p>Bridging Generations, Strengthening Families</p>
        </div>

        <div className={`button-container ${isVisible ? 'fade-in-delay-2' : ''}`}>
          <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
