export enum PollutionStatus {
	REPORTED = 'REPORTED',
	IN_PROGRESS = 'IN_PROGRESS',
	CLEANED = 'CLEANED',
	VERIFIED = 'VERIFIED',
}

export enum PollutionType {
	TRASH = 'trash',
	OIL_SPILL = 'oil_spill',
	INDUSTRIAL_WASTE = 'industrial_waste',
	SEWAGE = 'sewage',
	PLASTIC = 'plastic',
	OTHER = 'other',
}

export interface PollutionTypeModel {
	id: number
	name: string
	description?: string
}

export interface MarkerPhoto {
	id: number
	image_path: string
	uploaded_at: string
}

export interface MarkerReporter {
	name?: string
	avatar?: string
	email?: string
}

export interface Marker {
	id: number
	latitude: string
	longitude: string
	description: string
	region_type: string
	pollution_type: PollutionTypeModel
	status?: PollutionStatus
	photos?: MarkerPhoto[]
	reported_by?: MarkerReporter
	created_at: string
}

export interface PollutionStats {
	total: number
	reported: number
	inProgress: number
	cleaned: number
	byType: Record<string, number>
	byRegion: Record<string, number>
}

export interface MarkerFilters {
	pollution_type?: number
	region_type?: string
	search?: string
	status?: PollutionStatus
	type?: PollutionType | string
}

export interface MarkerPhotoInput {
	image_path?: string
	image_file?: File
}

export interface CreateMarkerPayload {
	latitude: string
	longitude: string
	description: string
	region_type: string
	pollution_type: {
		name: PollutionType | string
		description?: string
	}
	photos?: MarkerPhotoInput[]
}

export interface UpdateMarkerPayload {
	latitude?: string
	longitude?: string
	description?: string
	region_type?: string
	pollution_type?: {
		name: PollutionType | string
		description?: string
	}
}
