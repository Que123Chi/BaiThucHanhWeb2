import { apiClient } from './client.js'

export const getEquipment = (params) => apiClient.get('/equipment', { params }).then(({ data }) => data)
export const getEquipmentById = (id) => apiClient.get(`/equipment/${encodeURIComponent(id)}`).then(({ data }) => data)
export const createEquipment = (payload) => apiClient.post('/equipment', payload).then(({ data }) => data)
export const updateEquipment = (id, payload) => apiClient.put(`/equipment/${encodeURIComponent(id)}`, payload).then(({ data }) => data)
export const deleteEquipment = (id) => apiClient.delete(`/equipment/${encodeURIComponent(id)}`)
