import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [isVisible, setIsVisible] = useState(false);

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
          <h1>欢迎来到 SeniorConnect+</h1>
          <p>连接长者，温暖家庭</p>
        </div>

        <div className={`button-container ${isVisible ? 'fade-in-delay-2' : ''}`}>
          <button className="btn-primary">开始使用</button>
          <button className="btn-secondary">了解更多</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
