import { apiClient } from './client.js'

export const getMaintenanceRequests = () => apiClient.get('/maintenance-requests').then(({ data }) => data)
export const createMaintenanceRequest = (payload) => apiClient.post('/maintenance-requests', payload).then(({ data }) => data)
export const updateMaintenanceRequest = (id, payload) => apiClient.put(`/maintenance-requests/${encodeURIComponent(id)}`, payload).then(({ data }) => data)
export const deleteMaintenanceRequest = (id) => apiClient.delete(`/maintenance-requests/${encodeURIComponent(id)}`)
