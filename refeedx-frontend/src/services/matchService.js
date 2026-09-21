import api from '../api/axios'

export function createMatch(payload) {
  return api.post('/matches', payload).then((res) => res.data)
}

export function getMatch(id) {
  return api.get(`/matches/${id}`).then((res) => res.data)
}

export function getMyCoordinatedMatches() {
  return api.get('/matches/mine').then((res) => res.data)
}

export function updateMatchStatus(id, status) {
  return api.patch(`/matches/${id}/status`, { status }).then((res) => res.data)
}
