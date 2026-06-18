import { Navigate, Route, Routes } from 'react-router-dom'
import CreateGamePage from './pages/CreateGamePage'
import GameRoomPage from './pages/GameRoomPage'
import HomePage from './pages/HomePage'
import JoinGamePage from './pages/JoinGamePage'
import PowerUpSelectionPreviewPage from './pages/PowerUpSelectionPreviewPage'
import PowerUpTargetPreviewPage from './pages/PowerUpTargetPreviewPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGamePage />} />
      <Route path="/join" element={<JoinGamePage />} />
      <Route path="/rooms/:roomCode" element={<GameRoomPage />} />
      <Route path="/preview/power-ups" element={<PowerUpSelectionPreviewPage />} />
      <Route path="/preview/power-up-target" element={<PowerUpTargetPreviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
