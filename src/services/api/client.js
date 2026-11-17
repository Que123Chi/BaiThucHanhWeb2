import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
})

export async function apiRequest(path, options = {}) {
  const { body, ...config } = options
  const data = typeof body === 'string' ? JSON.parse(body) : body
  const response = await apiClient.request({ url: path, data, ...config })
  return response.status === 204 ? null : response.data
}
