const ACCENT_TEXT = {
  leaf: 'text-leaf-dark',
  marigold: 'text-marigold-dark',
  tomato: 'text-tomato-dark',
  forest: 'text-forest',
}

export default function StatCard({ label, value, accent = 'forest' }) {
  return (
    <div className="card">
      <p className={`font-stamp text-3xl font-semibold ${ACCENT_TEXT[accent] || ACCENT_TEXT.forest}`}>{value}</p>
      <p className="text-ink/50 text-xs uppercase tracking-widest mt-2">{label}</p>
    </div>
  )
}
