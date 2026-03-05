import { useRef } from 'react'

export default function MagneticButton({ children, className = '', onClick, type = 'button' }) {
  const ref = useRef(null)
  const innerRef = useRef(null)
  const supportsMagnet = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
    : false

  const handleMove = (event) => {
    if (!ref.current || !innerRef.current) return
    if (!supportsMagnet) return
    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    const dx = Math.max(-8, Math.min(8, x * 0.06))
    const dy = Math.max(-6, Math.min(6, y * 0.08))
    innerRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
  }

  const reset = () => {
    if (!innerRef.current) return
    innerRef.current.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <button
      ref={ref}
      type={type}
      className={`magnetic-btn ${className}`.trim()}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      onClick={onClick}
    >
      <span ref={innerRef} className="magnetic-inner">
        {children}
      </span>
    </button>
  )
}
