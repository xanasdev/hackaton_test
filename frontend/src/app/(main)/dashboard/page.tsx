'use client'

import {pollutionService} from '@/shared/api/pollution.service'
import {DashboardStats} from '@/shared/components/dashboard/DashboardStats'
import {PollutionCard} from '@/shared/components/dashboard/PollutionCard'
import {DashboardHeader} from '@/shared/components/layout/DashboardHeader'
import {Button} from '@/shared/components/ui/Button'
import {Card} from '@/shared/components/ui/Card'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/shared/components/ui/Tabs'
import {useAuth} from '@/shared/hooks/use-auth'
import {usePollution} from '@/shared/hooks/use-pollution'
import styles from '@/shared/styles/dashboard-page.module.css'
import {PollutionStatus, UserRole} from '@/shared/types'
import {Download} from 'lucide-react'
import {useState} from 'react'
import {toast} from 'sonner'

export default function DashboardPage() {
	const {user} = useAuth()
	const [activeTab, setActiveTab] = useState<PollutionStatus>(
		PollutionStatus.REPORTED,
	)
	const {points, stats, updatePoint} = usePollution({status: activeTab})

	const canManage =
		user?.role === UserRole.ACTIVIST || user?.role === UserRole.ADMIN

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
			const blob = await pollutionService.exportReport({status: activeTab})
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `pollution-report-${activeTab}-${Date.now()}.csv`
			a.click()
			toast.success('Отчет успешно экспортирован')
		} catch {
			toast.error('Не удалось экспортировать отчет')
		}
	}

	const handleStatusChange = (id: string, status: PollutionStatus) => {
		updatePoint(
			{id, data: {status}},
			{
				onSuccess: () => toast.success('Статус обновлен'),
				onError: () => toast.error('Не удалось обновить статус'),
			},
		)
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
						{points.length === 0 ? (
							<Card className={styles.emptyState}>
								<p className={styles.emptyText}>Точки не найдены</p>
							</Card>
						) : (
							<div className={styles.pointsGrid}>
								{points.map((point) => (
									<PollutionCard
										key={point.id}
										point={point}
										onStatusChange={handleStatusChange}
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
