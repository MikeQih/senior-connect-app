import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UIModelProvider } from './contexts/UIModelContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import GameSelection from './pages/GameSelection'
import Tutorial from './pages/Tutorial'
import Connect4Game from './pages/Connect4Game'
import MatchingPairs from './pages/MatchingPairs'
import './App.css'

function App() {
  return (
    <UIModelProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/game/select" element={<GameSelection />} />
          <Route path="/game/connect4/tutorial" element={<Tutorial />} />
          <Route path="/game/connect4/play" element={<Connect4Game />} />
          <Route path="/game/matchingpairs" element={<MatchingPairs />} />
        </Routes>
      </Router>
    </UIModelProvider>
  )
}

export default App
