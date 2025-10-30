'use client'

import {Card} from '@/shared/components/ui/Card'
import styles from '@/shared/styles/dashboard.module.css'
import {PollutionStats} from '../../domain/pollution.model'

interface PollutionDashboardStatsProps {
	stats?: PollutionStats
}

export const PollutionDashboardStats = ({stats}: PollutionDashboardStatsProps) => {
	if (!stats) return null

	return (
		<div className={styles.statsGrid}>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>Total</p>
				<p className='text-2xl font-bold'>{stats.total}</p>
			</Card>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>Reported</p>
				<p className='text-2xl font-bold text-red-500'>{stats.reported}</p>
			</Card>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>In Progress</p>
				<p className='text-2xl font-bold text-yellow-500'>{stats.inProgress}</p>
			</Card>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>Cleaned</p>
				<p className='text-2xl font-bold text-green-500'>{stats.cleaned}</p>
			</Card>
		</div>
	)
}
