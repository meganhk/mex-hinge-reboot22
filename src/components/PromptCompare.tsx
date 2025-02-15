import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Prompt, Votes } from '../types'

function PromptCompare() {
  const allPrompts: Prompt[] = [
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

  const [votes, setVotes] = useState<Votes>(() => {
    const savedVotes = localStorage.getItem('promptVotes')
    return savedVotes ? JSON.parse(savedVotes) : {}
})

// Update this function to use cached votes instead of reading from localStorage again
const totalVotes = (): number => {
    const savedPromptVotes = Object.values(votes).reduce((a: number, b: number) => a + b, 0)
    const photoVotes = JSON.parse(localStorage.getItem('photoVotes') || '{}') as Votes
    const savedPhotoVotes = Object.values(photoVotes).reduce((a: number, b: number) => a + b, 0)
    return savedPhotoVotes + savedPromptVotes
}

  useEffect(() => {
    localStorage.setItem('promptVotes', JSON.stringify(votes))
  }, [votes])

  const getRandomPair = (): Prompt[] => {
    const available = [...allPrompts]
    const first = available.splice(Math.floor(Math.random() * available.length), 1)[0]
    const second = available[Math.floor(Math.random() * available.length)]
    return [first, second]
  }

  const [currentPair, setCurrentPair] = useState<Prompt[]>(getRandomPair())

  const handleChoice = (promptId: number): void => {
    setVotes(prev => ({
      ...prev,
      [promptId]: (prev[promptId] || 0) + 1
    }))
    setCurrentPair(getRandomPair())
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

      <h1 className="title">Profile Prompt Optimizer</h1>
      
      <div className="prompt-grid">
        {currentPair.map((prompt) => (
          <div 
            key={prompt.id} 
            className="prompt-card"
            onClick={() => handleChoice(prompt.id)}
          >
            <div className="prompt-content">
              <h2 className="prompt-question">{prompt.question}</h2>
              <p className="prompt-answer">{prompt.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Total comparisons: {Object.values(votes).reduce((a: number, b: number) => a + b, 0)}
      </div>
    </div>
  )
}

export default PromptCompare