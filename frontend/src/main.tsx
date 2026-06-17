import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { GameSessionProvider } from './game/GameSessionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GameSessionProvider>
        <App />
      </GameSessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
