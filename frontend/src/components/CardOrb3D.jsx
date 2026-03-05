import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function Orb() {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.55
    meshRef.current.rotation.x = 0.25 + Math.sin(t * 0.75) * 0.08
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.28, 1]} />
      <meshStandardMaterial color="#f1f1f1" metalness={0.86} roughness={0.2} />
    </mesh>
  )
}

export default function CardOrb3D() {
  return (
    <div className="card-orb-3d">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.45} />
        <pointLight position={[3, 2, 3]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-2, -1, -2]} intensity={0.7} color="#9e9e9e" />
        <Orb />
      </Canvas>
    </div>
  )
}
