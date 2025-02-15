import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Photo, Votes } from '../types'

function PhotoCompare() {


 
  const allPhotos: Photo[] = [
    { id: 1, url: '/IMG_8281.jpeg', description: 'me on bed' },
    { id: 2, url: '/IMG_2063.JPG', description: 'me at hanmiok' },
    { id: 3, url: '/IMG_1348.jpeg', description: 'me running' },
    { id: 4, url: '/IMG_5093.jpeg', description: 'me before heaven by james' },
    { id: 5, url: '/IMG_5358.JPG', description: 'me with eiffel tower' },
    { id: 6, url: '/IMG_6467.jpeg', description: 'me with computer selfie' },
    { id: 7, url: '/IMG_6474.jpeg', description: 'me with computer selfie but sexier' },
    { id: 8, url: '/IMG_7585.jpeg', description: 'me at teamlabs' },
    { id: 9, url: '/IMG_8019.jpeg', description: 'me at peak' },
    { id: 10, url: '/IMG_8258.jpeg', description: 'me with hand on cheek closest' },
    { id: 11, url: '/IMG_8258.jpeg', description: 'me with hand on cheek further' },
    { id: 12, url: '/IMG_8571.jpeg', description: 'me at kshmr' },
    { id: 13, url: '/IMG_2374.JPG', description: 'me with fries at kinsman' },
    { id: 14, url: '/291257EE-E610-49ED-927B-AF945471F8FF.jpg', description: 'me with da gurls in cruci' },
    { id: 15, url: '/F0F926EE-72C5-453A-853C-D14F4EF3286F.jpg', description: 'me with da gurls in garden halls' },
    { id: 16, url: '/IMG_3112.jpeg', description: 'me with ji chicken' },
    { id: 17, url: '/IMG_2136.jpeg', description: 'me at cuckoo club' },
    { id: 18, url: '/D67D1523-292D-4846-A84A-1AE86CA53CC8.jpg', description: 'me with scrubs party GANG' },
    { id: 19, url: '/994EE4EA-6B66-4AA2-A3FC-93ECAEB7E0F3.jpg', description: 'me with scrubs party GANG 2' },
    { id: 20, url: '/IMG_1652.JPG', description: 'me at omoide yokocho' },
    { id: 21, url: '/IMG_5853.jpeg', description: 'me at hongdae pocha' },
    { id: 22, url: '/FullSizeRender 2.jpeg', description: 'me w/ dior christmas tree' },
    { id: 23, url: '/IMG_3254.jpeg', description: 'me w/ eiffel tower ave new york' },
    { id: 24, url: '/IMG_0247.jpeg', description: 'me w/ dan mirror' },
  ]

  console.log('All Photos:', allPhotos)

  const [votes, setVotes] = useState<Votes>(() => {
    const savedVotes = localStorage.getItem('photoVotes')
    return savedVotes ? JSON.parse(savedVotes) : {}
  })

  const totalVotes = (): number => {
    const savedPhotoVotes = Object.values(votes).reduce((a: number, b: number) => a + b, 0)
    const promptVotes = JSON.parse(localStorage.getItem('promptVotes') || '{}') as Votes
    const savedPromptVotes = Object.values(promptVotes).reduce((a: number, b: number) => a + b, 0)
    return savedPhotoVotes + savedPromptVotes
  }

  useEffect(() => {
    localStorage.setItem('photoVotes', JSON.stringify(votes))
  }, [votes])

  const getRandomPair = (): Photo[] => {
    const available = [...allPhotos]
    const first = available.splice(Math.floor(Math.random() * available.length), 1)[0]
    const second = available[Math.floor(Math.random() * available.length)]
    console.log('Generated pair:', [first, second]) // Add this log
    return [first, second]
  }

  const [currentPair, setCurrentPair] = useState<Photo[]>(getRandomPair())

  useEffect(() => {
    console.log('Current pair updated:', currentPair)
  }, [currentPair])

  // Add logging to see what's happening
  useEffect(() => {
    console.log('Current pair:', currentPair)
  }, [currentPair])

  useEffect(() => {
    currentPair.forEach(photo => {
      const img = new Image();
      img.src = photo.url;
      img.onload = () => console.log('Image loaded successfully:', photo.url);
      img.onerror = () => console.error('Image failed to load:', photo.url);
    });
  }, [currentPair]);

  const handleChoice = (photoId: number): void => {
    console.log('Choice made:', photoId)
    setVotes(prev => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1
    }))
    setCurrentPair(getRandomPair())
  }

  // Add check to ensure we have a valid pair
  if (!currentPair || currentPair.length !== 2) {
    console.log('Invalid pair:', currentPair)
    return <div>Loading...</div>
  }

  return (
    <div className="comparison-container">
      <div className="nav-buttons">
        <Link to="/" className="nav-button">Home</Link>
        {totalVotes() >= 10 && (
          <Link to="/analytics" className="nav-button">
            View Analytics
          </Link>
        )}
      </div>
  
      <h1 className="title">Profile Photo Optimizer</h1>
      
      <div className="photo-grid">
        {currentPair.map((photo) => {
          console.log('Rendering photo:', {
            id: photo.id, 
            url: photo.url, 
            description: photo.description
          })
          return (
            <div 
              key={photo.id} 
              className="photo-card"
              onClick={() => handleChoice(photo.id)}
            >
              <div className="photo-wrapper">
                <img 
                  src={photo.url} 
                  alt={photo.description}
                  onLoad={() => console.log('Image loaded successfully:', photo.url)}
                  onError={(e) => {
                    console.error('Image load error:', {
                      url: photo.url,
                      error: e
                    })
                  }}
                />
                <div 
                  style={{
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    background: 'rgba(0,0,0,0.5)', 
                    color: 'white', 
                    padding: '5px'
                  }}
                >
                  {photo.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
  
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Total comparisons: {Object.values(votes).reduce((a: number, b: number) => a + b, 0)}
      </div>
    </div>
  )
}

export default PhotoCompare