import "./Hardware.css";
import dpadImage from "../assets/hardware/DPAD.svg";
import knobImage from "../assets/hardware/knob.png";
import aButtonImage from "../assets/hardware/A_btn.svg";
import bButtonImage from "../assets/hardware/B_btn.svg";
import { useController } from "./ControllerContext";
import { useUIModel } from "../contexts/UIModelContext";
import { useState, useEffect } from "react";

export default function HardwareSimulator() {
  const { sendAction, sendKnobRotation } = useController();
  const { uiModel } = useUIModel();
  const [rotation, setRotation] = useState(0);

  function handle(action) {
    sendAction(action);

    const debug = document.getElementById("debug-output");
    if (debug) debug.innerText = `Pressed: ${action}`;
  }

  // KNOB ROTATION (ModelR)
  useEffect(() => {
    if (uiModel !== "ModelR") return;

    const hitbox = document.querySelector(".knob-hitbox");
    const knobImg = document.getElementById("knob-image");
    if (!hitbox || !knobImg) return;

    let dragging = false;
    let startAngle = 0;
    let accumulated = 0;

    function getAngle(e) {
      const rect = knobImg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - cx;
      const y = (e.touches?.[0]?.clientY ?? e.clientY) - cy;
      return (Math.atan2(y, x) * 180) / Math.PI;
    }

    function onStart(e) {
      dragging = true;
      startAngle = getAngle(e);
      accumulated = 0;
    }

    function onMove(e) {
      if (!dragging) return;

      const currentAngle = getAngle(e);
      let diff = currentAngle - startAngle;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      setRotation(prev => {
        const newAngle = prev + diff;
        sendKnobRotation(diff); // send delta to Dashboard
        return newAngle;
      });

      accumulated += diff;

      if (accumulated > 30) {
        console.log("SENDING RIGHT ACTION");
        sendAction("RIGHT");
        accumulated = 0;
        if (navigator.vibrate) navigator.vibrate(10);
      }

      if (accumulated < -30) {
        console.log("SENDING LEFT ACTION");
        sendAction("LEFT");
        accumulated = 0;
        if (navigator.vibrate) navigator.vibrate(10);
      }

      startAngle = currentAngle;
    }

    function onEnd() {
      dragging = false;
    }

    hitbox.addEventListener("mousedown", onStart);
    hitbox.addEventListener("touchstart", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      hitbox.removeEventListener("mousedown", onStart);
      hitbox.removeEventListener("touchstart", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [uiModel]);

  /* ---------- KEYBOARD CONTROLS (DPAD + A/B) ---------- */
  useEffect(() => {
    function onKeyDown(e) {
      let action = null;

      // DPAD for ModelD only
      if (uiModel === "ModelD") {
        switch (e.key) {
          case "ArrowUp":
            action = "UP";
            break;
          case "ArrowDown":
            action = "DOWN";
            break;
          case "ArrowLeft":
            action = "LEFT";
            break;
          case "ArrowRight":
            action = "RIGHT";
            break;
          default:
            break;
        }

        if (action) {
          e.preventDefault();
          sendAction(action);

          const debug = document.getElementById("debug-output");
          if (debug) debug.innerText = `Pressed: ${action}`;
          return;
        }
      }

      // ACTION BUTTONS (A / B) — always active
      if (e.key === "a" || e.key === "A" || e.key === "Enter") {
        action = "A";
      } else if (e.key === "b" || e.key === "B" || e.key === "Backspace" || e.key === "Escape") {
        action = "B";
      }

      if (action) {
        sendAction(action);

        const debug = document.getElementById("debug-output");
        if (debug) debug.innerText = `Pressed: ${action}`;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [uiModel, sendAction]);

  const controlImage = uiModel === "ModelR" ? knobImage : dpadImage;

  return (
    <div className="hardware-container">
      <div className="dpad-container">
        <div className="dpad-square">
          {/* DPAD / KNOB IMAGE */}
          <img
            src={controlImage}
            id="knob-image"
            className={uiModel === "ModelR" ? "knob-base" : "dpad-base"}
            style={{
              transform: uiModel === "ModelR" ? `rotate(${rotation}deg)` : "none",
            }}
            alt="Control"
          />

          {/* DPAD BUTTONS (click zones) */}
          {uiModel === "ModelD" && (
            <>
              <button className="zone up" onClick={() => handle("UP")} />
              <button className="zone down" onClick={() => handle("DOWN")} />
              <button className="zone left" onClick={() => handle("LEFT")} />
              <button className="zone right" onClick={() => handle("RIGHT")} />
            </>
          )}

          {/* KNOB HITBOX (for drag) */}
          {uiModel === "ModelR" && <div className="knob-hitbox"></div>}
        </div>
      </div>

      <div className="ab-container">
        <img
          src={aButtonImage}
          className="button-a"
          onClick={() => handle("A")}
          alt="A Button"
        />
        <img
          src={bButtonImage}
          className="button-b"
          onClick={() => handle("B")}
          alt="B Button"
        />
      </div>
    </div>
  );
}
