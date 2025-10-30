import {useCallback, useMemo, useState} from 'react'
import {useAuth, UserRole} from '@/modules/auth'
import {useGeolocation} from '@/shared/hooks/use-geolocation'
import {extractCoordinates} from '@/shared/utils/map.utils'
import {YandexMapEvent} from '@/shared/interfaces/map.interface'
import {findNearbyMarkers} from '../utils/distance'
import {ReportPollutionFormData} from '../schemas/report.schema'
import {Marker, PollutionStatus} from '../domain/pollution.model'
import {usePollution} from './usePollution'
import {usePollutionActions} from './usePollutionActions'
import {usePollutionState} from './usePollutionState'

export const usePollutionHome = () => {
	const {user} = useAuth()
	const [nearbyDismissed, setNearbyDismissed] = useState(false)
	const location = useGeolocation()

	const {
		selectedMarker,
		setSelectedMarker,
		reportDialogOpen,
		setReportDialogOpen,
		filtersSheetOpen,
		setFiltersSheetOpen,
		draftCoordinates,
		setDraftCoordinates,
		filters,
		setFilters,
	} = usePollutionState()

	const {markers, stats, createMarker, deleteMarker, isCreating} = usePollution(filters)

	const {submitReport, deleteReport, changeStatus} = usePollutionActions({
		createMarker,
		deleteMarker,
	})

	const nearbyMarkers = useMemo(() => {
		if (!location.latitude || !location.longitude) return []
		return findNearbyMarkers(location.latitude, location.longitude, markers, 50)
	}, [location.latitude, location.longitude, markers])

	const showNearby = nearbyMarkers.length > 0 && !nearbyDismissed && !!location.latitude

	const handleMapClick = useCallback(
		(event: YandexMapEvent) => {
			const coordinates = extractCoordinates(event)
			setDraftCoordinates(coordinates)
			setReportDialogOpen(true)
		},
		[setDraftCoordinates, setReportDialogOpen],
	)

	const handleReportSubmit = useCallback(
		(data: ReportPollutionFormData & {photos: File[]}) => {
			submitReport(draftCoordinates, data, {
				onSuccess: () => {
					setReportDialogOpen(false)
					setDraftCoordinates(null)
				},
			})
		},
		[draftCoordinates, submitReport, setDraftCoordinates, setReportDialogOpen],
	)

	const handleReportDialogChange = useCallback(
		(open: boolean) => {
			setReportDialogOpen(open)
			if (!open) {
				setDraftCoordinates(null)
			}
		},
		[setDraftCoordinates, setReportDialogOpen],
	)

	const handleDeleteMarker = useCallback(() => {
		deleteReport(selectedMarker, {
			onSuccess: () => setSelectedMarker(null),
		})
	}, [deleteReport, selectedMarker, setSelectedMarker])

	const handleStatusChange = useCallback(
		(status: PollutionStatus) => {
			changeStatus(status)
		},
		[changeStatus],
	)

	const handleDetailsClose = useCallback(() => setSelectedMarker(null), [setSelectedMarker])

	const handleFilterDrawerChange = useCallback(
		(open: boolean) => {
			setFiltersSheetOpen(open)
		},
		[setFiltersSheetOpen],
	)

	const handleStatusFilterChange = useCallback(
		(status?: PollutionStatus) => {
			setFilters((prev) => ({...prev, status}))
		},
		[setFilters],
	)

	const handleTypeFilterChange = useCallback(
		(type?: string) => {
			setFilters((prev) => ({...prev, type}))
		},
		[setFilters],
	)

	const handleFiltersReset = useCallback(() => setFilters({}), [setFilters])

	const openReportDialog = useCallback(() => setReportDialogOpen(true), [setReportDialogOpen])
	const openFilterDrawer = useCallback(() => setFiltersSheetOpen(true), [setFiltersSheetOpen])
	const dismissNearby = useCallback(() => setNearbyDismissed(true), [])
	const selectMarker = useCallback((marker: Marker | null) => setSelectedMarker(marker), [setSelectedMarker])

	const userRole = user?.role_name as UserRole | undefined

	return {
		userRole,
		location,
		markers,
		stats,
		nearbyMarkers,
		showNearby,
		reportDialogOpen,
		filtersSheetOpen,
		filters,
		selectedMarker,
		draftCoordinates,
		isCreating,
		handleMapClick,
		handleReportSubmit,
		handleReportDialogChange,
		handleDeleteMarker,
		handleStatusChange,
		handleDetailsClose,
		handleFilterDrawerChange,
		handleStatusFilterChange,
		handleTypeFilterChange,
		handleFiltersReset,
		openReportDialog,
		openFilterDrawer,
		dismissNearby,
		selectMarker,
	}
}
