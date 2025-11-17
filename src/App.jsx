import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 后续可以在这里添加更多页面路由 */}
      </Routes>
    </Router>
  )
}

export default App
