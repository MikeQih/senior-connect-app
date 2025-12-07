import { createContext, useContext, useState } from "react";

const ControllerContext = createContext();

export function ControllerProvider({ children }) {
  const [lastAction, setLastAction] = useState(null);

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
    <ControllerContext.Provider value={{ lastAction, sendAction, clearAction }}>
      {children}
    </ControllerContext.Provider>
  );
}

export function useController() {
  return useContext(ControllerContext);
}
