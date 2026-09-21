import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as requestService from '../../services/requestService'
import StatCard from '../../components/cards/StatCard'
import RequestCard from '../../components/cards/RequestCard'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import { useAuth } from '../../context/AuthContext'

export default function RequesterDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    requestService
      .getMyRequests()
      .then((data) => !cancelled && setRequests(data))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const open = requests.filter((r) => r.status === 'OPEN' || r.status === 'MATCHED').length
  const fulfilled = requests.filter((r) => r.status === 'FULFILLED').length
  const recent = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-tomato-dark border-tomato mb-4">Requester Dashboard</p>
          <h1 className="font-display text-3xl font-bold text-forest">Welcome back, {user?.name?.split(' ')[0]}</h1>
        </div>
        <Link to="/requester/requests" className="btn-primary">
          Post a Request
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="My Requests" value={requests.length} accent="forest" />
        <StatCard label="Open Requests" value={open} accent="tomato" />
        <StatCard label="Fulfilled Requests" value={fulfilled} accent="leaf" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-forest">Recent requests</h2>
        <Link to="/requester/requests" className="text-sm font-semibold text-leaf hover:underline">
          Manage all →
        </Link>
      </div>

      {loading ? (
        <LoadingState label="Loading your requests…" />
      ) : recent.length === 0 ? (
        <EmptyState
          title="You haven't posted any requests yet"
          description="Post what you need and let nearby donors find you."
          action={
            <Link to="/requester/requests" className="btn-primary">
              Post a Request
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}
