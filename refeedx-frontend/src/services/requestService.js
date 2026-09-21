import api from '../api/axios'

export function getRequests(params = {}) {
  return api.get('/requests', { params }).then((res) => res.data)
}

export function getRequest(id) {
  return api.get(`/requests/${id}`).then((res) => res.data)
}

export function getMyRequests() {
  return api.get('/requests/mine').then((res) => res.data)
}

export function createRequest(payload) {
  return api.post('/requests', payload).then((res) => res.data)
}

export function updateRequest(id, payload) {
  return api.put(`/requests/${id}`, payload).then((res) => res.data)
}

export function deleteRequest(id) {
  return api.delete(`/requests/${id}`).then((res) => res.data)
}

export function updateRequestStatus(id, status) {
  return api.patch(`/requests/${id}/status`, { status }).then((res) => res.data)
}
