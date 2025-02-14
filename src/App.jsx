import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import PhotoCompare from './components/PhotoCompare'
import PromptCompare from './components/PromptCompare'
import Analytics from './components/Analytics'

function HomePage() {
  const photoVotes = JSON.parse(localStorage.getItem('photoVotes') || '{}')
  const promptVotes = JSON.parse(localStorage.getItem('promptVotes') || '{}')
  
  const totalVotes = Object.values(photoVotes).reduce((a, b) => a + b, 0) +
                    Object.values(promptVotes).reduce((a, b) => a + b, 0)

  return (
    <div className="container">
      <h1 className="title">Social Media Profile Optimizer</h1>
      <div className="button-container">
        <Link to="/photo-compare" className="main-button">
          Compare Photos
        </Link>
        <Link to="/prompt-compare" className="main-button">
          Compare Prompts
        </Link>
        {totalVotes >= 10 ? (
          <Link to="/analytics" className="main-button">
            View Analytics
          </Link>
        ) : (
          <div className="votes-needed">
            Make {10 - totalVotes} more comparisons to unlock analytics
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photo-compare" element={<PhotoCompare />} />
        <Route path="/prompt-compare" element={<PromptCompare />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  )
}

export default App