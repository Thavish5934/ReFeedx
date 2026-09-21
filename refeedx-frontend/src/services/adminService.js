import api from '../api/axios'

export function listUsers(role) {
  return api.get('/admin/users', { params: role ? { role } : {} }).then((res) => res.data)
}

export function getUserDetails(id) {
  return api.get(`/admin/users/${id}`).then((res) => res.data)
}

export function setUserActive(id, active) {
  return api.patch(`/admin/users/${id}/active`, { active }).then((res) => res.data)
}

export function deleteUser(id) {
  return api.delete(`/admin/users/${id}`).then((res) => res.data)
}

export function listAllDonations() {
  return api.get('/admin/donations').then((res) => res.data)
}

export function adminDeleteDonation(id) {
  return api.delete(`/admin/donations/${id}`).then((res) => res.data)
}

export function listAllRequests() {
  return api.get('/admin/requests').then((res) => res.data)
}

export function adminDeleteRequest(id) {
  return api.delete(`/admin/requests/${id}`).then((res) => res.data)
}

export function listMessages(status) {
  return api.get('/admin/messages', { params: status ? { status } : {} }).then((res) => res.data)
}

export function updateMessageStatus(id, status) {
  return api.patch(`/admin/messages/${id}/status`, { status }).then((res) => res.data)
}

export function deleteMessage(id) {
  return api.delete(`/admin/messages/${id}`).then((res) => res.data)
}

export function getAnalytics() {
  return api.get('/admin/analytics').then((res) => res.data)
}
