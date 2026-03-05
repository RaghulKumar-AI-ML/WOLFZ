import { motion } from 'framer-motion'
import Logo from './Logo'

export default function HeroEntryPanel() {
  return (
    <motion.section
      className="hero-entry-shell"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.08 }}
    >
      <div className="entry-backdrop" />
      <div className="entry-content">
        <div className="entry-badge"><Logo className="entry-logo" /><span>Crest Drop</span></div>
        <h3>Minimal, high-impact cuts for everyday statement style.</h3>
        <p>Designed for premium basics: heavyweight tees, clean silhouettes, monochrome identity.</p>
      </div>
      <div className="entry-cards">
        <article>
          <span>Shipping</span>
          <strong>Worldwide</strong>
        </article>
        <article>
          <span>Materials</span>
          <strong>Premium Cotton</strong>
        </article>
        <article>
          <span>Fit</span>
          <strong>Street Relaxed</strong>
        </article>
      </div>
    </motion.section>
  )
}
