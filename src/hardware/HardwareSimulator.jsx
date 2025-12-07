import "./Hardware.css";
import dpadImage from "../assets/hardware/dpad.png";
import aButtonImage from "../assets/hardware/abutton.png";
import bButtonImage from "../assets/hardware/bButton.png";
import { useController } from "./ControllerContext";

export default function HardwareSimulator() {
  const { sendAction } = useController();

  function handle(action) {
    sendAction(action);

    const debug = document.getElementById("debug-output");
    if (debug) debug.innerText = `Pressed: ${action}`;
  }

  return (
    <div className="hardware-container">
      <div className="dpad-container">
        <img src={dpadImage} className="dpad-base" />

        <button className="zone up"
                onClick={() => handle("UP")}
                onTouchStart={() => handle("UP")} />

        <button className="zone down"
                onClick={() => handle("DOWN")}
                onTouchStart={() => handle("DOWN")} />

        <button className="zone left"
                onClick={() => handle("LEFT")}
                onTouchStart={() => handle("LEFT")} />

        <button className="zone right"
                onClick={() => handle("RIGHT")}
                onTouchStart={() => handle("RIGHT")} />
      </div>

      <div className="ab-container">
        <img src={aButtonImage}
             className="button-a"
             onClick={() => handle("A")}
             onTouchStart={() => handle("A")} />

        <img src={bButtonImage}
             className="button-b"
             onClick={() => handle("B")}
             onTouchStart={() => handle("B")} />
      </div>

      <div id="debug-output"
           style={{ color: "white", fontSize: "24px", marginTop: "20px" }}>
        Waiting for input...
      </div>
    </div>
  );
}


function send(action) {
  console.log("HARDWARE INPUT:", action);
}
