import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as donationService from '../../services/donationService'
import StatCard from '../../components/cards/StatCard'
import DonationCard from '../../components/cards/DonationCard'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import { useAuth } from '../../context/AuthContext'

export default function DonorDashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    donationService
      .getMyDonations()
      .then((data) => !cancelled && setDonations(data))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const active = donations.filter((d) => d.status === 'AVAILABLE' || d.status === 'RESERVED').length
  const completed = donations.filter((d) => d.status === 'COMPLETED').length
  const recent = [...donations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-leaf-dark border-leaf mb-4">Donor Dashboard</p>
          <h1 className="font-display text-3xl font-bold text-forest">Welcome back, {user?.name?.split(' ')[0]}</h1>
        </div>
        <Link to="/donor/donations" className="btn-primary">
          Post a Donation
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="My Donations" value={donations.length} accent="forest" />
        <StatCard label="Active Donations" value={active} accent="leaf" />
        <StatCard label="Completed Donations" value={completed} accent="marigold" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-forest">Recent donations</h2>
        <Link to="/donor/donations" className="text-sm font-semibold text-leaf hover:underline">
          Manage all →
        </Link>
      </div>

      {loading ? (
        <LoadingState label="Loading your donations…" />
      ) : recent.length === 0 ? (
        <EmptyState
          title="You haven't posted any donations yet"
          description="Share your first surplus food post and help someone eat well tonight."
          action={
            <Link to="/donor/donations" className="btn-primary">
              Post a Donation
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </div>
  )
}
