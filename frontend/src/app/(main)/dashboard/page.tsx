'use client'

import {DashboardStats} from '@/shared/components/dashboard/DashboardStats'
import {DashboardHeader} from '@/shared/components/layout/DashboardHeader'
import {Button} from '@/shared/components/ui/Button'
import {Card} from '@/shared/components/ui/Card'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/shared/components/ui/Tabs'
import {useAuth} from '@/modules/auth'
import {PollutionCard} from '@/modules/pollution/ui/PollutionCard'
import {usePollution, pollutionApi, PollutionStatus} from '@/modules/pollution'
import styles from '@/shared/styles/dashboard-page.module.css'
import {Download} from 'lucide-react'
import {useState} from 'react'
import {toast} from 'sonner'

export default function DashboardPage() {
	const {user} = useAuth()
	const [activeTab, setActiveTab] = useState<PollutionStatus>(
		PollutionStatus.REPORTED,
	)
	const {markers, stats} = usePollution({status: activeTab})

	const canManage =
		user?.role_name === 'ACTIVIST' || user?.role_name === 'ADMIN'

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

	const handleExport = async () => {
		try {
			const blob = await pollutionApi.exportReport()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `pollution-report-${Date.now()}.csv`
			a.click()
			toast.success('Отчет успешно экспортирован')
		} catch {
			toast.error('Не удалось экспортировать отчет')
		}
	}

	return (
		<div className={styles.fullPage}>
			<DashboardHeader />
			<div className={styles.container}>
				<div className={styles.pageHeader}>
					<h1 className={styles.pageTitle}>Dashboard</h1>
					<Button onClick={handleExport}>
						<Download className='h-4 w-4 mr-2' />
						Экспорт отчета
					</Button>
				</div>

				<DashboardStats stats={stats} />

				<Tabs
					value={activeTab}
					onValueChange={(v) => setActiveTab(v as PollutionStatus)}
					className={styles.tabs}
				>
					<TabsList>
						<TabsTrigger value={PollutionStatus.REPORTED}>Новые</TabsTrigger>
						<TabsTrigger value={PollutionStatus.IN_PROGRESS}>
							В работе
						</TabsTrigger>
						<TabsTrigger value={PollutionStatus.CLEANED}>Очищено</TabsTrigger>
					</TabsList>

					<TabsContent value={activeTab} className={styles.tabContent}>
						{markers.length === 0 ? (
							<Card className={styles.emptyState}>
								<p className={styles.emptyText}>Точки не найдены</p>
							</Card>
						) : (
							<div className={styles.pointsGrid}>
								{markers.map((marker) => (
									<PollutionCard
										key={marker.id}
										marker={marker}
									/>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
