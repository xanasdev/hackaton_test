import {PollutionPoint, PollutionStatus, PollutionType} from '@/shared/types'
import {Placemark} from '@pbe/react-yandex-maps'

interface PollutionMarkerProps {
	point: PollutionPoint
	onClick: (point: PollutionPoint) => void
}

const getMarkerColor = (status: PollutionStatus): string => {
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

const getMarkerIcon = (type: PollutionType): string => {
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

export function PollutionMarker({point, onClick}: PollutionMarkerProps) {
	return (
		<Placemark
			geometry={[point.latitude, point.longitude]}
			options={{
				preset: 'islands#circleIcon',
				iconColor: getMarkerColor(point.status),
			}}
			properties={{
				iconContent: getMarkerIcon(point.type),
				balloonContent: `
          <div style="padding: 8px;">
            <strong>${point.type}</strong><br/>
            Status: ${point.status}<br/>
            ${point.description}
          </div>
        `,
			}}
			onClick={() => onClick(point)}
		/>
	)
}
