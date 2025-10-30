'use client'

import {PollutionDashboardStats} from '@/modules/pollution/ui/dashboard/PollutionDashboardStats'
import {PollutionDashboardHeader} from '@/modules/pollution/ui/dashboard/PollutionDashboardHeader'
import {PollutionDashboardTabs} from '@/modules/pollution/ui/dashboard/PollutionDashboardTabs'
import {DashboardHeader} from '@/modules/layout/DashboardHeader'
import {Card} from '@/shared/components/ui/Card'
import styles from '@/shared/styles/dashboard-page.module.css'
import {PollutionStatus} from '@/modules/pollution/domain/pollution.model'
import {usePollutionDashboard} from '@/modules/pollution/hooks/usePollutionDashboard'

export default function DashboardPage() {
	const {
		canManage,
		activeStatus,
		markers,
		stats,
		handleStatusChange,
		handleExport,
	} = usePollutionDashboard()

	if (!canManage) {
		return (
			<div className={styles.fullPage}>
				<DashboardHeader />
				<div className={styles.container}>
					<Card className={styles.accessDenied}>
						<h2 className={styles.accessTitle}>Доступ запрещен</h2>
						<p className='text-muted-foreground'>
							Для доступа к этой странице требуются права активиста или
							администратора.
						</p>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.fullPage}>
			<DashboardHeader />
			<div className={styles.container}>
				<PollutionDashboardHeader
					title='Dashboard'
					actionLabel='Экспорт отчета'
					onAction={handleExport}
				/>

				<PollutionDashboardStats stats={stats} />

				<PollutionDashboardTabs
					activeStatus={activeStatus}
					onStatusChange={handleStatusChange}
					markers={markers}
					statuses={[PollutionStatus.REPORTED, PollutionStatus.IN_PROGRESS, PollutionStatus.CLEANED]}
				/>
			</div>
		</div>
	)
}
