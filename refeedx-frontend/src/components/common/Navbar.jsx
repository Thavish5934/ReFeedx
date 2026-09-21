import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_LINKS = {
  REQUESTER: [
    { to: '/requester/dashboard', label: 'Dashboard' },
    { to: '/requester/requests', label: 'Food Requests' },
    { to: '/donations', label: 'Donations' },
    { to: '/profile', label: 'Profile' },
  ],
  DONOR: [
    { to: '/donor/dashboard', label: 'Dashboard' },
    { to: '/donor/donations', label: 'My Donations' },
    { to: '/requests', label: 'Food Requests' },
    { to: '/profile', label: 'Profile' },
  ],
  NGO: [
    { to: '/ngo/dashboard', label: 'Dashboard' },
    { to: '/donations', label: 'Donations' },
    { to: '/requests', label: 'Requests' },
    { to: '/profile', label: 'Profile' },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/donations', label: 'Donations' },
    { to: '/admin/requests', label: 'Requests' },
    { to: '/admin/messages', label: 'Messages' },
  ],
}

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/donations', label: 'Donations' },
  { to: '/requests', label: 'Requests' },
  { to: '/contact', label: 'Contact' },
]

function dashboardPathForRole(role) {
  switch (role) {
    case 'DONOR':
      return '/donor/dashboard'
    case 'REQUESTER':
      return '/requester/dashboard'
    case 'NGO':
      return '/ngo/dashboard'
    case 'ADMIN':
      return '/admin/dashboard'
    default:
      return '/'
  }
}

/** Three-bar hamburger / X toggle, drawn as plain SVG so no icon package is needed. */
function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <path d="M5 5 L17 17 M17 5 L5 17" />
      ) : (
        <path d="M3 6 H19 M3 11 H19 M3 16 H19" />
      )}
    </svg>
  )
}

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = isAuthenticated ? ROLE_LINKS[role] ?? [] : PUBLIC_LINKS

  function handleLogout() {
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-forest text-paper/90">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" onClick={closeMobile} className="font-display text-xl font-bold text-paper tracking-tight shrink-0">
          Re<span className="text-marigold">Feed</span>X
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `transition-colors hover:text-marigold ${isActive ? 'text-marigold' : 'text-paper/80'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth controls */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPathForRole(role)} className="text-sm text-paper/70 hover:text-paper">
                {user?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="btn border-2 border-paper/30 text-paper text-xs px-4 py-2 hover:bg-paper hover:text-forest"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-paper/80 hover:text-paper">
                Log in
              </Link>
              <Link to="/register" className="btn-secondary text-xs px-4 py-2">
                Join ReFeedX
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="md:hidden text-paper p-1.5 -mr-1.5"
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-paper/10 bg-forest px-6 py-4">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `py-2.5 text-sm font-medium border-b border-paper/10 last:border-0 ${
                    isActive ? 'text-marigold' : 'text-paper/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn border-2 border-paper/30 text-paper text-sm py-2.5 w-full"
              >
                Log out ({user?.name})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMobile} className="btn border-2 border-paper/30 text-paper text-sm py-2.5 w-full">
                  Log in
                </Link>
                <Link to="/register" onClick={closeMobile} className="btn-secondary text-sm py-2.5 w-full">
                  Join ReFeedX
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
