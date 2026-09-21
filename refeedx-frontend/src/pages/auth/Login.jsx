import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const DASHBOARD_BY_ROLE = {
  DONOR: '/donor/dashboard',
  REQUESTER: '/requester/dashboard',
  NGO: '/ngo/dashboard',
  ADMIN: '/admin/dashboard',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await login(form)
      const redirectTo = location.state?.from?.pathname || DASHBOARD_BY_ROLE[data.role] || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not log in. Check your email and password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16 bg-forest-50/40">
      <div className="w-full max-w-md">
        <div className="card">
          <p className="stamp text-leaf-dark border-leaf mb-4">Welcome back</p>
          <h1 className="font-display text-2xl font-bold text-forest mb-1">Log in to ReFeedX</h1>
          <p className="text-sm text-ink/60 mb-6">Pick up right where you left off.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <ErrorMessage message={error} />

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-ink/60 mt-6 text-center">
            New to ReFeedX?{' '}
            <Link to="/register" className="text-leaf font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
