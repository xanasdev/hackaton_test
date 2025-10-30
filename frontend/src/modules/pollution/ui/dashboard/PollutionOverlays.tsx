import {PollutionStatus} from '../../domain/pollution.model'
import {ReportPollutionFormData} from '../../schemas/report.schema'
import {ReportPollutionDialog} from '../dialogs/ReportPollutionDialog'
import {PointDetailsDrawer} from '../details/PointDetailsDrawer'
import {FilterDrawer} from '../filter/FilterDrawer'
import {Marker} from '../../domain/pollution.model'
import {UserRole} from '@/modules/auth'

interface FilterState {
	status?: PollutionStatus
	type?: string
}

interface PollutionOverlaysProps {
	reportDialogOpen: boolean
	onReportDialogChange: (open: boolean) => void
	draftCoordinates: [number, number] | null
	onReportSubmit: (data: ReportPollutionFormData & {photos: File[]}) => void
	isCreating: boolean
	selectedMarker: Marker | null
	userRole?: UserRole
	onDetailsClose: () => void
	onStatusChange: (status: PollutionStatus) => void
	onDeleteMarker: () => void
	filtersOpen: boolean
	onFiltersOpenChange: (open: boolean) => void
	filters: FilterState
	onStatusFilterChange: (status?: PollutionStatus) => void
	onTypeFilterChange: (type?: string) => void
	onFiltersReset: () => void
}

export const PollutionOverlays = ({
	reportDialogOpen,
	onReportDialogChange,
	draftCoordinates,
	onReportSubmit,
	isCreating,
	selectedMarker,
	userRole,
	onDetailsClose,
	onStatusChange,
	onDeleteMarker,
	filtersOpen,
	onFiltersOpenChange,
	filters,
	onStatusFilterChange,
	onTypeFilterChange,
	onFiltersReset,
}: PollutionOverlaysProps) => (
	<>
		<ReportPollutionDialog
			open={reportDialogOpen}
			onOpenChange={onReportDialogChange}
			coords={draftCoordinates}
			onSubmit={onReportSubmit}
			isLoading={isCreating}
		/>

		<PointDetailsDrawer
			marker={selectedMarker}
			userRole={userRole}
			onClose={onDetailsClose}
			onStatusChange={onStatusChange}
			onDelete={onDeleteMarker}
		/>

		<FilterDrawer
			open={filtersOpen}
			onOpenChange={onFiltersOpenChange}
			status={filters.status}
			type={filters.type}
			onStatusChange={onStatusFilterChange}
			onTypeChange={onTypeFilterChange}
			onReset={onFiltersReset}
		/>
	</>
)
