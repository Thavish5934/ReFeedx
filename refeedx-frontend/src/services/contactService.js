import api from '../api/axios'

export function submitContactMessage(payload) {
  return api.post('/contact', payload).then((res) => res.data)
}
