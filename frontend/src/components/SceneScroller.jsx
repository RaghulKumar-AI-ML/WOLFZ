import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import Logo from './Logo'
import MagneticButton from './MagneticButton'

const SCENES = [
  {
    id: 'hero',
    tag: 'WOLFz PREMIUM CLOTHING',
    title: 'Cinematic T-Shirt Universe',
    text: 'Scroll to enter layered scenes with depth, zoom and atmospheric motion.',
  },
  {
    id: 'brand',
    tag: 'BRAND INTRO',
    title: 'Minimal. Futuristic. Premium.',
    text: 'Every silhouette is crafted for sharp identity and elevated street presence.',
  },
  {
    id: 'feature',
    tag: 'FEATURE HIGHLIGHT',
    title: 'From Story To Store In One Flow',
    text: 'After this sequence, control transitions to normal shopping scroll and customization.',
  },
]

export default function SceneScroller({ reducedMotion, onRelease }) {
  const [active, setActive] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const wrapperRef = useRef(null)
  const touchRef = useRef({ start: 0, current: 0 })

  const moveScene = (direction) => {
    if (transitioning) return false

    const last = SCENES.length - 1
    if (direction > 0 && active === last) {
      onRelease?.()
      return true
    }

    const next = Math.max(0, Math.min(last, active + direction))
    if (next === active) return false

    setTransitioning(true)
    setActive(next)
    window.setTimeout(() => setTransitioning(false), 820)
    return true
  }

  useEffect(() => {
    if (reducedMotion || !wrapperRef.current) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const el = wrapperRef.current

    const onWheel = (event) => {
      const direction = event.deltaY > 0 ? 1 : -1
      const handled = moveScene(direction)
      if (handled) event.preventDefault()
    }

    const onTouchStart = (event) => {
      touchRef.current.start = event.touches[0]?.clientY || 0
      touchRef.current.current = touchRef.current.start
    }

    const onTouchMove = (event) => {
      touchRef.current.current = event.touches[0]?.clientY || touchRef.current.current
      event.preventDefault()
    }

    const onTouchEnd = () => {
      const delta = touchRef.current.start - touchRef.current.current
      if (Math.abs(delta) < 45) return
      const direction = delta > 0 ? 1 : -1
      moveScene(direction)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.body.style.overflow = previousOverflow
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [active, reducedMotion, transitioning])

  if (reducedMotion) {
    return (
      <section className="scene-fallback stack-lg">
        {SCENES.map((scene) => (
          <article className="scene-card" key={scene.id}>
            <p className="scene-tag">{scene.tag}</p>
            <h2>{scene.title}</h2>
            <p>{scene.text}</p>
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className="scene-fixed" ref={wrapperRef}>
      <div className="scene-layers" aria-hidden="true">
        <span className="layer layer-a" />
        <span className="layer layer-b" />
        <span className="layer layer-c" />
      </div>

      <div className="scene-stage">
        {SCENES.map((scene, index) => {
          const offset = index - active
          const opacity = offset === 0 ? 1 : 0
          const scale = offset === 0 ? 1 : offset > 0 ? 0.9 : 1.1
          const z = offset === 0 ? 0 : offset > 0 ? -220 : 220
          const blur = offset === 0 ? 'blur(0px)' : 'blur(6px)'

          return (
            <motion.article
              className="scene-card"
              key={scene.id}
              initial={false}
              animate={{ opacity, scale, z }}
              transition={{ duration: 0.78, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                transformPerspective: 1200,
                filter: blur,
                zIndex: SCENES.length - Math.abs(offset),
                pointerEvents: offset === 0 ? 'auto' : 'none',
              }}
            >
              <div className="scene-top">
                <div className="scene-brand"><Logo className="scene-logo" /><span>{scene.tag}</span></div>
                <span>{index + 1}/{SCENES.length}</span>
              </div>
              <h2>{scene.title}</h2>
              <p>{scene.text}</p>
              <MagneticButton className="btn-primary" onClick={() => moveScene(1)}>Continue</MagneticButton>
            </motion.article>
          )
        })}
      </div>

      <p className="scene-hint">Scroll / swipe to transition scenes</p>
    </section>
  )
}
