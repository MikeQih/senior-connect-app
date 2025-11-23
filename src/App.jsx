import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import GameSelection from './pages/GameSelection'
import Tutorial from './pages/Tutorial'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/game/select" element={<GameSelection />} />
        <Route path="/game/connect4/tutorial" element={<Tutorial />} />
        {/* 后续可以在这里添加更多页面路由 */}
      </Routes>
    </Router>
  )
}

export default App
