import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const ROLE_OPTIONS = [
  { value: 'REQUESTER', label: 'Requester', blurb: 'I need food for myself or my community.' },
  { value: 'DONOR', label: 'Donor', blurb: 'I have surplus food to give.' },
  { value: 'NGO', label: 'NGO', blurb: 'We coordinate donations and requests.' },
]

const DASHBOARD_BY_ROLE = {
  DONOR: '/donor/dashboard',
  REQUESTER: '/requester/dashboard',
  NGO: '/ngo/dashboard',
}

const VALID_ROLES = ROLE_OPTIONS.map((r) => r.value)

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const presetRole = searchParams.get('role')
  const initialRole = VALID_ROLES.includes(presetRole) ? presetRole : 'REQUESTER'

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', role: initialRole })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function selectRole(value) {
    setForm((prev) => ({ ...prev, role: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await register(form)
      navigate(DASHBOARD_BY_ROLE[data.role] || '/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account. Please check the form and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16 bg-forest-50/40">
      <div className="w-full max-w-lg">
        <div className="card">
          <p className="stamp text-marigold-dark border-marigold mb-4">Join the table</p>
          <h1 className="font-display text-2xl font-bold text-forest mb-1">Create your ReFeedX account</h1>
          <p className="text-sm text-ink/60 mb-6">Choose how you’ll take part in redistributing food.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="label">I am a...</span>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectRole(opt.value)}
                    className={`text-left rounded-lg border-2 px-3 py-2.5 transition-colors ${
                      form.role === opt.value
                        ? 'border-leaf bg-leaf/5'
                        : 'border-forest-100 hover:border-leaf/50'
                    }`}
                  >
                    <span className="block text-sm font-semibold text-forest">{opt.label}</span>
                    <span className="block text-[11px] text-ink/50 mt-0.5 leading-snug">{opt.blurb}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" name="phone" required className="input" value={form.phone} onChange={handleChange} />
              </div>
            </div>

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
                minLength={8}
                autoComplete="new-password"
                className="input"
                value={form.password}
                onChange={handleChange}
              />
              <p className="text-xs text-ink/40 mt-1">At least 8 characters.</p>
            </div>

            <div>
              <label className="label" htmlFor="address">Address (optional)</label>
              <input id="address" name="address" className="input" value={form.address} onChange={handleChange} />
            </div>

            <ErrorMessage message={error} />

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating your account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-ink/60 mt-6 text-center">
            Already on ReFeedX?{' '}
            <Link to="/login" className="text-leaf font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
