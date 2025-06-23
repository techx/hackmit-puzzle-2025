import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, SpotLight, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const CUSTOMERS = [
  { 
    id: 1,
    name: 'Shrey',
    cipherText: "WoljUeQjbljBbkcFtpch",
    answer: "stationary",
    difficulty: 3,
    hint: "Vigenere cipher with key 'hack'. Don't be still like paper..."
  },
  { 
    id: 2,
    name: 'Puzzles',
    cipherText: "KTQEYGYIZTKZLKQL",
    answer: "star",
    difficulty: 2,
    hint: "Aristocrat cipher. Reach for the stars!"
  },
  { 
    id: 3,
    name: 'Master',
    cipherText: "pgjjgywgadbdaqhgdbn",
    answer: "north",
    difficulty: 4,
    hint: "Affine cipher (slope 25, intercept 20). Follow your true north!"
  },
  {
    id: 4,
    name: 'The',
    cipherText: "{[]}n|_'/^|=o°|_\\'o|_|here∂?|e|/-/£!2†lm30/\\/t}{iŝ",
    answer: "unsolvable",
    difficulty: 5,
    hint: "This one's just for fun! Maybe try another customer..."
  },
  {
    id: 5,
    name: 'Wise',
    cipherText: "baaba baaaa aaaaa ababa aaaaa ababa aabaa baaaa abbab baaba baaaa aaaaa ababa aaaaa ababa aaaaa abaaa baaab aaaab aabaa baaba baaba aabaa baaaa baaba aabbb",
    answer: "unsolvable",
    difficulty: 5,
    hint: "A very long Baconian message... maybe try another customer?"
  },
  {
    id: 6,
    name: 'Final Challenge',
    cipherText: "Using the three words you've collected, find the star that is both stationary and points north...",
    answer: "polaris",
    difficulty: 5,
    hint: "Think about what star stays still and guides travelers north!"
  }
]

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
          color={isSolvable ? "#4a90e2" : "#666666"}
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
            color={isSolvable ? "#ffdbac" : "#999999"}
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
            <boxGeometry args={[4, isSolvable ? 1.8 : 1.4, 0.1]} />
            <meshStandardMaterial 
              color={isSolvable ? "white" : "#f0f0f0"}
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
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {customerData.cipherText}
          </Text>
          <Text
            position={[0, -0.3, 0.06]}
            fontSize={0.15}
            color="white"
            font="/Inter-Medium.woff"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#000000"
          >
            {customerData.name}
          </Text>
          {isSolvable && customerData.hint && (
            <Text
              position={[0, -0.6, 0.06]}
              fontSize={0.12}
              maxWidth={3.5}
              textAlign="center"
              color="#ffd700"
              font="/Inter-Medium.woff"
              anchorY="middle"
              outlineWidth={0.005}
              outlineColor="#000000"
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
      {/* Wall Decorations */}
      {[-6, -2, 2, 6].map((x, i) => (
        <group key={i} position={[x, 2, -4.8]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial 
              color="#34495e"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.2}
            color="#ecf0f1"
            anchorX="center"
            anchorY="middle"
          >
            {['DECODE', 'CIPHER', 'SECRET', 'SOLVE'][i]}
          </Text>
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

      {/* Display case */}
      <group position={[-2.5, 1.2, -0.5]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.8, 1]} />
          <meshStandardMaterial 
            color="#ecf0f1"
            transparent
            opacity={0.6}
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

function Scene({ currentCustomer, customerPosition, isLeaving }) {
  const spotLightRef = useRef()
  useHelper(spotLightRef, THREE.SpotLightHelper, 'white')

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

  useEffect(() => {
    if (!currentCustomer && gameState === 'waiting') {
      setTimeout(() => {
        // Filter out solved customers and get available ones
        const availableCustomers = CUSTOMERS.filter(
          customer => !solvedCustomers.has(customer.id) && !skippedCustomers.includes(customer.id)
        )
        
        if (availableCustomers.length === 0) {
          // If all customers are either solved or skipped, bring back skipped ones
          setSkippedCustomers([])
          const onlyUnsolvedCustomers = CUSTOMERS.filter(
            customer => !solvedCustomers.has(customer.id)
          )
          if (onlyUnsolvedCustomers.length === 0) {
            setFeedback('Congratulations! You solved all ciphers!')
            return
          }
          const randomCustomer = onlyUnsolvedCustomers[Math.floor(Math.random() * onlyUnsolvedCustomers.length)]
          setCurrentCustomer(randomCustomer)
        } else {
          const randomCustomer = availableCustomers[Math.floor(Math.random() * availableCustomers.length)]
          setCurrentCustomer(randomCustomer)
        }
        
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
  }, [currentCustomer, gameState, solvedCustomers, skippedCustomers])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (gameState !== 'serving') return

    if (userInput.toLowerCase() === currentCustomer.answer) {
      const points = currentCustomer.difficulty * 100
      setScore(prevScore => prevScore + points)
      setFeedback(`Correct! +${points} points`)
      setSolvedCustomers(prev => new Set([...prev, currentCustomer.id]))
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

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <div className="game-ui">
        <h1>Papa's Cipher Shop</h1>
        <div className="score">Score: {score}</div>
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
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
            placeholder="Enter the secret word..."
            className="cipher-input"
            disabled={gameState !== 'serving'}
          />
          <button 
            type="submit" 
            className="submit-btn"
            disabled={gameState !== 'serving'}
          >
            Submit Answer
          </button>
          <button 
            type="button" 
            className="skip-btn"
            onClick={handleSkip}
            disabled={gameState !== 'serving'}
          >
            Skip Customer
          </button>
        </form>
      </div>
    </div>
  )
} 