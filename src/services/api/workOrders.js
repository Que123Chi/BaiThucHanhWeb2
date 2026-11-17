import { apiClient } from './client.js'

export const getWorkOrders = () => apiClient.get('/work-orders').then(({ data }) => data)
export const createWorkOrder = (payload) => apiClient.post('/work-orders', payload).then(({ data }) => data)
export const updateWorkOrder = (id, payload) => apiClient.put(`/work-orders/${encodeURIComponent(id)}`, payload).then(({ data }) => data)
export const deleteWorkOrder = (id) => apiClient.delete(`/work-orders/${encodeURIComponent(id)}`)
