import {toast} from 'sonner'
import {CreateMarkerPayload, Marker, PollutionStatus} from '../domain/pollution.model'


export type ReportPayload = {
	type: string
	description: string
	photos: File[]
	region?: string
}

type UsePollutionReturn = ReturnType<typeof import('./usePollution').usePollution>

interface PollutionActionDeps {
	createMarker: UsePollutionReturn['createMarker']
	deleteMarker: UsePollutionReturn['deleteMarker']
}

interface ActionCallbacks {
	onSuccess?: () => void
	onError?: () => void
}

export const usePollutionActions = ({createMarker, deleteMarker}: PollutionActionDeps) => {
	const submitReport = (
		coordinates: [number, number] | null,
		data: ReportPayload,
		callbacks?: ActionCallbacks,
	) => {
		if (!coordinates) return
		const payload: CreateMarkerPayload = {
			latitude: coordinates[0].toString(),
			longitude: coordinates[1].toString(),
			description: data.description,
			region_type: data.region ?? 'Unknown',
			pollution_type: {name: data.type, description: ''},
		}

		createMarker(payload, {
			onSuccess: () => {
				toast.success('Метка успешно создана')
				callbacks?.onSuccess?.()
			},
			onError: () => {
				toast.error('Не удалось создать метку')
				callbacks?.onError?.()
			},
		})
	}

	const deleteReport = (marker: Marker | null, callbacks?: ActionCallbacks) => {
		if (!marker) return
		deleteMarker(marker.id, {
			onSuccess: () => {
				toast.success('Point deleted successfully')
				callbacks?.onSuccess?.()
			},
			onError: () => {
				toast.error('Failed to delete point')
				callbacks?.onError?.()
			},
		})
	}

	const changeStatus = (status?: PollutionStatus) => {
    if (status) {
        toast.info(`Смена статуса ${status} пока не поддерживается`)
        return
    }
    toast.info('Смена статуса пока не поддерживается')
}

	return {
		submitReport,
		deleteReport,
		changeStatus,
	}
}
