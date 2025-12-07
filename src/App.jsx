import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import GameSelection from './pages/GameSelection'
import Tutorial from './pages/Tutorial'
import MatchingPairs from './pages/MatchingPairs'
import HardwareSimulator from "./hardware/HardwareSimulator";
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* TOP HALF = pages */}
        <div className="top-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/game/select" element={<GameSelection />} />
            <Route path="/game/connect4/tutorial" element={<Tutorial />} />
            <Route path="/game/matchingpairs" element={<MatchingPairs />} />
          </Routes>
        </div>

        {/* BOTTOM HALF = hardware */}
        <div className="bottom-screen">
          <HardwareSimulator />
        </div>
      </div>
    </Router>
  )
}

export default App
