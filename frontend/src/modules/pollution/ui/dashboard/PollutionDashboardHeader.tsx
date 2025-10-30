import {ReactNode} from 'react'
import {Download} from 'lucide-react'
import {Button} from '@/shared/components/ui/Button'
import styles from '@/shared/styles/dashboard-page.module.css'

interface PollutionDashboardHeaderProps {
	title: string
	actionLabel: string
	onAction: () => void
	actionIcon?: ReactNode
}

export const PollutionDashboardHeader = ({
	title,
	actionLabel,
	onAction,
	actionIcon = <Download className='h-4 w-4 mr-2' />,
}: PollutionDashboardHeaderProps) => (
	<div className={styles.pageHeader}>
		<h1 className={styles.pageTitle}>{title}</h1>
		<Button onClick={onAction}>
			{actionIcon}
			{actionLabel}
		</Button>
	</div>
)
