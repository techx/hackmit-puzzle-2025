import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, SpotLight, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'
import { LockedFreezer } from './LockedFreezer'

const CUSTOMERS = [
  { 
    id: 1,
    name: 'Shrey',
    cipherText: "woljueqjbljbbfkcfpch",
    answer: "stationary",
    difficulty: 3,
    hint: ""
  },
  { 
    id: 2,
    name: 'Puzzles',
    cipherText: "ktqeygyiztkzlkql",
    answer: "star",
    difficulty: 2,
    hint: ""
  },
  { 
    id: 3,
    name: 'Master',
    cipherText: "pgjjgywgadbdaqhgdbn",
    answer: "north",
    difficulty: 4,
    hint: ""
  },
  {
    id: 4,
    name: 'Bob',
    cipherText: "{[]}n|_'/^|=o°|_\\'o|_|here∂?|e|/-/£!2†lm30/\\/t}{iŝ",
    answer: "unsolvable",
    difficulty: 0,
    hint: "This one's just for fun! Maybe try another customer..."
  },
  {
    id: 5,
    name: 'Wise',
    cipherText: "baaba baaaa aaaaa ababa aaaaa ababa aabaa baaaa abbab baaba baaaa aaaaa ababa aaaaa ababa aaaaa abaaa baaab aaaab aabaa baaba baaba aabaa baaaa baaba aabbb",
    answer: "unsolvable",
    difficulty: 0,
    hint: "A very long Baconian message... maybe try another customer?"
  },
  {
    id: 6,
    name: 'Final Challenge',
    cipherText: "Find the key word to unlock the freezer",
    answer: "polaris",
    difficulty: 5,
    hint: "Think about your previous ciphers...."
  }
]

const PHASE_TWO_CUSTOMERS = [
  {
    id: 7,
    name: 'Rick',
    cipherText: "zqhqdsazzmsuhqkaggb",
    answer: "nevergonnagiveyouup",
    difficulty: 0,
    hint: "Caesar shifted 12"
  },
  {
    id: 8,
    name: 'Branch',
    cipherText: "bwibgtzludigop",
    answer: "poppyandbranch",
    difficulty: 0,
    hint: "MIT"
  },
  {
    id: 9,
    name: 'Troll',
    cipherText: "I want 3 orders of 173 fries and 179 mcnuggets. I don't care that you're an ice cream shop.",
    answer: "underthesea",
    difficulty: 4,
    hint: "[9261,2744,64,125,5832,8000,512,125,6859,125,1]"
  },
  {
    id: 10,
    name: 'Joker',
    cipherText: "YptrYmWmVwFGV",
    answer: "hack",
    difficulty: 2,
    hint: "The key lies in this years theme"
  },
  {
    id: 11,
    name: 'dk',
    cipherText: "QFDZLKHZQPMXZULBKH",
    answer: "archive",
    difficulty: 3,
    hint: "Of the internet"
  },
  {
    id: 12,
    name: 'Final',
    cipherText: "Use the ciphers from this phase to find the key word to unlock the freezer",
    answer: "2022",
    difficulty: 5,
    hint: "HackMIT :)"
  }
]

const PART_ONE_CUSTOMERS = CUSTOMERS.slice(0, 5);
const FINAL_CHALLENGE = CUSTOMERS[5];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the 3D rendering.</div>
    }
    return this.props.children
  }
}

function Customer({ position, customerData, isLeaving }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const isSolvable = customerData.answer !== 'unsolvable'

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial 
          color="#4a90e2"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* Head */}
      <group position={[0, 1.2, 0]}>
        {/* Base head */}
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#ffdbac"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        
        {/* Eyes */}
        <group position={[0, 0, 0.3]}>
          <mesh position={[-0.15, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        </group>

        {/* Smile */}
        <mesh position={[0, -0.1, 0.3]} rotation={[0, 0, Math.PI * 0.1]}>
          <torusGeometry args={[0.15, 0.03, 16, 16, Math.PI]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
      </group>

      {/* Speech bubble */}
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.2}
        position={[0, 2.5, 0]}
      >
        <group>
          <mesh>
            <boxGeometry args={[4, 1.8, 0.1]} />
            <meshStandardMaterial 
              color="white"
              transparent
              opacity={0.15}
              metalness={0.1}
              roughness={0.1}
            />
          </mesh>
          <Text
            position={[0, 0.2, 0.06]}
            fontSize={0.2}
            maxWidth={3.5}
            textAlign="center"
            color="white"
            font="/Inter-Bold.woff"
            anchorY="middle"
          >
            {customerData.cipherText}
          </Text>
          {isSolvable && customerData.hint && (
            <Text
              position={[0, -0.3, 0.06]}
              fontSize={0.12}
              maxWidth={3.5}
              textAlign="center"
              color="#ffd700"
              font="/Inter-Medium.woff"
              anchorY="middle"
            >
              Hint: {customerData.hint}
            </Text>
          )}
        </group>
      </Float>
    </group>
  )
}

