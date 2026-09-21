export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-forest-100 rounded-xl">
      <h3 className="font-display text-lg text-forest mb-1">{title}</h3>
      {description && <p className="text-sm text-ink/60 max-w-sm mx-auto mb-4">{description}</p>}
      {action}
    </div>
  )
}
