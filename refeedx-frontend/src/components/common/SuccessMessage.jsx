export default function SuccessMessage({ message }) {
  if (!message) return null
  return (
    <div className="rounded-md border-2 border-leaf/40 bg-leaf/5 text-leaf-dark text-sm px-4 py-3">
      {message}
    </div>
  )
}
