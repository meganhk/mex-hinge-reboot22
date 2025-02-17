import React, { useState, useEffect } from 'react'
import { ref, onValue, update, get } from 'firebase/database'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import { Photo, User } from '../types'

interface WelcomeModalProps {
  onComplete: (userData: User) => void;
}

function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [userData, setUserData] = useState<Partial<User>>({})

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Mex's Profile Optimizer!</h2>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          onComplete({
            ...userData,
            id: crypto.randomUUID(),
            comparisons: 0,
            lastActive: Date.now()
          } as User)
        }}>
          <div className="form-group">
            <label>Username (optional)</label>
            <input
              type="text"
              onChange={(e) => setUserData((prev: Partial<User>) => ({...prev, username: e.target.value}))}
            />
          </div>

          <div className="form-group">
            <label>Your Gender</label>
            <select required onChange={(e) => setUserData((prev: Partial<User>) => ({...prev, gender: e.target.value as User['gender']}))}>
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Attracted to*</label>
            <div>
              {['men', 'women', 'both'].map(option => (
                <label key={option} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="attractedTo"  // This groups the radio buttons together
                    value={option}
                    onChange={(e) => {
                      setUserData((prev: Partial<User>) => ({
                        ...prev,
                        attractedTo: [e.target.value as 'men' | 'women' | 'both']
                      }))
                    }}
                    required
                  />
                  <span className="ml-2 capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit">Start Rating</button>
        </form>
      </div>
    </div>
  )
}

function PhotoCompare() {
  const [userData, setUserData] = useState<User | null>(null);
  const allPhotos: Photo[] = [
    { id: 1, url: '/IMG_8281.jpeg', description: 'me on bed', type: 'photo' as const },
    { id: 2, url: '/IMG_1229.JPG', description: 'me w/ moet chandon picture', type: 'photo' as const},
    { id: 3, url: '/IMG_1348.jpeg', description: 'me running', type: 'photo' as const },
    { id: 4, url: '/IMG_5093.jpeg', description: 'me before heaven by james', type: 'photo' as const },
    { id: 5, url: '/IMG_5358.JPG', description: 'me with eiffel tower' , type: 'photo' as const},
    { id: 6, url: '/IMG_6467.jpeg', description: 'me with computer selfie',   type: 'photo' as const},
    { id: 7, url: '/IMG_6474.jpeg', description: 'me with computer selfie but sexier' , type: 'photo' as const},
    { id: 8, url: '/IMG_7585.jpeg', description: 'me at teamlabs', type: 'photo' as const },
    { id: 9, url: '/IMG_8019.jpeg', description: 'me at peak', type: 'photo' as const },
    { id: 10, url: '/IMG_8258.jpeg', description: 'me with hand on cheek closest', type: 'photo' as const },
    { id: 11, url: '/IMG_8258.jpeg', description: 'me with hand on cheek further', type: 'photo' as const },
    { id: 12, url: '/IMG_8571.jpeg', description: 'me at kshmr', type: 'photo' as const },
    { id: 13, url: '/IMG_2374.JPG', description: 'me with fries at kinsman', type: 'photo' as const },
    { id: 14, url: '/291257EE-E610-49ED-927B-AF945471F8FF.jpg', description: 'me with da gurls in cruci', type: 'photo' as const },
    { id: 15, url: '/F0F926EE-72C5-453A-853C-D14F4EF3286F.jpg', description: 'me with da gurls in garden halls' , type: 'photo' as const },
    { id: 16, url: '/IMG_3112.jpeg', description: 'me with ji chicken' , type: 'photo' as const },
    { id: 17, url: '/IMG_2136.jpeg', description: 'me at cuckoo club', type: 'photo' as const  },
    { id: 18, url: '/D67D1523-292D-4846-A84A-1AE86CA53CC8.jpg', description: 'me with scrubs party GANG' , type: 'photo' as const },
    { id: 19, url: '/994EE4EA-6B66-4AA2-A3FC-93ECAEB7E0F3.jpg', description: 'me with scrubs party GANG 2', type: 'photo' as const  },
    { id: 20, url: '/IMG_1652.JPG', description: 'me at omoide yokocho' , type: 'photo' as const },
    { id: 21, url: '/IMG_5853.jpeg', description: 'me at hongdae pocha' , type: 'photo' as const },
    { id: 22, url: '/FullSizeRender 2.jpeg', description: 'me w/ dior christmas tree' , type: 'photo' as const },
    { id: 23, url: '/IMG_3254.jpeg', description: 'me w/ eiffel tower ave new york', type: 'photo' as const  },
    { id: 24, url: '/IMG_0169.jpeg', description: 'me w/ dan mirror smiley', type: 'photo' as const  },
    { id: 25, url: '/IMG_0188.jpeg', description: 'me w/ dan mirror schmexie', type: 'photo' as const },
    { id: 26, url: '/IMG_5104.jpeg', description: 'me w/ joss before heaven', type: 'photo' as const  },
    { id: 27, url: '/IMG_4873.jpeg', description: 'me w/ hlab friendos in asakusa', type: 'photo' as const  },
  ]

  // Elo rating constants
  const INITIAL_RATING = 1500
  const K_FACTOR = 32

  const [eloRatings, setEloRatings] = useState<{[key: number]: number}>({})
  const [currentPair, setCurrentPair] = useState<Photo[]>([])
  const [totalVotes, setTotalVotes] = useState<number>(0)

  // Detailed initialization and logging
  useEffect(() => {
    const votesRef = ref(db, 'totalVotes')

    // Listen to total votes with more detailed logging
    const votesListener = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || { photoVotes: 0, promptVotes: 0 }
      console.log('Current votes data:', data)
      
      // Ensure we're calculating a number
      const photoVotes = Number(data.photoVotes) || 0
      const promptVotes = Number(data.promptVotes) || 0
      const totalVotesCount = photoVotes + promptVotes

      console.log('Calculated total votes:', {
        photoVotes, 
        promptVotes, 
        totalVotesCount
      })

      setTotalVotes(totalVotesCount)
    }, (error) => {
      console.error('Error fetching total votes:', error)
      setTotalVotes(0)
    })

    // Listen to Elo ratings
    const eloRatingsRef = ref(db, 'photoEloRatings')
    const ratingsListener = onValue(eloRatingsRef, (snapshot) => {
      const data = snapshot.val() || {}
      
      // Initialize ratings for any items without existing ratings
      const initialRatings = allPhotos.reduce((acc, photo) => {
        acc[photo.id] = data[photo.id] || INITIAL_RATING
        return acc
      }, {} as {[key: number]: number})

      setEloRatings(initialRatings)
    })

    // Initialize first pair when component mounts
    const initialPair = getRandomPair()
    setCurrentPair(initialPair)

    // Cleanup listeners
    return () => {
      votesListener()
      ratingsListener()
    }
  }, [])

  // Calculate expected score based on Elo ratings
  const calculateExpectedScore = (ratingA: number, ratingB: number): number => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  }

  // Update Elo ratings after a comparison
  const updateEloRatings = (
    winnerRating: number, 
    loserRating: number
  ): { winnerNewRating: number, loserNewRating: number } => {
    const expectedScore = calculateExpectedScore(winnerRating, loserRating)
    
    const winnerNewRating = winnerRating + K_FACTOR * (1 - expectedScore)
    const loserNewRating = loserRating - (winnerNewRating - winnerRating)

    return { winnerNewRating, loserNewRating }
  }

  // Get a random pair of photos, preferably with similar ratings
  const getRandomPair = (): Photo[] => {
    const available = [...allPhotos]
    
    // If only one photo, return that photo
    if (available.length <= 1) return available

    // Sort available photos by rating
    const sortedPhotos = available.sort((a, b) => 
      Math.abs((eloRatings[a.id] || INITIAL_RATING) - (eloRatings[b.id] || INITIAL_RATING))
    )

    // Try to find two photos with relatively close ratings
    const first = sortedPhotos.splice(Math.floor(Math.random() * sortedPhotos.length), 1)[0]
    const second = sortedPhotos[Math.floor(Math.random() * sortedPhotos.length)]

    return [first, second]
  }

  // Handle photo selection
  const handleChoice = async (winnerPhoto: Photo, loserPhoto: Photo): Promise<void> => {
    try {
      // Get current votes
      const votesRef = ref(db, 'totalVotes')
      const votesSnapshot = await get(votesRef)
      const currentVotes = votesSnapshot.val() || { photoVotes: 0, promptVotes: 0 }
      
      console.log('Current votes before update:', currentVotes)

      // Get current ratings
      const winnerRating = eloRatings[winnerPhoto.id] || INITIAL_RATING
      const loserRating = eloRatings[loserPhoto.id] || INITIAL_RATING

      // Calculate new ratings
      const { winnerNewRating, loserNewRating } = updateEloRatings(
        winnerRating, 
        loserRating
      )

      // Prepare updates
      const updates: {[key: string]: number} = {
        [`photoEloRatings/${winnerPhoto.id}`]: winnerNewRating,
        [`photoEloRatings/${loserPhoto.id}`]: loserNewRating,
        'totalVotes/photoVotes': (currentVotes.photoVotes || 0) + 1
      }

      console.log('Prepared updates:', updates)

      // Update Firebase
      await update(ref(db), updates)

      // Generate new pair
      const newPair = getRandomPair()
      setCurrentPair(newPair)
    } catch (error) {
      console.error('Error updating ratings:', error)
    }
  }

  /// Add this useEffect to check for existing user data
  useEffect(() => {
    // Create a reference to the users location in your database
    const userRef = ref(db, 'users');
    
    // Get the stored user ID from localStorage (if any)
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      // If we have a stored user ID, fetch the user data
      const specificUserRef = ref(db, `users/${storedUserId}`);
      
      onValue(specificUserRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
        }
      });
    }
  }, []);

  const handleWelcomeComplete = async (newUserData: User) => {
    try {
      // Create a reference to this specific user's location in the database
      const userRef = ref(db, `users/${newUserData.id}`);
      
      // Save the user data to Firebase
      await update(ref(db), {
        [`users/${newUserData.id}`]: newUserData
      });
      
      // Store the user ID in localStorage for future sessions
      localStorage.setItem('userId', newUserData.id);
      
      // Update local state
      setUserData(newUserData);
      
    } catch (error) {
      console.error('Error saving user data:', error);
      // You might want to show an error message to the user here
    }
  };

  // Show welcome modal if no user data
  if (!userData) {
    return <WelcomeModal onComplete={handleWelcomeComplete} />;
  }

  // If no current pair, show loading
  if (currentPair.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="comparison-container">
      <div className="nav-buttons">
        <Link to="/" className="nav-button">Home</Link>
        {totalVotes >= 10 && (
          <Link to="/analytics" className="nav-button">
            View Analytics
          </Link>
        )}
      </div>

      <h1 className="title">Choose the better photo</h1>
      <h2 className="subtitle">I'm looking for literally anything from fwbs to an actual #lockedin relationship so... think hot but not slutty, wifey but yk, not easy, someone you'd actually swipe on idk.</h2>
      
      <div className="photo-grid">
        {currentPair.map((photo, index) => (
          <div 
            key={photo.id} 
            className="photo-card"
            onClick={() => {
              const winnerPhoto = photo
              const loserPhoto = currentPair[1 - index]
              handleChoice(winnerPhoto, loserPhoto)
            }}
          >
            <div className="photo-wrapper">
              <img 
                src={photo.url} 
                alt={photo.description}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '500px', 
                  objectFit: 'cover' 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Total comparisons performed: {totalVotes === undefined ? 0 : totalVotes}
      </div>
    </div>
  )
}

export default PhotoCompare