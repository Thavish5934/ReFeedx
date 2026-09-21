import api from '../api/axios'

export function getUser(id) {
  return api.get(`/users/${id}`).then((res) => res.data)
}

export function updateMyProfile(payload) {
  return api.put('/users/me', payload).then((res) => res.data)
}

export function changeMyPassword(payload) {
  return api.put('/users/me/password', payload).then((res) => res.data)
}
