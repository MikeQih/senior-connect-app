import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useController } from '../hardware/ControllerContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { lastAction, clearAction } = useController();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  // 0=email, 1=password, 2=login button, 3=signup button
  const [focusIndex, setFocusIndex] = useState(0);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = () => {
    // Navigate to dashboard after login
    navigate('/dashboard');
  };

  const handleSignup = () => {
    // Navigate to signup page or show signup form
    navigate('/signup');
  };

  const handleBack = () => {
    // Navigate back to home
    navigate('/');
  };

  useEffect(() => {
  if (!lastAction?.type) return;

  const action = lastAction.type;

  if (action === "UP") {
    setFocusIndex(prev => (prev - 1 + 4) % 4);
  }

  if (action === "DOWN") {
    setFocusIndex(prev => (prev + 1) % 4);
  }

  if (action === "B") {
    clearAction();
    navigate("/");
    return;
  }

  if (action === "A") {
    if (focusIndex === 0) {
      setActiveInput("email");
      setShowKeyboard(true);
      emailRef.current.focus();
    }
    else if (focusIndex === 1) {
      setActiveInput("password");
      setShowKeyboard(true);
      passwordRef.current.focus();
    }
    else if (focusIndex === 2) {
      clearAction();
      handleLogin();
      return;
    }
    else if (focusIndex === 3) {
      clearAction();
      handleSignup();
      return;
    }
  }

  clearAction();
}, [lastAction]);

  // Auto-switch keyboard input
  useEffect(() => {
    if (!showKeyboard) return;

    if (focusIndex === 1 && activeInput === "email") {
      setActiveInput("password");
      passwordRef.current?.focus();
    }

    if (focusIndex === 0 && activeInput === "password") {
      setActiveInput("email");
      emailRef.current?.focus();
    }
  }, [focusIndex]);

  // Auto-close keyboard at login/signup button
  useEffect(() => {
    if (!showKeyboard) return;

    if (focusIndex > 1) {
      setShowKeyboard(false);
      setActiveInput(null);
    }
  }, [focusIndex]);

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-logo">
          <img src="/Resources/Family.png" alt="SeniorConnect+" />
          <h2>SeniorConnect+</h2>
        </div>

        <div className="login-form">

          <div className={`form-group ${focusIndex === 0 ? "focused" : ""}`}>
            <label>Email Address</label>
            <input
              tabIndex="-1"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@gmail.com"
            />
          </div>

          <div className={`form-group ${focusIndex === 1 ? "focused" : ""}`}>
            <label>Password</label>
            <input
              tabIndex="-1"
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
            />
          </div>

          <button
            className={`btn-login ${focusIndex === 2 ? "focused-btn" : ""}`}
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className={`btn-signup ${focusIndex === 3 ? "focused-btn" : ""}`}
            onClick={handleSignup}
          >
            Sign Up
          </button>


        </div>
      </div>

      {showKeyboard && (
        <div className="keyboard-overlay">
          <div className="keyboard">
            {"1234567890abcdefghijklmnopqrstuvwxyz@._".split("").map((k) => (
              <button
                key={k}
                className="key"
                onClick={() => {
                  if (activeInput === "email") setEmail((prev) => prev + k);
                  else setPassword((prev) => prev + k);
                }}
              >
                {k}
              </button>
            ))}

            <button
              className="key key-backspace"
              onClick={() => {
                if (activeInput === "email") setEmail((prev) => prev.slice(0, -1));
                else setPassword((prev) => prev.slice(0, -1));
              }}
            >
              ⌫
            </button>

            <button
              className="key key-done"
              onClick={() => setShowKeyboard(false)}
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
