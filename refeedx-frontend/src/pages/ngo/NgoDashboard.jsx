import { useEffect, useState } from 'react'
import * as donationService from '../../services/donationService'
import * as requestService from '../../services/requestService'
import * as matchService from '../../services/matchService'
import DonationCard from '../../components/cards/DonationCard'
import RequestCard from '../../components/cards/RequestCard'
import StatCard from '../../components/cards/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import SuccessMessage from '../../components/common/SuccessMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const MATCH_STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export default function NgoDashboard() {
  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedDonation, setSelectedDonation] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [matching, setMatching] = useState(false)

  function loadAll() {
    setLoading(true)
    setError('')
    return Promise.all([
      donationService.getDonations({ status: 'AVAILABLE' }),
      requestService.getRequests({ status: 'OPEN' }),
      matchService.getMyCoordinatedMatches(),
    ])
      .then(([donationData, requestData, matchData]) => {
        setDonations(donationData)
        setRequests(requestData)
        setMatches(matchData)
      })
      .catch((err) => setError(getErrorMessage(err, 'Could not load the coordination board.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function handleCreateMatch() {
    if (!selectedDonation || !selectedRequest) return
    setMatching(true)
    setError('')
    setSuccess('')
    try {
      await matchService.createMatch({ donationId: selectedDonation.id, requestId: selectedRequest.id })
      setSuccess(`Matched "${selectedDonation.foodName}" with ${selectedRequest.requester?.name}'s request.`)
      setSelectedDonation(null)
      setSelectedRequest(null)
      loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create this match. It may no longer be available.'))
    } finally {
      setMatching(false)
    }
  }

  async function handleMatchStatusChange(id, status) {
    const updated = await matchService.updateMatchStatus(id, status)
    setMatches((prev) => prev.map((m) => (m.id === id ? updated : m)))
  }

  const inProgress = matches.filter((m) => m.status === 'PENDING' || m.status === 'IN_PROGRESS').length
  const completed = matches.filter((m) => m.status === 'COMPLETED').length

  return (
    <div className="pb-24">
      <p className="stamp text-marigold-dark border-marigold mb-4">NGO Coordination</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-8">Match Donations to Requests</h1>

      <div className="grid sm:grid-cols-4 gap-5 mb-10">
        <StatCard label="Available Donations" value={donations.length} accent="leaf" />
        <StatCard label="Open Requests" value={requests.length} accent="tomato" />
        <StatCard label="Matches In Progress" value={inProgress} accent="marigold" />
        <StatCard label="Matches Completed" value={completed} accent="forest" />
      </div>

      <ErrorMessage message={error} />
      <div className="mb-6">
        <SuccessMessage message={success} />
      </div>

      {loading ? (
        <LoadingState label="Loading the coordination board…" />
      ) : (
        <>
          <p className="text-sm text-ink/60 mb-6">
            Tap a donation and a request below to pair them up, then confirm the match.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mb-14">
            <div>
              <h2 className="font-display text-lg font-bold text-forest mb-4">Available Donations ↔</h2>
              {donations.length === 0 ? (
                <EmptyState title="No available donations right now" />
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <DonationCard
                      key={donation.id}
                      donation={donation}
                      selectable
                      selected={selectedDonation?.id === donation.id}
                      onSelect={setSelectedDonation}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-forest mb-4">↔ Open Requests</h2>
              {requests.length === 0 ? (
                <EmptyState title="No open requests right now" />
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      selectable
                      selected={selectedRequest?.id === request.id}
                      onSelect={setSelectedRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-forest mb-4">My Coordinated Matches</h2>
            {matches.length === 0 ? (
              <EmptyState
                title="No matches coordinated yet"
                description="Pair a donation with a request above to start one."
              />
            ) : (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div key={match.id} className="card flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-semibold text-forest">{match.donation?.foodName}</p>
                      <p className="text-xs text-ink/50">
                        to {match.foodRequest?.requester?.name} · {match.foodRequest?.foodType}
                      </p>
                    </div>
                    <StatusBadge status={match.status} />
                    <select
                      value={match.status}
                      onChange={(e) => handleMatchStatusChange(match.id, e.target.value)}
                      className="input !w-auto !py-1.5 text-xs"
                    >
                      {MATCH_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sticky confirmation bar once both sides are selected */}
      {selectedDonation && selectedRequest && (
        <div className="fixed bottom-0 left-0 right-0 bg-forest text-paper shadow-stamp">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm">
              Match <span className="font-semibold text-marigold">{selectedDonation.foodName}</span> with{' '}
              <span className="font-semibold text-marigold">{selectedRequest.requester?.name}&rsquo;s</span> request?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedDonation(null)
                  setSelectedRequest(null)
                }}
                className="btn border-2 border-paper/30 text-paper text-sm px-4 py-2 hover:bg-paper/10"
              >
                Cancel
              </button>
              <button onClick={handleCreateMatch} disabled={matching} className="btn-secondary text-sm px-4 py-2">
                {matching ? 'Matching…' : 'Confirm Match'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
