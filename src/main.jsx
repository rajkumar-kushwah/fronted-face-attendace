import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from "./context/UserContext";
import { FaceProvider } from "./context/FaceContext";

createRoot(document.getElementById('root')).render(
  <FaceProvider>
  <UserProvider>
    <App />
  </UserProvider>,
  </FaceProvider>,
)
