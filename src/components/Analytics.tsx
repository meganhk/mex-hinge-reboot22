import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Photo, Prompt } from '../types'

interface FormData {
  name: string;
  contact: string;
  message: string;
}

interface VoteRecord {
  [key: string]: number;
}

function Analytics() {
  const [showBest, setShowBest] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<Photo | Prompt | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    message: ''
  })
  
  const allPhotos = [
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

  const allPrompts = [
    { 
      id: 1, 
      question: "I'll pick the topic if you start the conversation:",
      answer: "the fake story of how we met"
    },
    { 
      id: 2, 
      question: "I'll fall for you if:",
      answer: "You know what all of these words mean: Beli, Strava, Shohei Ohtani, p<0.05"
    },
    { 
      id: 3, 
      question: "Let's debate this topic",
      answer: "peas or broccoli"
    },
    { 
      id: 4, 
      question: "A life goal of mine",
      answer: "Visit every country in the world. Also a marathon, maybe?"
    },
    { 
      id: 5, 
      question: "Two truths and a lie",
      answer: "I kill mice for a living, I have a black belt in kickboxing, I *placeholder text idk man*"
    },
    { 
      id: 6, 
      question: "The best way to ask me out is by",
      answer: "Picking out a restaurant, making the reservation, and telling me when to show up + how to dress."
    },
    { 
      id: 7, 
      question: "What if I told you that:",
      answer: "I actually know where I want to eat"
    },
    { 
      id: 8, 
      question: "Teach me something about",
      answer: "What's wrong with you"
    },
    { 
      id: 9, 
      question: "Try to guess this about me",
      answer: "My go to coffee order"
    },
    { 
      id: 10, 
      question: "Try to guess this about me",
      answer: "My favourite book"
    },
    { 
      id: 11, 
      question: "We'll get along if",
      answer: "You can teach me poker and then discuss how game theory applies to our daily lives"
    },
    { 
        id: 12, 
        question: "Give me travel tips for:",
        answer: "Literally any country. Show me your favourite local haunts, or the bougiest/most viral spots."
      },
      { 
        id: 13, 
        question: "First round is on me if",
        answer: "You can guess my drink order"
      },
  ]

  const photoVotes = JSON.parse(localStorage.getItem('photoVotes') || '{}') as VoteRecord
  const promptVotes = JSON.parse(localStorage.getItem('promptVotes') || '{}') as VoteRecord

  const totalVotes = (): number => {
    return Object.values(photoVotes).reduce((a: number, b: number) => a + b, 0) +
           Object.values(promptVotes).reduce((a: number, b: number) => a + b, 0)
  }

  // In your sortedPhotos and sortedPrompts, add type assertions:
  const sortedPhotos = [...allPhotos]
    .map(photo => ({
      ...photo,
      votes: photoVotes[photo.id.toString()] || 0
    }))
    .sort((a, b) => showBest ? b.votes - a.votes : a.votes - b.votes)
    .slice(0, 6)

  const sortedPrompts = [...allPrompts]
    .map(prompt => ({
      ...prompt,
      votes: promptVotes[prompt.id.toString()] || 0
    }))
    .sort((a, b) => showBest ? b.votes - a.votes : a.votes - b.votes)
    .slice(0, 3)

  const profileLayout = [
    { type: 'photo', index: 0 },
    { type: 'prompt', index: 0 },
    { type: 'photo', index: 1 },
    { type: 'photo', index: 2 },
    { type: 'prompt', index: 1 },
    { type: 'photo', index: 3 },
    { type: 'prompt', index: 2 },
    { type: 'photo', index: 4 },
    { type: 'photo', index: 5 },
  ]

  const handleInteraction = (item: Photo | Prompt): void => {
    setSelectedItem(item)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log('Interaction:', {
      item: selectedItem,
      ...formData
    })
    setFormData({ name: '', contact: '', message: '' })
    setShowForm(false)
    setSelectedItem(null)
  }

  return (
    <div className="container">
      <div className="nav-buttons">
  <Link to="/" className="nav-button">Home</Link>
</div>

      <h1 className="title">Profile Analytics</h1>
      
      <div className="toggle-container">
        <button 
          className={`toggle-button ${showBest ? 'active' : ''}`}
          onClick={() => setShowBest(true)}
        >
          Best Performing
        </button>
        <button 
          className={`toggle-button ${!showBest ? 'active' : ''}`}
          onClick={() => setShowBest(false)}
        >
          Worst Performing
        </button>
      </div>

      <div className="profile-layout">
        {profileLayout.map((item, idx) => (
          <div key={idx} className={`profile-item ${item.type}`}>
            {item.type === 'photo' ? (
              <div className="photo-card analytics">
                <div className="photo-wrapper">
                  <img 
                    src={sortedPhotos[item.index].url} 
                    alt={sortedPhotos[item.index].description} 
                  />
                </div>
                <button 
    className="like-button"
    onClick={() => handleInteraction(sortedPhotos[item.index])}
>
    ♡
</button>
              </div>
            ) : (
              <div className="prompt-card analytics">
                <div className="prompt-content">
                  <h3 className="prompt-question">{sortedPrompts[item.index].question}</h3>
                  <p className="prompt-answer">{sortedPrompts[item.index].answer}</p>
                </div>
                <button 
    className="like-button"
    onClick={() => handleInteraction(sortedPrompts[item.index])}
>
    ♡
</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="interaction-overlay">
          <div className="interaction-form">
            <h3>Send a Like or Comment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Instagram Handle or Phone Number</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">Send</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics