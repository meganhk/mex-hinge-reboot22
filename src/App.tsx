import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from './firebase'
import PhotoCompare from './components/PhotoCompare'
import PromptCompare from './components/PromptCompare'
import Analytics from './components/Analytics'
import { User, VoteRecord } from './types'
import Contributors from './components/Contributors.tsx'

function HomePage() {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const userRef = ref(db, `users/${storedUserId}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        console.log('User data in HomePage:', data);
        setUserData(data);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="home-container">
      {/* ... other JSX ... */}
      
      {userData && userData.comparisons >= 10 ? (
        <Link to="/analytics" className="main-button">
          View Analytics ({userData.comparisons} comparisons made)
        </Link>
      ) : (
        <div className="votes-needed">
          Make {10 - (userData?.comparisons || 0)} more comparisons to unlock analytics 
          (Current: {userData?.comparisons || 0})
        </div>
      )}
      
      {/* ... rest of your JSX ... */}
    </div>
  );
}

function ProtectedAnalytics() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setLoading(false);
      return;
    }

    const userRef = ref(db, `users/${storedUserId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log('User data in ProtectedAnalytics:', data);
      setUserData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData || userData.comparisons < 10) {
    return <Navigate to="/" replace />;
  }

  return <Analytics />;
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
  );
}

export default App;