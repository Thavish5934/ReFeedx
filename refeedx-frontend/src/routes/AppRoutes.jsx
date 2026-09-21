import { Routes, Route } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

import Landing from '../pages/public/Landing'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import DonationsPublic from '../pages/public/DonationsPublic'
import RequestsPublic from '../pages/public/RequestsPublic'
import NotFound from '../pages/public/NotFound'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import DonorDashboard from '../pages/donor/DonorDashboard'
import DonorDonations from '../pages/donor/DonorDonations'

import RequesterDashboard from '../pages/requester/RequesterDashboard'
import RequesterRequests from '../pages/requester/RequesterRequests'

import NgoDashboard from '../pages/ngo/NgoDashboard'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminDonations from '../pages/admin/AdminDonations'
import AdminRequests from '../pages/admin/AdminRequests'
import AdminMessages from '../pages/admin/AdminMessages'

import Profile from '../pages/common/Profile'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site - browsable with or without an account */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/donations" element={<DonationsPublic />} />
        <Route path="/requests" element={<RequestsPublic />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Role-protected dashboards */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donations"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorDonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requester/dashboard"
          element={
            <ProtectedRoute allowedRoles={['REQUESTER']}>
              <RequesterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requester/requests"
          element={
            <ProtectedRoute allowedRoles={['REQUESTER']}>
              <RequesterRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['NGO']}>
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminMessages />
            </ProtectedRoute>
          }
        />

        {/* Any authenticated user, regardless of role */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
