import api from '../lib/axios'
import {
	Marker,
	PollutionTypeModel,
	PollutionStats,
	PollutionType,
} from '@/shared/types'

interface GetMarkersParams {
	pollution_type?: number
	region_type?: string
	search?: string
}

interface CreateMarkerDto {
	latitude: string
	longitude: string
	description: string
	region_type: string
	pollution_type: {
		name: string
		description?: string
	}
	photos?: Array<{image_path: string}>
}

interface UpdateMarkerDto {
	latitude?: string
	longitude?: string
	description?: string
	region_type?: string
	pollution_type?: {
		name: string
		description?: string
	}
}

export const pollutionService = {
	async getAll(params?: GetMarkersParams): Promise<Marker[]> {
		const {data} = await api.get<Marker[]>('/markers/', {params})
		return data
	},

	async getById(id: number): Promise<Marker> {
		const {data} = await api.get<Marker>(`/markers/${id}/`)
		return data
	},

	async create(markerData: CreateMarkerDto): Promise<Marker> {
		const {data} = await api.post<Marker>('/markers/', markerData)
		return data
	},

	async update(id: number, markerData: UpdateMarkerDto): Promise<Marker> {
		const {data} = await api.put<Marker>(`/markers/${id}/`, markerData)
		return data
	},

	async patch(id: number, markerData: Partial<UpdateMarkerDto>): Promise<Marker> {
		const {data} = await api.patch<Marker>(`/markers/${id}/`, markerData)
		return data
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/markers/${id}/`)
	},

	async getPollutionTypes(): Promise<PollutionTypeModel[]> {
		const {data} = await api.get<PollutionTypeModel[]>('/pollution-types/')
		return data
	},

	async getStats(): Promise<PollutionStats> {
		const markers = await this.getAll()
		return {
			total: markers.length,
			reported: markers.length, // All markers are reported by default
			inProgress: 0,
			cleaned: 0,
			byType: {} as Record<PollutionType, number>,
			byRegion: markers.reduce(
				(acc, m) => {
					acc[m.region_type] = (acc[m.region_type] || 0) + 1
					return acc
				},
				{} as Record<string, number>,
			),
		}
	},


	async exportReport(params?: GetMarkersParams): Promise<Blob> {
		const markers = await this.getAll(params)
		// Convert to CSV
		const csv = this.convertToCSV(markers)
		return new Blob([csv], {type: 'text/csv'})
	},

	// Helper: Convert markers to CSV
	convertToCSV(markers: Marker[]): string {
		const headers = [
			'ID',
			'Latitude',
			'Longitude',
			'Type',
			'Region',
			'Description',
			'Created',
		]
		const rows = markers.map((m) => [
			m.id,
			m.latitude,
			m.longitude,
			m.pollution_type.name,
			m.region_type,
			m.description,
			m.created_at,
		])
		return [headers, ...rows].map((row) => row.join(',')).join('\n')
	},
}
