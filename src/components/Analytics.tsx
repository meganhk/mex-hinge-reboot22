import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ref, push, set } from 'firebase/database'
import { db } from '../firebase'
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
    { id: 25, url: '/IMG_0188.jpeg', description: 'me w/ dan mirror schmexie', type: 'photo' as const  },
    { id: 26, url: '/IMG_5104.jpeg', description: 'me w/ joss before heaven', type: 'photo' as const  },
    { id: 27, url: '/IMG_4873.jpeg', description: 'me w/ hlab friendos in asakusa', type: 'photo' as const  },
  ]

  const allPrompts = [
    { 
      id: 1, 
      question: "I'll pick the topic if you start the conversation:",
      answer: "the fake story of how we met",
      type: 'prompt' as const
    },
    { 
      id: 2, 
      question: "I'll fall for you if:",
      answer: "You know what all of these words mean: Beli, Strava, Shohei Ohtani, p<0.05",
      type: 'prompt' as const
    },
    { 
      id: 3, 
      question: "Let's debate this topic",
      answer: "peas or broccoli",
      type: 'prompt' as const
    },
    { 
      id: 4, 
      question: "A life goal of mine",
      answer: "Visit every country in the world. Also a marathon, maybe?",
      type: 'prompt' as const
    },
    { 
      id: 5, 
      question: "Two truths and a lie",
      answer: "I kill mice for a living, I have a black belt in kickboxing, my favourite musical is Hamilton.",
      type: 'prompt' as const
    },
    { 
      id: 6, 
      question: "The best way to ask me out is by",
      answer: "Picking out a restaurant and making the reservation.",
      type: 'prompt' as const
    },
    { 
      id: 7, 
      question: "What if I told you that:",
      answer: "I actually know where I want to eat",
      type: 'prompt' as const
    },
    { 
      id: 8, 
      question: "Teach me something about",
      answer: "What's wrong with you",
      type: 'prompt' as const
    },
    { 
      id: 9, 
      question: "Try to guess this about me",
      answer: "My go to coffee order",
      type: 'prompt' as const
    },
    { 
      id: 10, 
      question: "Try to guess this about me",
      answer: "My favourite book",
      type: 'prompt' as const
    },
    { 
      id: 11, 
      question: "We'll get along if",
      answer: "You can teach me poker and then discuss how game theory applies to our daily lives",
      type: 'prompt' as const
    },
    { 
        id: 12, 
        question: "Give me travel tips for:",
        answer: "Literally any country. Show me your favourite local haunts, or the bougiest/most viral spots.",
        type: 'prompt' as const
      },
      { 
        id: 13, 
        question: "First round is on me if",
        answer: "You can guess my drink order",
        type: 'prompt' as const
      },
      { 
        id: 14, 
        question: "Let's debate this topic",
        answer: "Favourite biscuit. Also, are jaffa cakes cakes, or biscuits?",
        type: 'prompt' as const
      },
  ]

  const photoVotes = JSON.parse(localStorage.getItem('photoVotes') || '{}') as VoteRecord
  const promptVotes = JSON.parse(localStorage.getItem('promptVotes') || '{}') as VoteRecord

  const totalVotes = (): number => {
    return Object.values(photoVotes).reduce((a: number, b: number) => a + b, 0) +
           Object.values(promptVotes).reduce((a: number, b: number) => a + b, 0)
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (selectedItem) {
      // Save interaction to Firebase
      const interactionsRef = ref(db, 'interactions')
      const newInteractionRef = push(interactionsRef)
      await set(newInteractionRef, {
        timestamp: Date.now(),
        itemId: selectedItem.id,
        itemType: selectedItem.type,
        ...formData
      })
    }
  
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