import {useMemo} from 'react'
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/shared/components/ui/Card'
import {Badge} from '@/shared/components/ui/Badge'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/shared/components/ui/Select'
import {useUsers, useRoles, useAssignRole} from '@/modules/auth'
import styles from '@/shared/styles/account-page.module.css'

interface AccountUsersManagerProps {
	canManage: boolean
}

export const AccountUsersManager = ({canManage}: AccountUsersManagerProps) => {
	const {data: users = [], isLoading: isUsersLoading, isError: usersError} = useUsers({enabled: canManage})
	const {data: roles = [], isLoading: isRolesLoading, isError: rolesError} = useRoles({enabled: canManage})
	const assignRole = useAssignRole()

	const sortedUsers = useMemo(() => users.slice().sort((a, b) => a.username.localeCompare(b.username)), [users])
	const roleOptions = useMemo(() => roles.slice().sort((a, b) => a.name.localeCompare(b.name)), [roles])

	if (!canManage) return null

	return (
		<Card>
			<CardHeader>
				<CardTitle className={styles.sectionTitle}>Пользователи</CardTitle>
				<CardDescription>Назначайте роли и контролируйте доступ на платформе.</CardDescription>
			</CardHeader>
			<CardContent className={styles.cardContent}>
				{(isUsersLoading || isRolesLoading) && <p className='text-sm text-muted-foreground'>Загрузка данных...</p>}
				{(usersError || rolesError) && <p className='text-sm text-destructive'>Нет доступа к списку пользователей.</p>}
				{!isUsersLoading && !usersError && sortedUsers.length === 0 && (
					<p className='text-sm text-muted-foreground'>Пользователи не найдены.</p>
				)}
				<div className={styles.userList}>
					{!usersError &&
						sortedUsers.map((user) => {
							const currentRole = roleOptions.find((role) => role.id === user.role)
							return (
								<div key={user.id} className={styles.userRow}>
									<div className={styles.userMeta}>
										<p className='font-medium'>{user.username}</p>
										<span className={styles.userMail}>{user.email}</span>
									</div>
									<div className={styles.userActions}>
										<Badge variant='outline'>{currentRole?.name ?? 'Нет роли'}</Badge>
										<Select
											disabled={assignRole.isPending || isRolesLoading}
											defaultValue={user.role ? String(user.role) : undefined}
											onValueChange={(value) => assignRole.mutate({user_id: user.id, role_id: Number(value)})}
										>
											<SelectTrigger className='w-[220px]'>
												<SelectValue placeholder='Выберите роль' />
											</SelectTrigger>
											<SelectContent>
												{roleOptions.map((role) => (
													<SelectItem key={role.id} value={String(role.id)}>
														{role.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							)
						})}
				</div>
			</CardContent>
		</Card>
	)
}
