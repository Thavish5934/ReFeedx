import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <p className="stamp text-tomato-dark border-tomato mb-6 inline-flex">404</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-3">Page not found</h1>
      <p className="text-ink/60 mb-8">
        This page doesn’t exist, or the post may have been removed.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
