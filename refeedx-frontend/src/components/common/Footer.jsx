import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-paper/60 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-xs">
          <p className="font-display text-paper text-lg font-bold mb-2">
            Re<span className="text-marigold">Feed</span>X
          </p>
          <p>Connecting surplus to need, one plate at a time.</p>
        </div>
        <div className="flex gap-12">
          <div>
            <p className="text-paper/80 font-semibold mb-3 text-xs uppercase tracking-widest">Platform</p>
            <ul className="space-y-2">
              <li><Link to="/donations" className="hover:text-marigold">Donations</Link></li>
              <li><Link to="/requests" className="hover:text-marigold">Requests</Link></li>
              <li><Link to="/about" className="hover:text-marigold">About</Link></li>
              <li><Link to="/contact" className="hover:text-marigold">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-paper/80 font-semibold mb-3 text-xs uppercase tracking-widest">Account</p>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-marigold">Log in</Link></li>
              <li><Link to="/register" className="hover:text-marigold">Join ReFeedX</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 text-center py-4 text-xs text-paper/40">
        © {new Date().getFullYear()} ReFeedX. Built for communities, not profit.
      </div>
    </footer>
  )
}
