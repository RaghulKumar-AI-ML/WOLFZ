import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'

function CrestCore() {
  const groupRef = useRef()
  const ringRef = useRef()
  const sparksRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.28
    groupRef.current.rotation.x = Math.sin(t * 0.55) * 0.08
    ringRef.current.rotation.z = t * 0.4
    sparksRef.current.rotation.y = -t * 0.2
  })

  const sparkPositions = useMemo(() => [
    [-1.8, 0.8, 0.2],
    [1.6, -0.5, -0.2],
    [0.7, 1.1, 0.9],
    [-0.9, -1.1, 0.4],
    [1.9, 0.2, -0.6],
  ], [])

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#e7e7e7" metalness={0.82} roughness={0.18} />
      </mesh>

      <mesh ref={ringRef} rotation={[0.72, 0.2, 0.12]}>
        <torusGeometry args={[1.75, 0.06, 18, 130]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.12} emissive="#8f8f8f" emissiveIntensity={0.15} />
      </mesh>

      <group ref={sparksRef}>
        {sparkPositions.map((position, index) => (
          <mesh key={index} position={position}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#f5f5f5" emissive="#999" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function HeroScene3D() {
  return (
    <div className="hero-3d-shell">
      <Canvas camera={{ position: [0, 0, 4.4], fov: 47 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 2, 4]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-2, -1, -2]} intensity={0.55} color="#a5a5a5" />
        <CrestCore />
      </Canvas>
    </div>
  )
}
