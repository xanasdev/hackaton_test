import {Filter as FilterIcon, X} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/shared/components/ui/Select'
import {Label} from '@/shared/components/ui/Label'
import {Button} from '@/shared/components/ui/Button'
import {Badge} from '@/shared/components/ui/Badge'
import styles from '@/shared/styles/filter.module.css'
import {PollutionStatus, PollutionType} from '../../domain/pollution.model'

interface FilterPanelProps {
	status?: PollutionStatus
	type?: PollutionType
	onStatusChange: (status?: PollutionStatus) => void
	onTypeChange: (type?: PollutionType) => void
	onReset: () => void
}

const STATUS_LABELS: Record<PollutionStatus, string> = {
	[PollutionStatus.REPORTED]: 'Reported',
	[PollutionStatus.IN_PROGRESS]: 'In Progress',
	[PollutionStatus.CLEANED]: 'Cleaned',
	[PollutionStatus.VERIFIED]: 'Verified',
}

const TYPE_LABELS: Record<PollutionType, string> = {
	[PollutionType.TRASH]: 'Trash',
	[PollutionType.OIL_SPILL]: 'Oil Spill',
	[PollutionType.INDUSTRIAL_WASTE]: 'Industrial Waste',
	[PollutionType.SEWAGE]: 'Sewage',
	[PollutionType.PLASTIC]: 'Plastic',
	[PollutionType.OTHER]: 'Other',
}

export const FilterPanel = ({status, type, onStatusChange, onTypeChange, onReset}: FilterPanelProps) => {
	const hasActiveFilters = Boolean(status || type)

	return (
		<div className={styles.filterContainer}>
			{hasActiveFilters && (
				<div className={styles.activeFilters}>
					<div className='flex items-center gap-2 flex-wrap w-full'>
						<FilterIcon className='h-4 w-4' />
						<span className='text-sm font-semibold'>Active Filters:</span>
						{status && (
							<Badge variant='default' className={styles.filterBadge}>
								{STATUS_LABELS[status]}
								<X className='h-3 w-3 cursor-pointer' onClick={() => onStatusChange(undefined)} />
							</Badge>
						)}
						{type && (
							<Badge variant='default' className={styles.filterBadge}>
								{TYPE_LABELS[type]}
								<X className='h-3 w-3 cursor-pointer' onClick={() => onTypeChange(undefined)} />
							</Badge>
						)}
					</div>
				</div>
			)}

			<div className={styles.filterSection}>
				<Label className={styles.filterLabel}>Filter by Status</Label>
				<p className={styles.filterDescription}>Show pollution points by their current status</p>
				<Select value={status} onValueChange={(value) => onStatusChange(value === 'all' ? undefined : (value as PollutionStatus))}>
					<SelectTrigger>
						<SelectValue placeholder='All statuses' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Statuses</SelectItem>
						<SelectItem value={PollutionStatus.REPORTED}>🔴 Reported</SelectItem>
						<SelectItem value={PollutionStatus.IN_PROGRESS}>🟡 In Progress</SelectItem>
						<SelectItem value={PollutionStatus.CLEANED}>🟢 Cleaned</SelectItem>
						<SelectItem value={PollutionStatus.VERIFIED}>🔵 Verified</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className={styles.filterSection}>
				<Label className={styles.filterLabel}>Filter by Type</Label>
				<p className={styles.filterDescription}>Show pollution points by type of contamination</p>
				<Select value={type} onValueChange={(value) => onTypeChange(value === 'all' ? undefined : (value as PollutionType))}>
					<SelectTrigger>
						<SelectValue placeholder='All types' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Types</SelectItem>
						<SelectItem value={PollutionType.TRASH}>🗑️ Trash</SelectItem>
						<SelectItem value={PollutionType.OIL_SPILL}>🛢️ Oil Spill</SelectItem>
						<SelectItem value={PollutionType.INDUSTRIAL_WASTE}>🏭 Industrial Waste</SelectItem>
						<SelectItem value={PollutionType.SEWAGE}>💧 Sewage</SelectItem>
						<SelectItem value={PollutionType.PLASTIC}>♻️ Plastic</SelectItem>
						<SelectItem value={PollutionType.OTHER}>⚠️ Other</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{hasActiveFilters && (
				<div className={styles.filterActions}>
					<Button onClick={onReset} variant='outline' className={styles.resetButton}>
						Clear All
					</Button>
				</div>
			)}
		</div>
	)
}
