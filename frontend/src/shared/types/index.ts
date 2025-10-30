export enum PollutionType {
  TRASH = 'trash',
  OIL_SPILL = 'oil_spill',
  INDUSTRIAL_WASTE = 'industrial_waste',
  SEWAGE = 'sewage',
  PLASTIC = 'plastic',
  OTHER = 'other',
}

export enum PollutionStatus {
  REPORTED = 'reported',
  IN_PROGRESS = 'in_progress',
  CLEANED = 'cleaned',
  VERIFIED = 'verified',
}

export enum UserRole {
  USER = 'user',
  ACTIVIST = 'activist',
  ADMIN = 'admin',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface PollutionPoint {
  id: string
  latitude: number
  longitude: number
  type: PollutionType
  status: PollutionStatus
  description: string
  photos: string[]
  reportedBy: User
  assignedTo?: User
  createdAt: string
  updatedAt: string
  region?: string
  severity?: number
}

export interface PollutionStats {
  total: number
  reported: number
  inProgress: number
  cleaned: number
  byType: Record<PollutionType, number>
  byRegion: Record<string, number>
}

export interface CreatePollutionPointDto {
  latitude: number
  longitude: number
  type: PollutionType
  description: string
  photos: File[]
  region?: string
}

export interface UpdatePollutionPointDto {
  status?: PollutionStatus
  assignedTo?: string
  description?: string
}
