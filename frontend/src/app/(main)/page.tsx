'use client'

import {useMemo, useState} from 'react'
import {useAuth, UserRole} from '@/modules/auth'
import {PollutionStatus} from '@/modules/pollution/domain/pollution.model'
import {ReportPollutionDialog} from '@/modules/pollution/ui/dialogs/ReportPollutionDialog'
import {FilterDrawer} from '@/modules/pollution/ui/filter/FilterDrawer'
import {PointDetailsDrawer} from '@/modules/pollution/ui/details/PointDetailsDrawer'
import {MapMarkersList} from '@/modules/pollution/ui/map/MapMarkersList'
import {MapWrapper} from '@/modules/pollution/ui/map/MapWrapper'
import {YandexMapView} from '@/modules/pollution/ui/map/YandexMapView'
import {NearbyDangerList} from '@/modules/pollution/ui/nearby/NearbyDangerList'
import {findNearbyMarkers} from '@/modules/pollution/utils/distance'
import {usePollution} from '@/modules/pollution/hooks/usePollution'
import {usePollutionActions} from '@/modules/pollution/hooks/usePollutionActions'
import {usePollutionState} from '@/modules/pollution/hooks/usePollutionState'
import {DashboardHeader} from '@/modules/layout/DashboardHeader'
import {DashboardLayout} from '@/modules/layout/DashboardLayout'
import {DashboardSidebar} from '@/modules/layout/DashboardSidebar'
import {ReportPollutionFormData} from '@/modules/pollution/schemas/report.schema'
import {useGeolocation} from '@/shared/hooks/use-geolocation'
import {extractCoordinates} from '@/shared/utils/map.utils'
import {YandexMapEvent} from '@/shared/interfaces/map.interface'

export default function HomePage() {
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

	const showNearby =
		nearbyMarkers.length > 0 && !nearbyDismissed && !!location.latitude

	const handleMapClick = (event: YandexMapEvent) => {
		const coordinates = extractCoordinates(event)
		setDraftCoordinates(coordinates)
		setReportDialogOpen(true)
	}

	const handleReportSubmit = (data: ReportPollutionFormData & {photos: File[]}) => {
		submitReport(draftCoordinates, data, {
			onSuccess: () => {
				setReportDialogOpen(false)
				setDraftCoordinates(null)
			},
		})
	}

	const handleReportDialogChange = (open: boolean) => {
		setReportDialogOpen(open)
		if (!open) {
			setDraftCoordinates(null)
		}
	}

	const handleDeleteMarker = () => {
		deleteReport(selectedMarker, {
			onSuccess: () => setSelectedMarker(null),
		})
	}

	const handleStatusChange = (status: PollutionStatus) => {
		changeStatus(status)
	}

	const handleDetailsClose = () => setSelectedMarker(null)

	const handleFilterDrawerChange = (open: boolean) => {
		setFiltersSheetOpen(open)
	}

	return (
		<>
			<DashboardLayout
				header={<DashboardHeader />}
				sidebar={
					<DashboardSidebar
						stats={stats}
						markers={markers}
						onMarkerClick={setSelectedMarker}
						onFilterClick={() => setFiltersSheetOpen(true)}
						onReportClick={() => setReportDialogOpen(true)}
					/>
				}
				map={
					<MapWrapper>
						<YandexMapView onMapClick={handleMapClick}>
							<MapMarkersList markers={markers} onMarkerClick={setSelectedMarker} />
						</YandexMapView>

						{showNearby && location.latitude && location.longitude && (
							<NearbyDangerList
								markers={nearbyMarkers}
								userLocation={{
									latitude: location.latitude,
									longitude: location.longitude,
								}}
								onMarkerClick={setSelectedMarker}
								onClose={() => setNearbyDismissed(true)}
							/>
						)}
					</MapWrapper>
				}
			/>

			<ReportPollutionDialog
				open={reportDialogOpen}
				onOpenChange={handleReportDialogChange}
				coords={draftCoordinates}
				onSubmit={handleReportSubmit}
				isLoading={isCreating}
			/>

			<PointDetailsDrawer
				marker={selectedMarker}
				userRole={user?.role_name as UserRole | undefined}
				onClose={handleDetailsClose}
				onStatusChange={handleStatusChange}
				onDelete={handleDeleteMarker}
			/>

			<FilterDrawer
				open={filtersSheetOpen}
				onOpenChange={handleFilterDrawerChange}
				status={filters.status}
				type={filters.type}
				onStatusChange={(status) => setFilters((prev) => ({...prev, status}))}
				onTypeChange={(type) => setFilters((prev) => ({...prev, type}))}
				onReset={() => setFilters({})}
			/>
		</>
	)
}
