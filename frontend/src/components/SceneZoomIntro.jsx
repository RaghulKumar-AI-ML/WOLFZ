import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from './Logo'

const SCENES = [
  {
    id: 'hero',
    tag: 'WOLFz T-SHIRT STUDIO',
    title: 'Wear The Crest. Lead The Pack.',
    text: 'Scene-based entry designed for cinematic impact before shopping starts.',
    actionLabel: 'Shop Collection',
    actionTo: '/shop',
  },
  {
    id: 'brand',
    tag: 'BRAND STORY',
    title: 'Monochrome Identity. Street Precision.',
    text: 'Premium cuts, heavyweight fabric, and a minimal visual language inspired by your crest logo.',
    actionLabel: 'View Story',
    actionTo: '/shop',
  },
  {
    id: 'feature',
    tag: 'FEATURE HIGHLIGHT',
    title: 'Fast Cart, Smooth Checkout, Real Product Flow.',
    text: 'After this intro, the page switches to normal scrolling for product grids and ecommerce interactions.',
    actionLabel: 'Enter Store',
    actionTo: '/shop',
  },
]

export default function SceneZoomIntro({ onComplete }) {
  const [activeScene, setActiveScene] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const wrapperRef = useRef(null)
  const touchCurrentYRef = useRef(0)
  const touchStartYRef = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [reducedMotion])

  const tryMove = (direction) => {
    if (isTransitioning) return false
    const lastIndex = SCENES.length - 1

    if (direction > 0 && activeScene === lastIndex) {
      if (onComplete) onComplete()
      return true
    }

    const next = activeScene + direction
    if (next < 0 || next > lastIndex) return false

    setIsTransitioning(true)
    setActiveScene(next)
    window.setTimeout(() => setIsTransitioning(false), 820)
    return true
  }

  useEffect(() => {
    if (reducedMotion || !wrapperRef.current) return
    const element = wrapperRef.current

    const onWheel = (event) => {
      const direction = event.deltaY > 0 ? 1 : -1
      const moved = tryMove(direction)
      if (moved) event.preventDefault()
    }

    const onTouchStart = (event) => {
      touchStartYRef.current = event.touches[0]?.clientY || 0
      touchCurrentYRef.current = touchStartYRef.current
    }

    const onTouchMove = (event) => {
      touchCurrentYRef.current = event.touches[0]?.clientY || touchCurrentYRef.current
      event.preventDefault()
    }

    const onTouchEnd = () => {
      const delta = touchStartYRef.current - touchCurrentYRef.current
      if (Math.abs(delta) < 42) return
      const direction = delta > 0 ? 1 : -1
      tryMove(direction)
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeScene, isTransitioning, reducedMotion])

  if (reducedMotion) {
    return (
      <section className="scene-fallback stack-lg">
        {SCENES.map((scene) => (
          <article className="scene-card" key={scene.id}>
            <p className="eyebrow">{scene.tag}</p>
            <h2>{scene.title}</h2>
            <p>{scene.text}</p>
            <Link className="btn-primary" to={scene.actionTo}>
              {scene.actionLabel}
            </Link>
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className="scene-intro-fixed" ref={wrapperRef} aria-label="Intro scenes">
      <div className="scene-stage">
          {SCENES.map((scene, index) => {
            const offset = index - activeScene
            const opacity = offset === 0 ? 1 : 0
            const scale = offset === 0 ? 1 : offset > 0 ? 0.9 : 1.1
            const z = offset === 0 ? 0 : offset > 0 ? -220 : 220
            const y = offset * 26

            return (
              <motion.article
                key={scene.id}
                className="scene-card"
                initial={false}
                animate={{ opacity, scale, y, z }}
                transition={{ duration: 0.78, ease: [0.22, 0.61, 0.36, 1] }}
                style={{
                  zIndex: SCENES.length - Math.abs(offset),
                  pointerEvents: offset === 0 ? 'auto' : 'none',
                  willChange: 'transform, opacity',
                  transformPerspective: 1200,
                }}
              >
                <div className="scene-card-top">
                  <div className="scene-badge">
                    <Logo className="entry-logo" />
                    <span>{scene.tag}</span>
                  </div>
                  <span className="scene-index">
                    {index + 1}/{SCENES.length}
                  </span>
                </div>

                <h2>{scene.title}</h2>
                <p>{scene.text}</p>

                <div className="row-gap">
                  <Link className="btn-primary" to={scene.actionTo}>
                    {scene.actionLabel}
                  </Link>
                </div>
              </motion.article>
            )
          })}
      </div>

      <div className="scene-hint">Scroll or swipe to move between scenes</div>
    </section>
  )
}
