import { useEffect, useState } from 'react'
import * as donationService from '../../services/donationService'
import DonationCard from '../../components/cards/DonationCard'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const STATUS_OPTIONS = ['', 'AVAILABLE', 'RESERVED', 'COLLECTED', 'COMPLETED']

export default function DonationsPublic() {
  const [donations, setDonations] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    donationService
      .getDonations(status ? { status } : {})
      .then((data) => !cancelled && setDonations(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load donations.')))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [status])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="stamp text-leaf-dark border-leaf mb-4">Available Now</p>
          <h1 className="font-display text-3xl font-bold text-forest">Food Donations</h1>
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
        <LoadingState label="Loading donations…" />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No donations to show"
          description="Check back soon, or be the first to post one."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </div>
  )
}
