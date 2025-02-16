import React from 'react'
import { ref, onValue, update } from 'firebase/database'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import { Photo } from '../types'

function PhotoCompare() {
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
  const K_FACTOR = 32
  const INITIAL_RATING = 1500

  const [eloRatings, setEloRatings] = React.useState<{[key: number]: number}>({})
  const [currentPair, setCurrentPair] = React.useState<Photo[]>([])
  const [totalVotes, setTotalVotes] = React.useState(0)

  // Load existing Elo ratings from Firebase on component mount
  React.useEffect(() => {
    // Listen to Elo ratings
    const eloRatingsRef = ref(db, 'photoEloRatings')
    const unsubscribeRatings = onValue(eloRatingsRef, (snapshot) => {
      const data = snapshot.val() || {}
      
      // Initialize ratings for any items without existing ratings
      const initialRatings = allPhotos.reduce((acc, photo) => {
        acc[photo.id] = data[photo.id] || INITIAL_RATING
        return acc
      }, {} as {[key: number]: number})

      setEloRatings(initialRatings)
    })

    // Listen to total votes
    const votesRef = ref(db, 'totalVotes')
    const unsubscribeVotes = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || { photoVotes: 0, promptVotes: 0 }
      setTotalVotes(data.photoVotes + data.promptVotes)
    })

    // Immediately generate pair when component mounts
    const initialPair = getRandomPair()
    setCurrentPair(initialPair)

    // Cleanup subscriptions
    return () => {
      unsubscribeRatings()
      unsubscribeVotes()
    }
  }, [])

  // Calculate expected score based on Elo ratings
  const calculateExpectedScore = (ratingA: number, ratingB: number): number => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  }

  // Update Elo ratings after a comparison
  const updateEloRatings = (
    winnerRating: number, 
    loserRating: number, 
    actualScore: number = 1
  ): { winnerNewRating: number, loserNewRating: number } => {
    const expectedScore = calculateExpectedScore(winnerRating, loserRating)
    
    const winnerNewRating = winnerRating + K_FACTOR * (actualScore - expectedScore)
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
        'totalVotes/photoVotes': (totalVotes || 0) + 1
      }

      // Update Firebase
      await update(ref(db), updates)

      // Generate new pair
      const newPair = getRandomPair()
      setCurrentPair(newPair)
    } catch (error) {
      console.error('Error updating ratings:', error)
    }
  }

  // If no current pair, show nothing
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

      <h1 className="title">Profile Photo Optimizer</h1>
      
      <div className="photo-grid">
        {currentPair.map((photo, index) => (
          <div 
            key={photo.id} 
            className="photo-card"
            onClick={() => {
              // Determine winner and loser based on index
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
                  maxHeight: '100%', 
                  objectFit: 'cover' 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Total comparisons performed: {totalVotes}
      </div>
    </div>
  )
}

export default PhotoCompare