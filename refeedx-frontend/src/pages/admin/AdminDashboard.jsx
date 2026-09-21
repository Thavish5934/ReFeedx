import { useEffect, useState } from 'react'
import * as adminService from '../../services/adminService'
import StatCard from '../../components/cards/StatCard'
import LoadingState from '../../components/common/LoadingState'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, 'Could not load analytics.')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState label="Loading analytics…" />
  if (error) return <ErrorMessage message={error} />
  if (!stats) return null

  return (
    <div>
      <p className="stamp text-forest border-forest mb-4">Admin Dashboard</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-10">Platform Analytics</h1>

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-4">People</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Users" value={stats.totalUsers} accent="forest" />
          <StatCard label="Requesters" value={stats.totalRequesters} accent="tomato" />
          <StatCard label="Donors" value={stats.totalDonors} accent="leaf" />
          <StatCard label="NGOs" value={stats.totalNgos} accent="marigold" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-4">Donations</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <StatCard label="Total Donations" value={stats.totalDonations} accent="forest" />
          <StatCard label="Active Donations" value={stats.activeDonations} accent="leaf" />
          <StatCard label="Completed Donations" value={stats.completedDonations} accent="marigold" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-4">Requests</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <StatCard label="Total Requests" value={stats.totalFoodRequests} accent="forest" />
          <StatCard label="Pending (Open) Requests" value={stats.pendingRequests} accent="tomato" />
          <StatCard label="Fulfilled Requests" value={stats.fulfilledRequests} accent="leaf" />
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-4">Matches &amp; Messages</h2>
        <div className="grid sm:grid-cols-4 gap-5">
          <StatCard label="Total Matches" value={stats.totalMatches} accent="marigold" />
          <StatCard label="Completed Matches" value={stats.completedMatches} accent="leaf" />
          <StatCard label="Contact Messages" value={stats.totalContactMessages} accent="forest" />
          <StatCard label="Unread Messages" value={stats.unreadContactMessages} accent="tomato" />
        </div>
      </section>
    </div>
  )
}
