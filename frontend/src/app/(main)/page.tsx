'use client'

import {PollutionDashboardMain} from '@/modules/pollution/ui/dashboard/PollutionDashboardMain'
import {PollutionOverlays} from '@/modules/pollution/ui/dashboard/PollutionOverlays'
import {usePollutionHome} from '@/modules/pollution/hooks/usePollutionHome'

export default function HomePage() {
	const {
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
	} = usePollutionHome()

	return (
		<>
			<PollutionDashboardMain
				stats={stats}
				markers={markers}
				nearbyMarkers={nearbyMarkers}
				location={location}
				showNearby={showNearby}
				onMapClick={handleMapClick}
				onMarkerSelect={(marker) => selectMarker(marker)}
				onNearbyDismiss={dismissNearby}
				onRequestReport={openReportDialog}
				onRequestFilter={openFilterDrawer}
			/>

			<PollutionOverlays
				reportDialogOpen={reportDialogOpen}
				onReportDialogChange={handleReportDialogChange}
				draftCoordinates={draftCoordinates}
				onReportSubmit={handleReportSubmit}
				isCreating={isCreating}
				selectedMarker={selectedMarker}
				userRole={userRole}
				onDetailsClose={handleDetailsClose}
				onStatusChange={handleStatusChange}
				onDeleteMarker={handleDeleteMarker}
				filtersOpen={filtersSheetOpen}
				onFiltersOpenChange={handleFilterDrawerChange}
				filters={filters}
				onStatusFilterChange={handleStatusFilterChange}
				onTypeFilterChange={handleTypeFilterChange}
				onFiltersReset={handleFiltersReset}
			/>
		</>
	)
}
