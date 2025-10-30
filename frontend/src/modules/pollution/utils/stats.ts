import {Marker, PollutionStats} from '../domain/pollution.model'

const initialStats: PollutionStats = {
	total: 0,
	reported: 0,
	inProgress: 0,
	cleaned: 0,
	byType: {},
	byRegion: {},
}

export const buildPollutionStats = (markers: Marker[]): PollutionStats => {
	return markers.reduce((stats, marker) => {
		stats.total += 1
		stats.reported += 1

		const typeKey = marker.pollution_type.name
		stats.byType[typeKey] = (stats.byType[typeKey] ?? 0) + 1

		const regionKey = marker.region_type
		stats.byRegion[regionKey] = (stats.byRegion[regionKey] ?? 0) + 1

		return stats
	}, {...initialStats})
}
