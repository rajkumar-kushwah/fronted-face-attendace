// client/context/FaceContext.jsx
import { createContext, useContext, useState } from "react";

export const FaceContext = createContext();

export const FaceProvider = ({ children }) => {
  const [faceData, setFaceData] = useState(null);
  // faceData = { descriptor, imageBlob, preview }

  return (
    <FaceContext.Provider value={{ faceData, setFaceData }}>
      {children}
    </FaceContext.Provider>
  );
};

export const useFace = () => useContext(FaceContext);
