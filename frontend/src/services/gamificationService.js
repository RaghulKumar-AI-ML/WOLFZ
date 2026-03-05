import api from './api'

export const fetchWolfProfile = async () => (await api.get('/gamification/profile')).data
