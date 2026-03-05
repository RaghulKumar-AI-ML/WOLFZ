const ITEMS = ['LIMITED DROP', 'CROWNED WOLF', 'PREMIUM COTTON', 'SHIPS WORLDWIDE', 'CASH ON DELIVERY', 'SUMMER 2026']

export default function MarqueeTape() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}
