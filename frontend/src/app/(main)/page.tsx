'use client'

import {ReportPollutionDialog} from '@/shared/components/dialogs/ReportPollutionDialog'
import {DashboardLayout} from '@/shared/components/layout/DashboardLayout'
import {DashboardHeader} from '@/shared/components/layout/DashboardHeader'
import {DashboardSidebar} from '@/shared/components/layout/DashboardSidebar'
import {MapMarkersList} from '@/shared/components/map/MapMarkersList'
import {MapWrapper} from '@/shared/components/map/MapWrapper'
import {YandexMapView} from '@/shared/components/map/YandexMapView'
import {NearbyDangerList} from '@/shared/components/nearby/NearbyDangerList'
import {FilterDrawer} from '@/shared/components/sheets/FilterDrawer'
import {PointDetailsDrawer} from '@/shared/components/sheets/PointDetailsDrawer'
import {useAuth} from '@/shared/hooks/use-auth'
import {useGeolocation} from '@/shared/hooks/use-geolocation'
import {usePollution} from '@/shared/hooks/use-pollution'
import {findNearbyPoints} from '@/shared/utils/distance.utils'
import {UserRole} from '@/shared/types'
import {useMemo, useState} from 'react'
import {useMapActions} from './hooks/useMapActions'
import {useMapState} from './hooks/useMapState'

export default function HomePage() {
	const {user} = useAuth()
	const [nearbyDismissed, setNearbyDismissed] = useState(false)
	const location = useGeolocation()

	const {
		selectedPoint,
		setSelectedPoint,
		reportDialogOpen,
		setReportDialogOpen,
		filterOpen,
		setFilterOpen,
		newPointCoords,
		setNewPointCoords,
		filters,
		setFilters,
	} = useMapState()

	const {points, stats, createPoint, updatePoint, deletePoint, isCreating} =
		usePollution(filters)

	const {handleMapClick, handleReportSubmit, handleStatusChange, handleDelete} =
		useMapActions({
			setNewPointCoords,
			setReportDialogOpen,
			setSelectedPoint,
			createPoint,
			updatePoint,
			deletePoint,
			selectedPoint,
		})

	const nearbyPoints = useMemo(() => {
		if (!location.latitude || !location.longitude) return []
		return findNearbyPoints(location.latitude, location.longitude, points, 50)
	}, [location.latitude, location.longitude, points])

	const showNearby =
		nearbyPoints.length > 0 && !nearbyDismissed && !!location.latitude

	return (
		<>
			<DashboardLayout
				header={<DashboardHeader />}
				sidebar={
					<DashboardSidebar
						stats={stats}
						points={points}
						onPointClick={setSelectedPoint}
						onFilterClick={() => setFilterOpen(true)}
						onReportClick={() => setReportDialogOpen(true)}
					/>
				}
				map={
					<MapWrapper>
						<YandexMapView onMapClick={handleMapClick}>
							<MapMarkersList points={points} onMarkerClick={setSelectedPoint} />
						</YandexMapView>

						{showNearby && location.latitude && location.longitude && (
							<NearbyDangerList
								nearbyPoints={nearbyPoints}
								userLocation={{
									latitude: location.latitude,
									longitude: location.longitude,
								}}
								onPointClick={setSelectedPoint}
								onClose={() => setNearbyDismissed(true)}
							/>
						)}
					</MapWrapper>
				}
			/>

			<ReportPollutionDialog
				open={reportDialogOpen}
				onOpenChange={setReportDialogOpen}
				coords={newPointCoords}
				onSubmit={(data) => handleReportSubmit(newPointCoords, data)}
				isLoading={isCreating}
			/>

			<PointDetailsDrawer
				point={selectedPoint}
				userRole={user?.role_name as UserRole | undefined}
				onClose={() => setSelectedPoint(null)}
				onStatusChange={handleStatusChange}
				onDelete={handleDelete}
			/>

			<FilterDrawer
				open={filterOpen}
				onOpenChange={setFilterOpen}
				status={filters.status}
				type={filters.type}
				onStatusChange={(status) => setFilters((f) => ({...f, status}))}
				onTypeChange={(type) => setFilters((f) => ({...f, type}))}
				onReset={() => setFilters({})}
			/>
		</>
	)
}
