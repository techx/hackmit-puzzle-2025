import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Torus } from '@react-three/drei';

function Lock() {
  return (
    <group position={[0, 0.1, 0.55]}>
      {/* Lock Body */}
      <Box args={[0.3, 0.4, 0.1]} castShadow>
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.3} />
      </Box>
      {/* Lock Shackle */}
      <Torus args={[0.15, 0.05, 16, 16, Math.PI]} rotation={[0, 0, Math.PI]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
      </Torus>
    </group>
  );
}

export function LockedFreezer({ isLocked, ...props }) {
  const freezerRef = useRef();

  return (
    <group ref={freezerRef} {...props}>
      {/* Freezer Body */}
      <Box args={[1, 1.2, 1]} castShadow>
        <meshStandardMaterial color="#ecf0f1" metalness={0.4} roughness={0.1} />
      </Box>
      {/* Freezer Handle */}
      <Box args={[0.1, 0.5, 0.1]} position={[0, 0.1, 0.51]}>
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.3} />
      </Box>
      {isLocked && <Lock />}
    </group>
  );
} 