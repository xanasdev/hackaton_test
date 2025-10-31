import {ReactNode} from 'react'
import {AlertTriangle, CheckCircle, Clock, Filter, MapPin, Plus, TrendingUp} from 'lucide-react'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {ScrollArea} from '@/shared/components/ui/ScrollArea'
import {Separator} from '@/shared/components/ui/Separator'
import {Marker, PollutionStats} from '@/modules/pollution/domain/pollution.model'
import {getMarkerIcon} from '@/modules/pollution/utils/marker-style'
import styles from '@/shared/styles/sidebar.module.css'
import {useTranslations, useLocale} from 'next-intl'

interface DashboardSidebarProps {
	stats?: PollutionStats
	markers: Marker[]
	onFilterClick: () => void
	onReportClick: () => void
	onMarkerClick: (marker: Marker) => void
}

interface StatCardProps {
	icon: ReactNode
	value: number
	label: string
	className?: string
}

const StatCard = ({icon, value, label, className}: StatCardProps) => (
	<div className={styles.statCard}>
		<div className={className}>{icon}</div>
		<div className={styles.statContent}>
			<p className={styles.statValue}>{value}</p>
			<p className={styles.statLabel}>{label}</p>
		</div>
	</div>
)

export const DashboardSidebar = ({stats, markers, onFilterClick, onReportClick, onMarkerClick}: DashboardSidebarProps) => {
	const t = useTranslations('home.sidebar')
	const tType = useTranslations('pollutionType')
	const locale = useLocale()

	return (
		<div className={styles.container}>
			<div className={styles.section}>
				<div className={styles.statsGrid}>
					<StatCard icon={<TrendingUp />} value={stats?.total ?? 0} label={t('total')} className={styles.statIconBlue} />
					<StatCard icon={<AlertTriangle />} value={stats?.reported ?? 0} label={t('active')} className={styles.statIconRed} />
					<StatCard icon={<Clock />} value={stats?.inProgress ?? 0} label={t('inProgress')} className={styles.statIconYellow} />
					<StatCard icon={<CheckCircle />} value={stats?.cleaned ?? 0} label={t('cleaned')} className={styles.statIconGreen} />
				</div>
			</div>

			<Separator />

			<div className={styles.section}>
				<div className={styles.actions}>
					<Button onClick={onReportClick} size='sm' className='flex-1'>
						<Plus className='mr-2 h-4 w-4' />
						{t('report')}
					</Button>
					<Button variant='outline' size='sm' onClick={onFilterClick}>
						<Filter className='mr-2 h-4 w-4' />
						{t('filters')}
					</Button>
				</div>
			</div>

			<Separator />

			<div className={styles.listSection}>
				<div className={styles.listHeader}>
					<h2 className={styles.sectionTitle}>{t('listTitle')}</h2>
					<Badge variant='secondary'>{markers.length}</Badge>
				</div>
				<ScrollArea className={styles.scrollArea}>
					<div className={styles.pointsList}>
						{markers.length === 0 ? (
							<div className={styles.emptyState}>
								<MapPin className='h-10 w-10 text-muted-foreground' />
								<p className={styles.emptyText}>{t('empty')}</p>
							</div>
						) : (
							markers.map((marker) => (
								<button key={marker.id} className={styles.pointCard} onClick={() => onMarkerClick(marker)}>
									<span className={styles.emoji}>{getMarkerIcon(marker.pollution_type.name)}</span>
									<div className={styles.pointContent}>
										<p className={styles.pointTitle}>{tType(marker.pollution_type.name as never)}</p>
										<p className={styles.pointDescription}>
											{marker.description.length > 60 ? `${marker.description.slice(0, 60)}...` : marker.description}
										</p>
										<p className={styles.pointDate}>
											{t('reportedOn')}{' '}
											{new Date(marker.created_at).toLocaleDateString(locale, {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</p>
									</div>
								</button>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}
