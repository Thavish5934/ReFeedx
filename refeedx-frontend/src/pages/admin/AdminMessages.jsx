import { useEffect, useState } from 'react'
import * as adminService from '../../services/adminService'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatDateTime } from '../../utils/formatDate'

const STATUS_OPTIONS = ['', 'UNREAD', 'READ', 'RESOLVED']

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadMessages() {
    setLoading(true)
    setError('')
    return adminService
      .listMessages(status || undefined)
      .then(setMessages)
      .catch((err) => setError(getErrorMessage(err, 'Could not load messages.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  async function handleStatusChange(id, newStatus) {
    const updated = await adminService.updateMessageStatus(id, newStatus)
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)))
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    await adminService.deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-forest border-forest mb-4">Admin</p>
          <h1 className="font-display text-3xl font-bold text-forest">Contact Messages</h1>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto">
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt || 'All statuses'}</option>
          ))}
        </select>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingState label="Loading messages…" />
      ) : messages.length === 0 ? (
        <EmptyState title="No messages" />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-display text-lg font-bold text-forest">{message.subject}</p>
                  <p className="text-xs text-ink/50">
                    {message.name} · {message.email} {message.phone && `· ${message.phone}`}
                  </p>
                </div>
                <StatusBadge status={message.status} />
              </div>
              <p className="text-sm text-ink/70 leading-relaxed mb-4">{message.message}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-forest-100">
                <p className="text-xs text-ink/40">{formatDateTime(message.createdAt)}</p>
                <div className="flex items-center gap-3">
                  <select
                    value={message.status}
                    onChange={(e) => handleStatusChange(message.id, e.target.value)}
                    className="input !w-auto !py-1.5 text-xs"
                  >
                    {['UNREAD', 'READ', 'RESOLVED'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-xs font-semibold text-tomato-dark hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
