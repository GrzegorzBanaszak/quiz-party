import { Navigate, Route, Routes } from 'react-router-dom'
import CreateGamePage from './pages/CreateGamePage'
import GameOverPage from './pages/GameOverPage'
import HomePage from './pages/HomePage'
import JoinGamePage from './pages/JoinGamePage'
import LobbyPage from './pages/LobbyPage'
import QuestionPage from './pages/QuestionPage'
import QuestionResultPage from './pages/QuestionResultPage'
import VotingPage from './pages/VotingPage'
import VotingResultPage from './pages/VotingResultPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGamePage />} />
      <Route path="/join" element={<JoinGamePage />} />
      <Route path="/game-over" element={<GameOverPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/question" element={<QuestionPage />} />
      <Route path="/question/result" element={<QuestionResultPage />} />
      <Route path="/voting" element={<VotingPage />} />
      <Route path="/voting/result" element={<VotingResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
