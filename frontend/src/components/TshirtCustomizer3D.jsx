import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CanvasTexture, DoubleSide } from 'three'

function ShirtModel({ color, side, text, imageSrc, orbitEnabled }) {
  const groupRef = useRef()
  const targetRef = useRef(side === 'front' ? 0 : Math.PI)

  useEffect(() => {
    targetRef.current = side === 'front' ? 0 : Math.PI
  }, [side])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const currentY = groupRef.current.rotation.y
    const autoOrbit = orbitEnabled ? Math.sin(clock.getElapsedTime() * 0.45) * 0.25 : 0
    const targetY = targetRef.current + autoOrbit
    groupRef.current.rotation.y += (targetY - currentY) * 0.08
  })

  const decalTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#111111'
    ctx.font = 'bold 84px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text || 'WOLFz', 512, 450)

    if (imageSrc) {
      const img = new Image()
      img.src = imageSrc
      img.onload = () => {
        ctx.drawImage(img, 352, 500, 320, 320)
      }
    }

    const texture = new CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [text, imageSrc])

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.9, 2.4, 0.45]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.75} />
      </mesh>
      <mesh position={[-1.25, 0.62, 0]}>
        <boxGeometry args={[0.65, 0.7, 0.45]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.75} />
      </mesh>
      <mesh position={[1.25, 0.62, 0]}>
        <boxGeometry args={[0.65, 0.7, 0.45]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.75} />
      </mesh>

      <mesh position={[0, 0.05, 0.24]}>
        <planeGeometry args={[1.4, 1.7]} />
        <meshStandardMaterial map={decalTexture} transparent side={DoubleSide} />
      </mesh>
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#f1e8db" />
      </mesh>
    </group>
  )
}

export default function TshirtCustomizer3D() {
  const [color, setColor] = useState('#f5f5f5')
  const [side, setSide] = useState('front')
  const [text, setText] = useState('WOLFz Premium')
  const [imageSrc, setImageSrc] = useState('')
  const [orbitEnabled, setOrbitEnabled] = useState(true)

  const onImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const src = URL.createObjectURL(file)
    setImageSrc(src)
  }

  return (
    <section className="customizer-grid" id="customizer">
      <div className="customizer-view">
        <Canvas camera={{ position: [0, 0.15, 4.6], fov: 38 }}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[3, 3, 5]} intensity={2.1} color="#fff" />
          <directionalLight position={[-3, -1, -3]} intensity={0.6} color="#9ea3b0" />
          <ShirtModel color={color} side={side} text={text} imageSrc={imageSrc} orbitEnabled={orbitEnabled} />
        </Canvas>
      </div>

      <div className="customizer-controls panel stack-sm">
        <p className="scene-tag">3D T-SHIRT CUSTOMIZER</p>
        <h2>Live 3D T-Shirt Configuration</h2>
        <p>Change color, front/back, text, and upload an image for preview.</p>

        <label className="field-label">Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="color-input" />

        <label className="field-label">View Side</label>
        <div className="row-gap">
          <button className={`btn-ghost ${side === 'front' ? 'active-filter' : ''}`} onClick={() => setSide('front')}>Front</button>
          <button className={`btn-ghost ${side === 'back' ? 'active-filter' : ''}`} onClick={() => setSide('back')}>Back</button>
        </div>

        <label className="field-label">Custom Text</label>
        <input className="input-field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your text" />

        <label className="field-label">Upload Logo / Graphic</label>
        <input className="input-field" type="file" accept="image/*" onChange={onImageUpload} />

        <label className="toggle-row">
          <input type="checkbox" checked={orbitEnabled} onChange={(e) => setOrbitEnabled(e.target.checked)} />
          <span>Auto orbit camera motion</span>
        </label>
      </div>
    </section>
  )
}
