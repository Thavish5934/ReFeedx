import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-forest-50/50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
