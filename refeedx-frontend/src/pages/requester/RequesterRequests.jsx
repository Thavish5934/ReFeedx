import { useEffect, useState } from 'react'
import * as requestService from '../../services/requestService'
import RequestCard from '../../components/cards/RequestCard'
import RequestForm from '../../components/forms/RequestForm'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const STATUS_OPTIONS = ['OPEN', 'MATCHED', 'FULFILLED', 'CLOSED']

export default function RequesterRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)

  function loadRequests() {
    setLoading(true)
    return requestService
      .getMyRequests()
      .then(setRequests)
      .catch((err) => setError(getErrorMessage(err, 'Could not load your requests.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handleCreate(values) {
    const created = await requestService.createRequest(values)
    setRequests((prev) => [created, ...prev])
    setCreating(false)
  }

  async function handleUpdate(id, values) {
    const updated = await requestService.updateRequest(id, values)
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
    setEditingId(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this request? This cannot be undone.')) return
    await requestService.deleteRequest(id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleStatusChange(id, status) {
    const updated = await requestService.updateRequestStatus(id, status)
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-tomato-dark border-tomato mb-4">Manage</p>
          <h1 className="font-display text-3xl font-bold text-forest">My Requests</h1>
        </div>
        {!creating && (
          <button onClick={() => setCreating(true)} className="btn-primary">
            + New Request
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      {creating && (
        <div className="card mb-8">
          <h2 className="font-display text-lg font-bold text-forest mb-4">Post a new request</h2>
          <RequestForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading your requests…" />
      ) : requests.length === 0 && !creating ? (
        <EmptyState
          title="No requests yet"
          description="Post what you need to get started."
          action={
            <button onClick={() => setCreating(true)} className="btn-primary">
              + New Request
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) =>
            editingId === request.id ? (
              <div key={request.id} className="card sm:col-span-2 lg:col-span-3">
                <h2 className="font-display text-lg font-bold text-forest mb-4">Edit request</h2>
                <RequestForm
                  initialValues={request}
                  submitLabel="Save Changes"
                  onSubmit={(values) => handleUpdate(request.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <RequestCard
                key={request.id}
                request={request}
                footer={
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="input !w-auto !py-1.5 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setEditingId(request.id)}
                      className="text-xs font-semibold text-leaf hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="text-xs font-semibold text-tomato-dark hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}
