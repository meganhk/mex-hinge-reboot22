import { useState, useEffect } from 'react'
import { ref, onValue, set, increment } from 'firebase/database'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import { Photo, Votes } from '../types'

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

  const [votes, setVotes] = useState<Votes>({})

  useEffect(() => {
    const votesRef = ref(db, 'photoVotes')
    onValue(votesRef, (snapshot) => {
      const data = snapshot.val()
      setVotes(data || {})
    })
  }, [])

  const getRandomPair = (): Photo[] => {
    const available = [...allPhotos]
    const first = available.splice(Math.floor(Math.random() * available.length), 1)[0]
    const second = available[Math.floor(Math.random() * available.length)]
    console.log('Generated pair:', [first, second])
    return [first, second]
  }

  const [currentPair, setCurrentPair] = useState<Photo[]>(getRandomPair())

  const handleChoice = async (photoId: number): Promise<void> => {
    console.log('Choice made:', photoId)
    const photoRef = ref(db, `photoVotes/${photoId}`)
    await set(photoRef, increment(1))
    setCurrentPair(getRandomPair())
  }

  return (
    <div className="comparison-container">
      <div className="nav-buttons">
        <Link to="/" className="nav-button">Home</Link>
        {Object.values(votes).reduce((a, b) => a + b, 0) >= 10 && (
          <Link to="/analytics" className="nav-button">
            View Analytics
          </Link>
        )}
      </div>

      <h1 className="title">Profile Photo Optimizer</h1>
      
      <div className="photo-grid">
        {currentPair.map((photo) => (
          <div 
            key={photo.id} 
            className="photo-card"
            onClick={() => handleChoice(photo.id)}
          >
            <div className="photo-wrapper">
              <img 
                src={photo.url} 
                alt={photo.description}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Total comparisons: {Object.values(votes).reduce((a, b) => a + b, 0)}
      </div>
    </div>
  )
}

export default PhotoCompare