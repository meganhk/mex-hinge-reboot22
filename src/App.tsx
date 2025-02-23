import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import PhotoCompare from './components/PhotoCompare'
import PromptCompare from './components/PromptCompare'
import Analytics from './components/Analytics'
import { User, VoteRecord } from './types'
import Contributors from './components/Contributors.tsx'

  
const calculateTotalVotes = () => {
  const photoVotes = JSON.parse(localStorage.getItem('photoVotes') || '{}') as VoteRecord
  const promptVotes = JSON.parse(localStorage.getItem('promptVotes') || '{}') as VoteRecord
  
  return Object.values(photoVotes).reduce((a: number, b: number) => a + b, 0) +
         Object.values(promptVotes).reduce((a: number, b: number) => a + b, 0)
}

function ProtectedAnalytics() {
  const totalVotes = calculateTotalVotes()

  if (totalVotes < 10) {
    return <Navigate to="/" replace />
  }

  return <Analytics />
}

function HomePage() {
  const totalVotes = calculateTotalVotes()

  return (
    <div className="home-container">
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Mex is (unfortunately) considering downloading Hinge (again).
        </h1>
        
        <p className="text-xl md:text-xl text-gray-600 mb-4">
          Wanna help her set up a profile?
        </p>
        <div className="flex flex-wrap justify-center">
  <Link to="/photo-compare" className="main-button">
    Compare My Photos
  </Link>
  <Link to="/prompt-compare" className="main-button">
    Compare My Prompts
  </Link>

  <Link to="/contributors"className="main-button">
    Leaderboard
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

  <p className="text-lg md:text-lg text-gray-600 mt-5 mb-5">
          If you have any design complaints, please make me a Figma mockup :D I hate designing and the Hinge fonts are behind a paywall :/
        </p>

<div className="space-y-4 flex justify-center items-center">
      <div className="bg-white border border-gray-200 rounded-lg p-5  
                    transition-all duration-200  min-h-[200px] 
                    flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">FUTURE UPDATES:</h2>
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-2">
            <p>1. Obviously design improvements.</p>
            <p>2. Different "optimised" profiles for different genders etc. Instead of just logging that data.</p>
            <p>3. For y'all to upload photos/prompts that you think would suit me?</p>
            <p>4. For y'all to be able to set up your own profiles???????</p>
          </div>
        </div>
      </div>

</div>
        
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
        <Route path="/analytics" element={<ProtectedAnalytics />} />
        <Route path="/contributors" element={<Contributors />} />
      </Routes>
    </Router>
  )
}

export default App