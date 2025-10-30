import {toast} from 'sonner'
import {CreateMarkerPayload, Marker, PollutionStatus} from '../domain/pollution.model'

export type ReportPayload = {
	type: string
	description: string
	photos: File[]
	region?: string
}

const fileToBase64 = (file: File) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve((reader.result as string) ?? '')
		reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
		reader.readAsDataURL(file)
	})

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
	const submitReport = async (
		coordinates: [number, number] | null,
		data: ReportPayload,
		callbacks?: ActionCallbacks,
	) => {
		if (!coordinates) return

		let photosPayload: CreateMarkerPayload['photos']
		if (data.photos?.length) {
			try {
				const converted = await Promise.all(
					data.photos.map(async (file) => ({image_path: await fileToBase64(file)})),
				)
				photosPayload = converted
			} catch {
				toast.error('Не удалось обработать изображения')
				callbacks?.onError?.()
				return
			}
		}
		const payload: CreateMarkerPayload = {
			latitude: coordinates[0].toString(),
			longitude: coordinates[1].toString(),
			description: data.description,
			region_type: data.region ?? 'Unknown',
			pollution_type: {name: data.type, description: ''},
			photos: photosPayload,
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
