import {useMemo} from 'react'
import {Card} from '@/shared/components/ui/Card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/shared/components/ui/Tabs'
import {PollutionCard} from '../PollutionCard'
import styles from '@/shared/styles/dashboard-page.module.css'
import {Marker, PollutionStatus} from '../../domain/pollution.model'

interface PollutionDashboardTabsProps {
	activeStatus: PollutionStatus
	onStatusChange: (status: PollutionStatus) => void
	markers: Marker[]
	statuses?: PollutionStatus[]
}

const DEFAULT_STATUSES: PollutionStatus[] = [
	PollutionStatus.REPORTED,
	PollutionStatus.IN_PROGRESS,
	PollutionStatus.CLEANED,
]

export const PollutionDashboardTabs = ({
	activeStatus,
	onStatusChange,
	markers,
	statuses = DEFAULT_STATUSES,
}: PollutionDashboardTabsProps) => {
	const renderedMarkers = useMemo(() => markers, [markers])

	return (
		<Tabs
			value={activeStatus}
			onValueChange={(value) => onStatusChange(value as PollutionStatus)}
			className={styles.tabs}
		>
			<TabsList>
				{statuses.map((status) => (
					<TabsTrigger key={status} value={status}>
						{getStatusLabel(status)}
					</TabsTrigger>
				))}
			</TabsList>

			<TabsContent value={activeStatus} className={styles.tabContent}>
				{renderedMarkers.length === 0 ? (
					<Card className={styles.emptyState}>
						<p className={styles.emptyText}>Точки не найдены</p>
					</Card>
				) : (
					<div className={styles.pointsGrid}>
						{renderedMarkers.map((marker) => (
							<PollutionCard key={marker.id} marker={marker} />
						))}
					</div>
				)}
			</TabsContent>
		</Tabs>
	)
}

const STATUS_LABELS: Record<PollutionStatus, string> = {
	[PollutionStatus.REPORTED]: 'Новые',
	[PollutionStatus.IN_PROGRESS]: 'В работе',
	[PollutionStatus.CLEANED]: 'Очищено',
	[PollutionStatus.VERIFIED]: 'Проверено',
}

const getStatusLabel = (status: PollutionStatus) => STATUS_LABELS[status] ?? status
