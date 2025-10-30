import {httpClient} from '@/shared/api/http.client'
import {
	CreateMarkerPayload,
	Marker,
	MarkerFilters,
	PollutionStats,
	PollutionTypeModel,
	UpdateMarkerPayload,
} from '../domain/pollution.model'
import {buildPollutionStats} from '../utils/stats'
import {markersToCSV} from '../utils/report'

const PollutionEndpoints = {
	markers: '/markers/',
	marker: (id: number) => `/markers/${id}/`,
	types: '/pollution-types/',
} as const

export const pollutionApi = {
	async getAll(params?: MarkerFilters): Promise<Marker[]> {
		const {data} = await httpClient.get<Marker[]>(PollutionEndpoints.markers, {params})
		return data
	},

	async getById(id: number): Promise<Marker> {
		const {data} = await httpClient.get<Marker>(PollutionEndpoints.marker(id))
		return data
	},

	async create(payload: CreateMarkerPayload): Promise<Marker> {
		const {data} = await httpClient.post<Marker>(PollutionEndpoints.markers, payload)
		return data
	},

	async update(id: number, payload: UpdateMarkerPayload): Promise<Marker> {
		const {data} = await httpClient.put<Marker>(PollutionEndpoints.marker(id), payload)
		return data
	},

	async patch(id: number, payload: Partial<UpdateMarkerPayload>): Promise<Marker> {
		const {data} = await httpClient.patch<Marker>(PollutionEndpoints.marker(id), payload)
		return data
	},

	async delete(id: number): Promise<void> {
		await httpClient.delete(PollutionEndpoints.marker(id))
	},

	async getPollutionTypes(): Promise<PollutionTypeModel[]> {
		const {data} = await httpClient.get<PollutionTypeModel[]>(PollutionEndpoints.types)
		return data
	},

	async getStats(params?: MarkerFilters): Promise<PollutionStats> {
		const markers = await this.getAll(params)
		return buildPollutionStats(markers)
	},

	async exportReport(params?: MarkerFilters): Promise<Blob> {
		const markers = await this.getAll(params)
		const csv = markersToCSV(markers)
		return new Blob([csv], {type: 'text/csv'})
	},
}
