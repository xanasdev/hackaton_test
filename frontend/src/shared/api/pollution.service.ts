import axiosInstance from '@/shared/lib/axios'
import {
  PollutionPoint,
  CreatePollutionPointDto,
  UpdatePollutionPointDto,
  PollutionStats,
  PollutionStatus,
  PollutionType,
} from '@/shared/types'

interface GetPollutionPointsParams {
  status?: PollutionStatus
  type?: PollutionType
  region?: string
  limit?: number
  offset?: number
}

export const pollutionService = {
  async getAll(params?: GetPollutionPointsParams): Promise<PollutionPoint[]> {
    const response = await axiosInstance.get<PollutionPoint[]>('/pollution', { params })
    return response.data
  },

  async getById(id: string): Promise<PollutionPoint> {
    const response = await axiosInstance.get<PollutionPoint>(`/pollution/${id}`)
    return response.data
  },

  async create(data: CreatePollutionPointDto): Promise<PollutionPoint> {
    const formData = new FormData()
    formData.append('latitude', data.latitude.toString())
    formData.append('longitude', data.longitude.toString())
    formData.append('type', data.type)
    formData.append('description', data.description)
    if (data.region) formData.append('region', data.region)
    
    data.photos.forEach((photo) => {
      formData.append('photos', photo)
    })

    const response = await axiosInstance.post<PollutionPoint>('/pollution', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async update(id: string, data: UpdatePollutionPointDto): Promise<PollutionPoint> {
    const response = await axiosInstance.patch<PollutionPoint>(`/pollution/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/pollution/${id}`)
  },

  async getStats(): Promise<PollutionStats> {
    const response = await axiosInstance.get<PollutionStats>('/pollution/stats')
    return response.data
  },

  async exportReport(params?: GetPollutionPointsParams): Promise<Blob> {
    const response = await axiosInstance.get('/pollution/export', {
      params,
      responseType: 'blob',
    })
    return response.data
  },
}
