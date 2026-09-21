import { useEffect, useState } from 'react'
import * as adminService from '../../services/adminService'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatDate } from '../../utils/formatDate'

const ROLE_OPTIONS = ['', 'REQUESTER', 'DONOR', 'NGO', 'ADMIN']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadUsers() {
    setLoading(true)
    setError('')
    return adminService
      .listUsers(role || undefined)
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err, 'Could not load users.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  async function toggleActive(user) {
    const updated = await adminService.setUserActive(user.id, !user.active)
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
  }

  async function handleDelete(user) {
    if (user.role === 'ADMIN') return
    if (!window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return
    await adminService.deleteUser(user.id)
    setUsers((prev) => prev.filter((u) => u.id !== user.id))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-forest border-forest mb-4">Admin</p>
          <h1 className="font-display text-3xl font-bold text-forest">Users</h1>
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="input w-auto">
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt || 'All roles'}</option>
          ))}
        </select>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingState label="Loading users…" />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40 border-b border-forest-100">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Joined</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-forest-100 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink">{user.name}</td>
                  <td className="py-3 pr-4 text-ink/60">{user.email}</td>
                  <td className="py-3 pr-4 text-ink/60">{user.role}</td>
                  <td className="py-3 pr-4 text-ink/60">{formatDate(user.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <span className={user.active ? 'text-leaf-dark' : 'text-tomato-dark'}>
                      {user.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    {user.role !== 'ADMIN' && (
                      <>
                        <button
                          onClick={() => toggleActive(user)}
                          className="text-xs font-semibold text-marigold-dark hover:underline mr-4"
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-xs font-semibold text-tomato-dark hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
