// This file is deprecated - use hooks.interface.ts and components.interface.ts instead
// Kept for backwards compatibility

export type { MapState, MapFilters, MapHandlers, YandexMapEvent } from './hooks.interface'
export type { ReportFormData as ReportData } from './components.interface'

export interface MutationCallbacks {
  onSuccess?: () => void
  onError?: () => void
}
