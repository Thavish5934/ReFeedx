import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/authService'
import * as userService from '../../services/userService'
import LoadingState from '../../components/common/LoadingState'
import ErrorMessage from '../../components/common/ErrorMessage'
import SuccessMessage from '../../components/common/SuccessMessage'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatDate } from '../../utils/formatDate'

export default function Profile() {
  const { updateUserInContext } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '' })
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((data) => {
        setProfile(data)
        setProfileForm({ name: data.name, phone: data.phone, address: data.address || '' })
      })
      .finally(() => setLoading(false))
  }, [])

  function handleProfileChange(e) {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePasswordChange(e) {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setSavingProfile(true)
    try {
      const updated = await userService.updateMyProfile(profileForm)
      setProfile(updated)
      updateUserInContext({ name: updated.name })
      setProfileSuccess('Profile updated.')
    } catch (err) {
      setProfileError(getErrorMessage(err, 'Could not update your profile.'))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setSavingPassword(true)
    try {
      await userService.changeMyPassword(passwordForm)
      setPasswordForm({ currentPassword: '', newPassword: '' })
      setPasswordSuccess('Password changed.')
    } catch (err) {
      setPasswordError(getErrorMessage(err, 'Could not change your password.'))
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) return <LoadingState label="Loading your profile…" />
  if (!profile) return <ErrorMessage message="Could not load your profile." />

  return (
    <div className="max-w-2xl">
      <p className="stamp text-leaf-dark border-leaf mb-4">Your Account</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-1">Profile</h1>
      <p className="text-sm text-ink/50 mb-10">
        {profile.email} · {profile.role} · Member since {formatDate(profile.createdAt)}
      </p>

      <div className="card mb-8">
        <h2 className="font-display text-lg font-bold text-forest mb-4">Edit profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              required
              className="input"
              value={profileForm.name}
              onChange={handleProfileChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              required
              className="input"
              value={profileForm.phone}
              onChange={handleProfileChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              className="input"
              value={profileForm.address}
              onChange={handleProfileChange}
            />
          </div>

          <ErrorMessage message={profileError} />
          <SuccessMessage message={profileSuccess} />

          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-display text-lg font-bold text-forest mb-4">Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="currentPassword">Current password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <label className="label" htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
            <p className="text-xs text-ink/40 mt-1">At least 8 characters.</p>
          </div>

          <ErrorMessage message={passwordError} />
          <SuccessMessage message={passwordSuccess} />

          <button type="submit" disabled={savingPassword} className="btn-primary">
            {savingPassword ? 'Saving…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
