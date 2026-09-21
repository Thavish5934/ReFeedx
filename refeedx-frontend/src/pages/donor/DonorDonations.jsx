import { useEffect, useState } from 'react'
import * as donationService from '../../services/donationService'
import DonationCard from '../../components/cards/DonationCard'
import DonationForm from '../../components/forms/DonationForm'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const STATUS_OPTIONS = ['AVAILABLE', 'RESERVED', 'COLLECTED', 'COMPLETED', 'EXPIRED']

export default function DonorDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)

  function loadDonations() {
    setLoading(true)
    return donationService
      .getMyDonations()
      .then(setDonations)
      .catch((err) => setError(getErrorMessage(err, 'Could not load your donations.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDonations()
  }, [])

  async function handleCreate(values) {
    const created = await donationService.createDonation(values)
    setDonations((prev) => [created, ...prev])
    setCreating(false)
  }

  async function handleUpdate(id, values) {
    const updated = await donationService.updateDonation(id, values)
    setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)))
    setEditingId(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this donation? This cannot be undone.')) return
    await donationService.deleteDonation(id)
    setDonations((prev) => prev.filter((d) => d.id !== id))
  }

  async function handleStatusChange(id, status) {
    const updated = await donationService.updateDonationStatus(id, status)
    setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-leaf-dark border-leaf mb-4">Manage</p>
          <h1 className="font-display text-3xl font-bold text-forest">My Donations</h1>
        </div>
        {!creating && (
          <button onClick={() => setCreating(true)} className="btn-primary">
            + New Donation
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      {creating && (
        <div className="card mb-8">
          <h2 className="font-display text-lg font-bold text-forest mb-4">Post a new donation</h2>
          <DonationForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading your donations…" />
      ) : donations.length === 0 && !creating ? (
        <EmptyState
          title="No donations yet"
          description="Post your first surplus food listing to get started."
          action={
            <button onClick={() => setCreating(true)} className="btn-primary">
              + New Donation
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) =>
            editingId === donation.id ? (
              <div key={donation.id} className="card sm:col-span-2 lg:col-span-3">
                <h2 className="font-display text-lg font-bold text-forest mb-4">Edit donation</h2>
                <DonationForm
                  initialValues={donation}
                  submitLabel="Save Changes"
                  onSubmit={(values) => handleUpdate(donation.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
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
                      onClick={() => setEditingId(donation.id)}
                      className="text-xs font-semibold text-leaf hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(donation.id)}
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
