import { useState } from 'react'
import { User } from '../types'

interface WelcomeModalProps {
  onComplete: (userData: User) => void;
}

function WelcomeModal({ onComplete }: { onComplete: (userData: User) => void }) {
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
                onChange={(e) => setUserData(prev => ({...prev, username: e.target.value}))}
              />
            </div>
  
            <div className="form-group">
              <label>Your Gender</label>
              <select required onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value as User['gender']}))}>
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
                        setUserData(prev => ({
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

export default WelcomeModal