import { createContext, useContext, useState } from "react";

const ControllerContext = createContext();

export function ControllerProvider({ children }) {
  const [lastAction, setLastAction] = useState(null);
  const [knobAngle, setKnobAngle] = useState(0);

  function sendKnobRotation(delta) {
    setKnobAngle(prev => prev + delta);
  }

  function sendAction(action) {
    setLastAction({
      type: action,
      time: Date.now()
    });
  }

  function clearAction() {
    setLastAction(null);
  }

  return (
    <ControllerContext.Provider
      value={{
        lastAction,
        sendAction,
        clearAction,
        knobAngle, 
        sendKnobRotation
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export function useController() {
  return useContext(ControllerContext);
}
