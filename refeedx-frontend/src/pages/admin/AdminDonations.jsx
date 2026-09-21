import { useEffect, useState } from 'react'
import * as adminService from '../../services/adminService'
import * as donationService from '../../services/donationService'
import DonationCard from '../../components/cards/DonationCard'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const STATUS_OPTIONS = ['AVAILABLE', 'RESERVED', 'COLLECTED', 'COMPLETED', 'EXPIRED']

export default function AdminDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService
      .listAllDonations()
      .then(setDonations)
      .catch((err) => setError(getErrorMessage(err, 'Could not load donations.')))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Remove this donation post? This cannot be undone.')) return
    await adminService.adminDeleteDonation(id)
    setDonations((prev) => prev.filter((d) => d.id !== id))
  }

  async function handleStatusChange(id, status) {
    // Admin uses the same status-update endpoint as the owning donor/NGO -
    // the backend already permits ADMIN on PATCH /donations/{id}/status.
    const updated = await donationService.updateDonationStatus(id, status)
    setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)))
  }

  return (
    <div>
      <p className="stamp text-forest border-forest mb-4">Admin</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-8">All Donations</h1>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingState label="Loading donations…" />
      ) : donations.length === 0 ? (
        <EmptyState title="No donations on the platform yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              footer={
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={donation.status}
                    onChange={(e) => handleStatusChange(donation.id, e.target.value)}
                    className="input !w-auto !py-1.5 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(donation.id)}
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