function CafeDecor() {
  return (
    <group>
      {/* Windows on back wall where decorations used to be */}
      {[-6, -2, 2, 6].map((x, i) => (
        <group key={i} position={[x, 2, -4.8]}>
          {/* Window frame */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial 
              color="#34495e"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          {/* Window glass */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.3, 1.8]} />
            <meshStandardMaterial 
              color="#b8e6ff"
              transparent
              opacity={0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Light behind window */}
          <pointLight
            position={[0, 0, -0.5]}
            intensity={0.8}
            distance={3}
            color="#87ceeb"
          />
        </group>
      ))}

      {/* Plants */}
      {[-8, 8].map((x, i) => (
        <group key={i} position={[x, -1.5, -4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.3, 0.8, 16]} />
            <meshStandardMaterial color="#95a5a6" />
          </mesh>
          {[0, 0.2, -0.2, 0.1, -0.1].map((offset, j) => (
            <group key={j} position={[offset, 0.4, offset]}>
              <mesh castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#27ae60" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

function Counter() {
  return (
    <group position={[0, -1, 0]}>
      {/* Counter base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[8, 2, 2]} />
        <meshStandardMaterial 
          color="#8b4513"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Counter top */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.2, 2.4]} />
        <meshStandardMaterial 
          color="#deb887"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Counter front decorative panel */}
      <mesh position={[0, 0, 1.01]} castShadow>
        <planeGeometry args={[7.8, 1.8]} />
        <meshStandardMaterial 
          color="#6d4c41"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Coffee machines and equipment */}
      <group position={[0, 1.2, -0.8]}>
        {/* Coffee machine */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 1, 0.8]} />
          <meshStandardMaterial 
            color="#2c3e50"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Steam wand */}
        <mesh position={[0.6, -0.2, 0.2]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial 
            color="#95a5a6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  )
}

function Floor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#34495e"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Decorative floor pattern */}
      {Array.from({ length: 10 }).map((_, i) =>
        Array.from({ length: 10 }).map((_, j) => (
          <mesh
            key={`${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
              -9 + i * 2,
              -1.99,
              -9 + j * 2
            ]}
            receiveShadow
          >
            <planeGeometry args={[1.8, 1.8]} />
            <meshStandardMaterial 
              color={((i + j) % 2 === 0) ? "#2c3e50" : "#34495e"}
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

function Walls() {
  return (
    <group>
      {/* Back wall with texture */}
      <mesh position={[0, 3, -5]} receiveShadow>
        <boxGeometry args={[20, 10, 0.3]} />
        <meshStandardMaterial 
          color="#87ceeb"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Side walls with windows and doors */}
      {[-10, 10].map((x, i) => (
        <group key={i}>
          {/* Main wall section */}
          <mesh position={[x, 3, 0]} rotation={[0, Math.PI / 2 * (i ? -1 : 1), 0]} receiveShadow>
            <boxGeometry args={[10, 10, 0.3]} />
            <meshStandardMaterial 
              color="#87ceeb"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          {/* Windows */}
          {[-2, 2].map((z, j) => (
            <mesh 
              key={j}
              position={[x * 0.99, 3, z]} 
              rotation={[0, Math.PI / 2 * (i ? -1 : 1), 0]}
            >
              <planeGeometry args={[3, 4]} />
              <meshStandardMaterial 
                color="#b8e6ff"
                transparent
                opacity={0.3}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          ))}

          {/* Door */}
          <group position={[x * 0.99, -0.5, -3]}>
            {/* Door frame */}
            <mesh receiveShadow>
              <boxGeometry args={[0.2, 5, 3]} />
              <meshStandardMaterial color="#4a3728" />
            </mesh>
            
            {/* Door */}
            <mesh 
              position={[0, 0, 1.4]} 
              rotation={[0, Math.PI * 0.2 * (i ? 1 : -1), 0]}
              castShadow
            >
              <boxGeometry args={[0.1, 4.8, 2.8]} />
              <meshStandardMaterial 
                color="#8b4513"
                metalness={0.3}
                roughness={0.7}
              />
              {/* Door handle */}
              <mesh position={[0.1, 0, -1]} castShadow>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
              </mesh>
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

function Scene({ currentCustomer, customerPosition, isLeaving, isFreezerLocked, onFreezerClick, showSecondFreezer, isSecondFreezerLocked, onSecondFreezerClick }) {
  const spotLightRef = useRef()

  return (
    <>
      <ambientLight intensity={0.8} />
      <SpotLight
        ref={spotLightRef}
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Floor />
      <Counter />
      <Walls />
      <CafeDecor />
      <LockedFreezer 
        position={[-2.5, 1.8, -0.5]} 
        isLocked={isFreezerLocked}
        onClick={onFreezerClick}
      />
      {showSecondFreezer && (
        <LockedFreezer 
          position={[2.5, 1.8, -0.5]} 
          isLocked={isSecondFreezerLocked}
          onClick={onSecondFreezerClick}
        />
      )}
      {currentCustomer && (
        <Customer
          position={customerPosition}
          customerData={currentCustomer}
          isLeaving={isLeaving}
        />
      )}
    </>
  )
}

export default function App() {
  const [score, setScore] = useState(0)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [customerPosition, setCustomerPosition] = useState([0, -0.5, -3])
  const [isLeaving, setIsLeaving] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState('waiting')
  const [feedback, setFeedback] = useState('')
  const [solvedCustomers, setSolvedCustomers] = useState(new Set())
  const [skippedCustomers, setSkippedCustomers] = useState([])
  const [isFreezerLocked, setIsFreezerLocked] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(1)
  const [finalWord, setFinalWord] = useState('')
  const [wordDisplay, setWordDisplay] = useState('')
  const [showSecondFreezer, setShowSecondFreezer] = useState(false)
  const [isSecondFreezerLocked, setIsSecondFreezerLocked] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  // Update word display when final word changes
  useEffect(() => {
    if (finalWord) {
      const display = finalWord
        .split('')
        .map(char => char === ' ' ? '  ' : '_')
        .join(' ')
      setWordDisplay(display)
    }
  }, [finalWord])

  useEffect(() => {
    if (currentPhase === 1) {
      const currentCustomers = PART_ONE_CUSTOMERS;
      const nonTrollCustomers = currentCustomers.filter(customer => customer.answer !== 'unsolvable');
      const allNonTrollSolved = nonTrollCustomers.every(customer => solvedCustomers.has(customer.id));

      if (allNonTrollSolved && isFreezerLocked) {
        setIsFreezerLocked(false)
        setFeedback(`Phase 1 ciphers solved! Freezer unlocked.`)
      }
    } else if (currentPhase === 2) {
      // For phase 2, specifically check if customers 9, 10, 11 are solved
      const requiredCustomers = [9, 10, 11];
      const allRequiredSolved = requiredCustomers.every(id => solvedCustomers.has(id));

      if (allRequiredSolved && isFreezerLocked) {
        setIsFreezerLocked(false)
        setFeedback(`Phase 2 ciphers solved! Freezer unlocked.`)
      }
    }
  }, [solvedCustomers, isFreezerLocked, currentPhase])

  useEffect(() => {
    if (!isFreezerLocked || gameState !== 'waiting' || currentCustomer) return;

    if (!currentCustomer && gameState === 'waiting') {
      setTimeout(() => {
        let currentCustomers;
        if (currentPhase === 1) {
          currentCustomers = PART_ONE_CUSTOMERS;
        } else if (currentPhase === 2) {
          currentCustomers = PHASE_TWO_CUSTOMERS.slice(0, 5);
        }
        
        const availableCustomers = currentCustomers.filter(
          customer => !solvedCustomers.has(customer.id) && !skippedCustomers.includes(customer.id)
        )
        
        let nextCustomer;
        if (availableCustomers.length > 0) {
          nextCustomer = availableCustomers[Math.floor(Math.random() * availableCustomers.length)]
        } else {
          setSkippedCustomers([])
          const remainingCustomers = currentCustomers.filter(
            customer => !solvedCustomers.has(customer.id)
          );
          if (remainingCustomers.length > 0) {
            nextCustomer = remainingCustomers[Math.floor(Math.random() * remainingCustomers.length)]
          } else {
            // All current phase customers are solved
            if (currentPhase === 1) {
              setFeedback('Phase 1 complete! Click the freezer for the final challenge.')
            } else if (currentPhase === 2) {
              setFeedback('Phase 2 complete! Click the freezer for the final challenge.')
            }
            return;
          }
        }
        
        setCurrentCustomer(nextCustomer);
        setGameState('entering')
        
        let pos = -8
        const enterInterval = setInterval(() => {
          if (pos >= -3) {
            clearInterval(enterInterval)
            setGameState('serving')
          } else {
            pos += 0.2
            setCustomerPosition([0, -0.5, pos])
          }
        }, 50)
      }, 1500)
    }
  }, [currentCustomer, gameState, solvedCustomers, skippedCustomers, isFreezerLocked, currentPhase])

  const handleCustomerLeave = (wasSkipped = false) => {
    setGameState('leaving')
    setIsLeaving(true)
    
    if (wasSkipped) {
      setSkippedCustomers(prev => [...prev, currentCustomer.id])
      setFeedback('Customer skipped!')
    }
    
    let pos = -3
    const leaveInterval = setInterval(() => {
      if (pos <= -8) {
        clearInterval(leaveInterval)
        setCurrentCustomer(null)
        setUserInput('')
        setIsLeaving(false)
        setGameState('waiting')
        setCustomerPosition([0, -0.5, -3])
        setTimeout(() => setFeedback(''), 2000)
      } else {
        pos -= 0.2
        setCustomerPosition([0, -0.5, pos])
      }
    }, 50)
  }

  const handleFreezerClick = (isSecond = false) => {
    if (isSecond) {
      if (!isSecondFreezerLocked) {
        setFinalWord('kirsten carthew')
        setGameState('final_challenge_second_freezer')
        setFeedback('')
      } else {
        setFeedback("The second freezer is locked. Complete phase 2 first.")
        setTimeout(() => setFeedback(''), 2000)
      }
    } else {
      if (!isFreezerLocked) {
        if (currentPhase === 1) {
          setFinalWord('polaris')
          setGameState('final_challenge_phase1')
          setFeedback('')
        } else if (currentPhase === 2) {
          setFinalWord('2022')
          setGameState('final_challenge_phase2')
          setFeedback('')
        }
      } else {
        setFeedback("It's locked. Solve the non-troll ciphers to open it.")
        setTimeout(() => setFeedback(''), 2000)
      }
    }
  }

  const handleRickRoll = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (gameState === 'final_challenge_phase1' || gameState === 'final_challenge_phase2' || gameState === 'final_challenge_second_freezer') {
      if (userInput.toLowerCase() === finalWord.toLowerCase()) {
        if (gameState === 'final_challenge_phase1') {
          setScore(prevScore => prevScore + 500);
          setFeedback('Phase 1 complete! Starting Phase 2...');
          setCurrentPhase(2);
          setSolvedCustomers(new Set());
          setSkippedCustomers([]);
          setIsFreezerLocked(true);
          setGameState('waiting');
          setUserInput('');
          setTimeout(() => setFeedback(''), 3000);
        } else if (gameState === 'final_challenge_phase2') {
          setScore(prevScore => prevScore + 1000);
          setFeedback('Phase 2 complete! Second freezer unlocked!');
          setShowSecondFreezer(true);
          setIsSecondFreezerLocked(false);
          setGameState('waiting');
          setUserInput('');
          setTimeout(() => setFeedback(''), 3000);
        } else if (gameState === 'final_challenge_second_freezer') {
          setScore(prevScore => prevScore + 2000);
          setFeedback('Congratulations! You have completed the game! Submit the flag [test] to the command center.');
          setGameState('game_over');
        }
      } else {
        setFeedback('That is not correct. Try again!');
        const input = document.querySelector('.cipher-input');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
      }
      return;
    }

    if (gameState !== 'serving') return;

    if (userInput.toLowerCase() === currentCustomer.answer) {
      const points = currentCustomer.difficulty * 100
      setScore(prevScore => prevScore + points)
      setFeedback(`Correct! +${points} points`)
      setSolvedCustomers(prev => new Set([...prev, currentCustomer.id]))
      
      // Check for Rick Roll
      if (userInput.toLowerCase() === 'nevergonnagiveyouup') {
        setTimeout(() => {
          handleRickRoll()
        }, 1000)
      }
      
      handleCustomerLeave(false)
    } else {
      setFeedback('Try again!')
      const input = document.querySelector('.cipher-input')
      input.classList.add('shake')
      setTimeout(() => input.classList.remove('shake'), 500)
    }
  }

  const handleSkip = () => {
    if (gameState === 'serving') {
      handleCustomerLeave(true)
    }
  }

  const isInputDisabled = gameState === 'game_over' || (gameState !== 'serving' && gameState !== 'final_challenge_phase1' && gameState !== 'final_challenge_phase2' && gameState !== 'final_challenge_second_freezer')

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <div className="welcome-title">🍦 Welcome to Papa's Cipheria! 🍦</div>
            <div className="welcome-message">
              Ready to solve some challenging ciphers? Here's how the game works:
            </div>
            <div className="welcome-instructions">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <span>Solve ciphers from customers in <strong>Phase 1</strong> to unlock the first freezer</span>
              </div>
              <div className="instruction-step">
                <div className="step-number">2</div>
                <span>Complete the freezer challenge to advance to <strong>Phase 2</strong></span>
              </div>
              <div className="instruction-step">
                <div className="step-number">3</div>
                <span>Solve more ciphers in Phase 2 to unlock the second freezer</span>
              </div>
              <div className="instruction-step">
                <div className="step-number">4</div>
                <span>Complete the final freezer challenge to finish the game!</span>
              </div>
            </div>
            <div className="welcome-message" style={{ fontSize: '1.1em', color: '#e8f4fd' }}>
              💡 Tip: Some customers might be trolls... focus on the solvable ciphers!
            </div>
            <button 
              className="start-game-btn"
              onClick={() => setShowWelcome(false)}
            >
              Start Game! 🚀
            </button>
          </div>
        </div>
      )}
      
      <div className="game-ui">
        <h1>Papa's Cipheria</h1>
        <div className="score">Score: {score}</div>
        <div className="phase-indicator">Phase: {currentPhase}</div>
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
      
      {gameState === 'game_over' && (
        <div className="game-completion-overlay">
          <div className="game-completion-content">
            <div className="game-completion-title">🎉 Congratulations! 🎉</div>
            <div className="game-completion-message">
              You've successfully completed Papa's Cipheria!
            </div>
            <div className="final-score">Final Score: {score} points</div>
            <div className="game-completion-message" style={{ fontSize: '1.2em', color: '#e8f4fd' }}>
              Looking forward to seeing you guys at HackMIT 💙!
            </div>
          </div>
        </div>
      )}
      
      {(gameState === 'final_challenge_phase1' || gameState === 'final_challenge_phase2' || gameState === 'final_challenge_second_freezer') && (
        <div className="final-challenge-prompt">
          <div className="word-display">{wordDisplay}</div>
          <p>{gameState === 'final_challenge_second_freezer' ? 'Final Challenge' : `Phase ${currentPhase} Final Challenge`}</p>
          <p style={{ color: '#ffd700', fontSize: '0.9em', marginTop: '10px' }}>
            {gameState === 'final_challenge_phase1'
              ? "Think about your previous ciphers..." 
              : gameState === 'final_challenge_phase2'
              ? "Think about the year..."
              : "Hint: Director"
            }
          </p>
        </div>
      )}

      <ErrorBoundary>
        <Canvas 
          shadows 
          camera={{ position: [0, 2, 3], fov: 75 }}
          gl={{ antialias: true }}
          style={{ background: '#1a1a1a' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#1a1a1a')
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
        >
          <Scene
            currentCustomer={currentCustomer}
            customerPosition={customerPosition}
            isLeaving={isLeaving}
            isFreezerLocked={isFreezerLocked}
            onFreezerClick={() => handleFreezerClick(false)}
            showSecondFreezer={showSecondFreezer}
            isSecondFreezerLocked={isSecondFreezerLocked}
            onSecondFreezerClick={() => handleFreezerClick(true)}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            target={[0, 0.5, -2]}
          />
        </Canvas>
      </ErrorBoundary>
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              gameState === 'final_challenge_phase1' || gameState === 'final_challenge_phase2' || gameState === 'final_challenge_second_freezer'
                ? "Type the complete word..." 
                : "Enter the secret word..."
            }
            className="cipher-input"
            disabled={isInputDisabled}
          />
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isInputDisabled}
          >
            {gameState === 'final_challenge_phase1' || gameState === 'final_challenge_phase2' || gameState === 'final_challenge_second_freezer'
              ? "Submit Word" 
              : "Submit Answer"
            }
          </button>
          {gameState !== 'final_challenge_phase1' && gameState !== 'final_challenge_phase2' && gameState !== 'final_challenge_second_freezer' && gameState !== 'game_over' && (
            <button 
              type="button" 
              className="skip-btn"
              onClick={handleSkip}
              disabled={gameState !== 'serving'}
            >
              Skip Customer
            </button>
          )}
        </form>
      </div>
    </div>
  )
} 