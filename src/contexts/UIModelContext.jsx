import { createContext, useContext, useState, useEffect } from 'react';

const UIModelContext = createContext();

export const useUIModel = () => {
  const context = useContext(UIModelContext);
  if (!context) {
    throw new Error('useUIModel must be used within a UIModelProvider');
  }
  return context;
};

export const UIModelProvider = ({ children }) => {
  const [uiModel, setUIModel] = useState(() => {
    return localStorage.getItem("uiModel") || "ModelR";
  });

  // Save when changed
  useEffect(() => {
    localStorage.setItem("uiModel", uiModel);
  }, [uiModel]);

  const toggleUIModel = (model) => {
    setUIModel(model);
  };

  return (
    <UIModelContext.Provider value={{ uiModel, toggleUIModel }}>
      {children}
    </UIModelContext.Provider>
  );
};
