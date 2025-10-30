import { PollutionStatus, PollutionType } from '@/shared/types'

export const getMarkerColor = (status: PollutionStatus): string => {
  switch (status) {
    case PollutionStatus.REPORTED:
      return '#ef4444'
    case PollutionStatus.IN_PROGRESS:
      return '#f59e0b'
    case PollutionStatus.CLEANED:
      return '#10b981'
    case PollutionStatus.VERIFIED:
      return '#3b82f6'
    default:
      return '#6b7280'
  }
}

export const getMarkerIcon = (type: PollutionType): string => {
  switch (type) {
    case PollutionType.TRASH:
      return '🗑️'
    case PollutionType.OIL_SPILL:
      return '🛢️'
    case PollutionType.INDUSTRIAL_WASTE:
      return '🏭'
    case PollutionType.SEWAGE:
      return '💧'
    case PollutionType.PLASTIC:
      return '♻️'
    default:
      return '⚠️'
  }
}

export const getStatusColor = (status: PollutionStatus): string => {
  const colors = {
    [PollutionStatus.REPORTED]: 'bg-red-500',
    [PollutionStatus.IN_PROGRESS]: 'bg-yellow-500',
    [PollutionStatus.CLEANED]: 'bg-green-500',
    [PollutionStatus.VERIFIED]: 'bg-blue-500',
  }
  return colors[status] || 'bg-gray-500'
}
