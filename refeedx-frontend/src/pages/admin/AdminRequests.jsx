import { useEffect, useState } from 'react'
import * as adminService from '../../services/adminService'
import * as requestService from '../../services/requestService'
import RequestCard from '../../components/cards/RequestCard'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const STATUS_OPTIONS = ['OPEN', 'MATCHED', 'FULFILLED', 'CLOSED']

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService
      .listAllRequests()
      .then(setRequests)
      .catch((err) => setError(getErrorMessage(err, 'Could not load requests.')))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Remove this request post? This cannot be undone.')) return
    await adminService.adminDeleteRequest(id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleStatusChange(id, status) {
    // Admin uses the same status-update endpoint as the owning requester/NGO -
    // the backend already permits ADMIN on PATCH /requests/{id}/status.
    const updated = await requestService.updateRequestStatus(id, status)
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }

  return (
    <div>
      <p className="stamp text-forest border-forest mb-4">Admin</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-8">All Requests</h1>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingState label="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests on the platform yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
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
                    onClick={() => handleDelete(request.id)}
                    className="text-xs font-semibold text-tomato-dark hover:underline"
                  >
                    Remove post
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

