export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="rounded-md border-2 border-tomato/40 bg-tomato/5 text-tomato-dark text-sm px-4 py-3">
      {message}
    </div>
  )
}
