import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useController } from '../hardware/ControllerContext';
import { useUIModel } from '../contexts/UIModelContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { lastAction, clearAction } = useController();
  const { uiModel } = useUIModel(); // Detect Model D or Model R

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const [focusIndex, setFocusIndex] = useState(0); // 0: email, 1: password, 2: login, 3: signup

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = () => navigate('/dashboard');
  const handleSignup = () => navigate('/signup');
  const handleBack = () => navigate('/');

  // HARDWARE INPUT
  useEffect(() => {
    if (!lastAction?.type) return;
    let action = lastAction.type;

    if (uiModel === "ModelR") {
      if (action === "RIGHT") action = "DOWN"; 
      if (action === "LEFT") action = "UP";
    }

    if (action === "B") {
      clearAction();
      handleBack();
      return;
    }

    if (action === "UP") {
      setFocusIndex(prev => (prev - 1 + 4) % 4);
      clearAction();
      return;
    }

    if (action === "DOWN") {
      setFocusIndex(prev => (prev + 1) % 4);
      clearAction();
      return;
    }

    if (action === "A") {
      if (focusIndex === 0) {
        setActiveInput("email");
        setShowKeyboard(true);
        emailRef.current?.focus();
      }
      else if (focusIndex === 1) {
        setActiveInput("password");
        setShowKeyboard(true);
        passwordRef.current?.focus();
      }
      else if (focusIndex === 2) {
        handleLogin();
      }
      else if (focusIndex === 3) {
        handleSignup();
      }

      clearAction();
      return;
    }

    clearAction();
  }, [lastAction, uiModel]);


  // SWITCH INPUT FOCUS WHEN KEYBOARD IS OPEN
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

  // CLOSE KEYBOARD WHEN DONE
  useEffect(() => {
    if (!showKeyboard) return;

    if (focusIndex >= 2) {
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

          {/* EMAIL FIELD */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              tabIndex="-1"
              ref={emailRef}
              className={focusIndex === 0 ? "input-focused" : ""}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              tabIndex="-1"
              ref={passwordRef}
              className={focusIndex === 1 ? "input-focused" : ""}
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
                  if (activeInput === "email") setEmail(prev => prev + k);
                  else setPassword(prev => prev + k);
                }}
              >
                {k}
              </button>
            ))}

            <button
              className="key key-backspace"
              onClick={() => {
                if (activeInput === "email") setEmail(prev => prev.slice(0, -1));
                else setPassword(prev => prev.slice(0, -1));
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
