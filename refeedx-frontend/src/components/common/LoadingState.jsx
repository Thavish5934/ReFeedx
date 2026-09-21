export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16 text-ink/50 text-sm">
      <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-leaf border-t-transparent animate-spin" />
      {label}
    </div>
  )
}
