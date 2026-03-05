import api from './api'

export const register = async ({ email, username, password }) => {
  const response = await api.post('/auth/register', { email, username, password })
  return response.data
}

export const login = async ({ username, password }) => {
  const body = new URLSearchParams()
  body.set('username', username)
  body.set('password', password)
  const response = await api.post('/auth/login', body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

export const me = async () => (await api.get('/users/me')).data
export const updateProfile = async (payload) => (await api.patch('/users/me', payload)).data
