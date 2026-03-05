import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { DoubleSide, TextureLoader } from 'three'

function RotatingProduct({ imageUrl, targetRotationY }) {
  const groupRef = useRef()
  const texture = useLoader(TextureLoader, imageUrl)

  useFrame(() => {
    const currentY = groupRef.current.rotation.y
    groupRef.current.rotation.y += (targetRotationY - currentY) * 0.12
    groupRef.current.rotation.x = Math.sin(groupRef.current.rotation.y * 0.4) * 0.08
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.2, 2.8]} />
        <meshStandardMaterial map={texture} side={DoubleSide} transparent />
      </mesh>
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

export default function ProductImage3D({ imageUrl }) {
  const [targetRotationY, setTargetRotationY] = useState(0)
  const dragState = useRef({ isDragging: false, startX: 0, startRotation: 0 })

  if (!imageUrl) {
    return <div className="product-3d-shell empty-3d">No product image</div>
  }

  const safeUrl = encodeURI(imageUrl)

  const onPointerDown = (event) => {
    dragState.current.isDragging = true
    dragState.current.startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    dragState.current.startRotation = targetRotationY
  }

  const onPointerMove = (event) => {
    if (!dragState.current.isDragging) return
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    const delta = x - dragState.current.startX
    setTargetRotationY(dragState.current.startRotation + delta * 0.012)
  }

  const onPointerUp = () => {
    dragState.current.isDragging = false
  }

  return (
    <div
      className="product-3d-shell"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <Canvas camera={{ position: [0, 0.1, 4], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-2, -1, -2]} intensity={0.45} color="#9f9f9f" />
        <RotatingProduct imageUrl={safeUrl} targetRotationY={targetRotationY} />
      </Canvas>
    </div>
  )
}
