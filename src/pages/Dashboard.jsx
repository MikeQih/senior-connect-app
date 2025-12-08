import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUIModel } from "../contexts/UIModelContext";
import { useController } from "../hardware/ControllerContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();

  const { lastAction, clearAction, knobAngle } = useController();

  const [selectedOption, setSelectedOption] = useState("play");

  // DPAD + KNOB INPUTS
  useEffect(() => {
    if (!lastAction || !lastAction.type) return;

    const action = lastAction.type;
    let normalized = action;

    // Map knob rotation to UP/DOWN movement
    if (uiModel === "ModelR") {
      if (action === "LEFT") normalized = "UP";
      if (action === "RIGHT") normalized = "DOWN";
    }

    if (normalized === "UP" || normalized === "DOWN") {
      const options =
        uiModel === "ModelR"
          ? ["play", "settings", "chat"]  
          : ["play", "chat", "settings"];

      let idx = options.indexOf(selectedOption);

      if (normalized === "UP") idx = (idx - 1 + options.length) % options.length;
      else idx = (idx + 1) % options.length;

      setSelectedOption(options[idx]);
    }

    if (action === "A") handleConfirm();

    clearAction();
  }, [lastAction, uiModel]);

  function handleConfirm() {
    if (selectedOption === "play") navigate("/game/select");
    if (selectedOption === "chat") navigate("/chat");
    if (selectedOption === "settings") navigate("/settings");
  }

  if (uiModel === "ModelD") {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <button className={`menu-btn ${selectedOption === "play" ? "selected" : ""}`}
                  onClick={() => setSelectedOption("play")}>
            <img src="/Resources/ModelD/Console.png" className="btn-icon" />
            <span className="btn-text">Play</span>
          </button>

          <button className={`menu-btn ${selectedOption === "chat" ? "selected" : ""}`}
                  onClick={() => setSelectedOption("chat")}>
            <img src="/Resources/ModelD/Messenger.png" className="btn-icon" />
            <span className="btn-text">Chat</span>
          </button>

          <button className={`menu-btn ${selectedOption === "settings" ? "selected" : ""}`}
                  onClick={() => setSelectedOption("settings")}>
            <img src="/Resources/ModelD/Setting.png" className="btn-icon" />
            <span className="btn-text">Settings</span>
          </button>
        </div>

        <div className="control-hints">
          <div className="hint-item"><img src="/Resources/ModelD/Arrows.png" className="control-icon" /><span>CHOOSE</span></div>
          <div className="hint-item"><span className="control-btn" onClick={handleConfirm}>A</span><span>CONFIRM</span></div>
          <div className="hint-item"><span className="control-btn">B</span><span>BACK</span></div>
        </div>
      </div>
    );
  }

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
          <span>CHOOSE</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleConfirm}>A</span>
          <span>CONFIRM</span>
        </div>
        <div className="hint-item">
          <span className="control-btn">B</span>
          <span>BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
