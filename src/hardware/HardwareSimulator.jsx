import "./Hardware.css";
import dpadImage from "../assets/hardware/dpad.png";
import knobImage from "../assets/hardware/knob.png";
import aButtonImage from "../assets/hardware/abutton.png";
import bButtonImage from "../assets/hardware/bButton.png";
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

  // KNOB ROTATION
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
      return Math.atan2(y, x) * 180 / Math.PI;
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

  const controlImage = uiModel === "ModelR" ? knobImage : dpadImage;

  console.log("KNOB ROTATION DEBUG: rotation =", rotation);

  return (
    <div className="hardware-container">
      <div className="dpad-container">
        {/* DPAD/KNOB */}
        <img
          src={controlImage}
          id="knob-image"
          className={uiModel === "ModelR" ? "knob-base" : "dpad-base"}
          style={{
            transform: uiModel === "ModelR" ? `rotate(${rotation}deg)` : "none"
          }}
        />
        {/* DPAD BUTTONS */}
        {uiModel === "ModelD" && (
          <>
            <button className="zone up" onClick={() => handle("UP")} />
            <button className="zone down" onClick={() => handle("DOWN")} />
            <button className="zone left" onClick={() => handle("LEFT")} />
            <button className="zone right" onClick={() => handle("RIGHT")} />
          </>
        )}
        {/* KNOB HITBOX */}
        {uiModel === "ModelR" && (
          <div className="knob-hitbox"></div>
        )}
      </div>

      <div className="ab-container">
        <img src={aButtonImage} className="button-a" onClick={() => handle("A")} />
        <img src={bButtonImage} className="button-b" onClick={() => handle("B")} />
      </div>
    </div>
  );
}