import { useEffect, useState } from 'react'
import * as requestService from '../../services/requestService'
import RequestCard from '../../components/cards/RequestCard'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const STATUS_OPTIONS = ['', 'OPEN', 'MATCHED', 'FULFILLED', 'CLOSED']

export default function RequestsPublic() {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    requestService
      .getRequests(status ? { status } : {})
      .then((data) => !cancelled && setRequests(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load requests.')))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [status])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="stamp text-tomato-dark border-tomato mb-4">Needed Now</p>
          <h1 className="font-display text-3xl font-bold text-forest">Food Requests</h1>
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto">
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt || 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingState label="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No open requests right now"
          description="When someone posts a need, it'll show up here."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}
