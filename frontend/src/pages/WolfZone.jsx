import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CardOrb3D from '../components/CardOrb3D'
import { fetchWolfProfile } from '../services/gamificationService'

export default function WolfZone() {
  const [profile, setProfile] = useState({ rank: 'Pup', wolf_points: 0 })

  useEffect(() => {
    fetchWolfProfile().then(setProfile).catch(() => setProfile({ rank: 'Pup', wolf_points: 0 }))
  }, [])

  return (
    <div className="detail-layout">
      <CardOrb3D />
      <motion.section className="panel stack-sm" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="eyebrow">Loyalty Zone</p>
        <h1>WolfZone</h1>
        <p>Track your progression and rank up through the pack.</p>
        <div className="stats-grid">
          <article><span>Rank</span><strong>{profile.rank}</strong></article>
          <article><span>Wolf Points</span><strong>{profile.wolf_points}</strong></article>
        </div>
      </motion.section>
    </div>
  )
}
