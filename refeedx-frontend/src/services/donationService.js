import api from '../api/axios'

export function getDonations(params = {}) {
  return api.get('/donations', { params }).then((res) => res.data)
}

export function getDonation(id) {
  return api.get(`/donations/${id}`).then((res) => res.data)
}

export function getMyDonations() {
  return api.get('/donations/mine').then((res) => res.data)
}

export function createDonation(payload) {
  return api.post('/donations', payload).then((res) => res.data)
}

export function updateDonation(id, payload) {
  return api.put(`/donations/${id}`, payload).then((res) => res.data)
}

export function deleteDonation(id) {
  return api.delete(`/donations/${id}`).then((res) => res.data)
}

export function updateDonationStatus(id, status) {
  return api.patch(`/donations/${id}/status`, { status }).then((res) => res.data)
}
