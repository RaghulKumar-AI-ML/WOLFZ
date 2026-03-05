import { useState } from 'react'

const SOURCES = [
  '/logo-wolfz.png.jpeg',
  '/logo-wolfz.svg',
  '/logo-fallback.svg',
]

export default function Logo({ className = '' }) {
  const [index, setIndex] = useState(0)

  return (
    <div className={`logo-shell ${className}`.trim()}>
      <img
        src={SOURCES[index]}
        alt="WOLFz logo"
        onError={() => setIndex((v) => Math.min(v + 1, SOURCES.length - 1))}
      />
    </div>
  )
}
