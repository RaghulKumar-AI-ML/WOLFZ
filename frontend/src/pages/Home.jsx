import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import MarqueeTape from '../components/MarqueeTape'
import { useProducts } from '../hooks/useProducts'

function ScrollReplicaIntro({ heroImage }) {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const wordScale = useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [1, 1.6, 4.8, 7.5])
  const wordY = useTransform(scrollYProgress, [0, 0.65, 1], [0, -40, -120])
  const wordOpacity = useTransform(scrollYProgress, [0, 0.54, 0.82, 1], [1, 1, 0.36, 0])
  const heroImageScale = useTransform(scrollYProgress, [0, 0.6, 1], [1.08, 1, 0.9])
  const heroImageOpacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0.2, 0.9, 0.55, 0])
  const cardMainOpacity = useTransform(scrollYProgress, [0, 0.07, 0.56, 0.72], [0, 1, 1, 0])
  const cardMainY = useTransform(scrollYProgress, [0, 0.22, 0.72], [40, 0, -80])
  const cardNextOpacity = useTransform(scrollYProgress, [0.52, 0.7, 0.96], [0, 1, 1])
  const cardNextY = useTransform(scrollYProgress, [0.52, 0.76, 1], [80, 0, -36])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.14, 0.23], [0, 1, 0])

  if (reduceMotion) {
    return (
      <section className="wolfz-intro-fallback">
        <p className="eyebrow">WOLFz T-SHIRT STUDIO</p>
        <h1>WOLFz</h1>
        <h2>Wear The Crest. Move Different.</h2>
        <p>Premium oversized tees with bold identity and clean silhouettes.</p>
        <div className="row-gap">
          <Link className="btn-primary" to="/shop">Shop Now</Link>
          <Link className="btn-ghost" to="/auth">Join The Pack</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="wolfz-scroll-intro" ref={sectionRef} aria-label="WOLFz intro transition">
      <div className="wolfz-sticky-stage">
        <motion.div className="wolfz-bg-glow" style={{ opacity: heroImageOpacity }} />
        <motion.img
          className="wolfz-stage-image"
          src={heroImage}
          alt="WOLFz premium t-shirt"
          style={{ scale: heroImageScale, opacity: heroImageOpacity }}
        />

        <motion.h1
          className="wolfz-wordmark"
          data-text="WOLFz"
          style={{
            scale: wordScale,
            y: wordY,
            opacity: wordOpacity,
          }}
        >
          WOLFz
        </motion.h1>

        <motion.article className="wolfz-intro-card" style={{ opacity: cardMainOpacity, y: cardMainY }}>
          <p className="eyebrow">LIMITED PREMIUM DROP</p>
          <h2>Wear The Crest. Move Different.</h2>
          <p>Oversized premium tees with high comfort, strong structure, and clean streetwear language.</p>
          <div className="row-gap">
            <Link className="btn-primary" to="/shop">Shop Now</Link>
            <Link className="btn-ghost" to="/auth">Join The Pack</Link>
          </div>
        </motion.article>

        <motion.article className="wolfz-intro-card wolfz-intro-card-next" style={{ opacity: cardNextOpacity, y: cardNextY }}>
          <p className="eyebrow">ENTER STORE</p>
          <h2>From cinematic intro to full shopping flow.</h2>
          <p>Keep scrolling to move into product highlights and live catalog items.</p>
        </motion.article>

        <motion.p className="wolfz-scroll-hint" style={{ opacity: hintOpacity }}>
          Scroll
        </motion.p>
      </div>
    </section>
  )
}

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.filter((product) => Boolean(product.image_url || product.image_urls?.length)).slice(0, 8)
  const heroImage = featured[0]?.image_url || featured[0]?.image_urls?.[0] || '/products/ChatGPT Image Mar 4, 2026, 10_43_39 AM.png'
  const heroImageSafe = encodeURI(heroImage)

  return (
    <div className="stack-xl">
      <ScrollReplicaIntro heroImage={heroImageSafe} />

      <MarqueeTape />

      <section className="showcase-grid">
        <article className="showcase-card">
          <p className="eyebrow">Premium Construction</p>
          <h3>Heavyweight Fabric + Lasting Print</h3>
          <p>
            Built for daily wear with soft feel, durable stitching, and fade-resistant graphics.
          </p>
        </article>
        <article className="showcase-card">
          <p className="eyebrow">Signature Identity</p>
          <h3>Monochrome Wolf Crest Language</h3>
          <p>
            Minimal black-and-cream visual system that keeps focus on logo, fit, and product quality.
          </p>
        </article>
      </section>

      <section className="panel stack-sm">
        <p className="eyebrow">About The Brand</p>
        <h2>Premium T-Shirts. No Noise.</h2>
        <p>
          Clean cuts, strong fits, and bold logo presence. Everything is focused around high-quality tees.
        </p>
      </section>

      <SectionHeader title="Featured T-Shirts" subtitle="Live products from your backend" action={<Link className="btn-ghost" to="/shop">View All</Link>} />

      {loading ? <p>Loading products...</p> : (
        <section className="products-grid">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.04} />
          ))}
        </section>
      )}

      <section className="cta-band">
        <h2>Ready For Your Next Drop?</h2>
        <p>Pick your favorite tees and checkout in minutes.</p>
        <Link className="btn-primary" to="/shop">Explore Now</Link>
      </section>
    </div>
  )
}
