import {Card, CardHeader, CardTitle, CardContent, CardAction} from '@/shared/components/ui/Card'
import {Button} from '@/shared/components/ui/Button'
import {Badge} from '@/shared/components/ui/Badge'
import {useRouter} from 'next/navigation'
import {UserRole} from '@/modules/auth'
import styles from '@/shared/styles/account-page.module.css'

interface AccountActionsCardProps {
	role?: string | null
}

const roleBadges: Record<string, {label: string; tone: 'default' | 'secondary' | 'outline'}> = {
	ADMIN: {label: 'Администратор', tone: 'default'},
	ACTIVIST: {label: 'Экоактивист', tone: 'secondary'},
	CITIZEN: {label: 'Житель', tone: 'outline'},
}

const getRoleBadge = (role?: string | null) => {
	if (!role) return {label: 'Гость', tone: 'outline' as const}
	return roleBadges[role] ?? {label: role.replace(/_/g, ' '), tone: 'outline' as const}
}

export const AccountActionsCard = ({role}: AccountActionsCardProps) => {
	const router = useRouter()
	const {label, tone} = getRoleBadge(role)

	return (
		<Card>
			<CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<CardTitle className={styles.sectionTitle}>Доступные действия</CardTitle>
				<CardAction>
					<Badge variant={tone} className='px-3 py-1 text-xs uppercase tracking-wide'>
						{label}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className={`${styles.cardContent} ${styles.actions}`}>
				<Button
					variant='secondary'
					onClick={() => router.push('/')}
					className='grow sm:grow-0'
				>
					Открыть карту
				</Button>
				<Button
					variant='outline'
					onClick={() => router.push('/dashboard')}
					disabled={role !== UserRole.ACTIVIST && role !== UserRole.ADMIN}
					className='grow sm:grow-0'
				>
					Панель активиста
				</Button>
				<Button
					variant='outline'
					onClick={() => router.push('/admin')}
					disabled={role !== UserRole.ADMIN}
					className='grow sm:grow-0'
				>
					Админ-центр
				</Button>
			</CardContent>
		</Card>
	)
}
