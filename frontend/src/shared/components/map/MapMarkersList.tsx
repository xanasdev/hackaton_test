import { Placemark } from '@pbe/react-yandex-maps'
import { PollutionPoint, PollutionStatus } from '@/shared/types'

interface MapMarkersListProps {
  points: PollutionPoint[]
  onMarkerClick: (point: PollutionPoint) => void
}

const getMarkerColor = (status: PollutionStatus): string => {
  switch (status) {
    case PollutionStatus.REPORTED: return '#ef4444'
    case PollutionStatus.IN_PROGRESS: return '#f59e0b'
    case PollutionStatus.CLEANED: return '#10b981'
    case PollutionStatus.VERIFIED: return '#3b82f6'
    default: return '#6b7280'
  }
}

export function MapMarkersList({ points, onMarkerClick }: MapMarkersListProps) {
  return (
    <>
      {points.map((point) => (
        <Placemark
          key={point.id}
          geometry={[point.latitude, point.longitude]}
          options={{
            preset: 'islands#circleIcon',
            iconColor: getMarkerColor(point.status),
          }}
          onClick={() => onMarkerClick(point)}
        />
      ))}
    </>
  )
}
