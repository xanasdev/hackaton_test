import {Card, CardHeader, CardTitle, CardContent} from '@/shared/components/ui/Card'
import {AuthUser} from '@/modules/auth'
import styles from '@/shared/styles/account-page.module.css'

interface AccountMetaCardProps {
	user: AuthUser
}

const renderValue = (value?: string | null) => (value && value.trim().length > 0 ? value : '—')

export const AccountMetaCard = ({user}: AccountMetaCardProps) => (
	<Card>
		<CardHeader>
			<CardTitle className={styles.sectionTitle}>Основные данные</CardTitle>
		</CardHeader>
		<CardContent className={styles.cardContent}>
			<div className={styles.metaList}>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Имя пользователя</span>
					<span className={styles.metaValue}>{user.username}</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Имя</span>
					<span className={styles.metaValue}>{renderValue(user.first_name)}</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Фамилия</span>
					<span className={styles.metaValue}>{renderValue(user.last_name)}</span>
				</div>
				<div className={styles.metaItem}>
					<span className={styles.metaLabel}>Телефон</span>
					<span className={styles.metaValue}>{renderValue(user.phone)}</span>
				</div>
			</div>
		</CardContent>
	</Card>
)
