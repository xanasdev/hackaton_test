import {useAuth} from '@/modules/auth'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import styles from '@/shared/styles/header.module.css'
import {
	BarChart3,
	Home,
	LogIn,
	LogOut,
	User,
	UserCircle,
	UserPlus,
	Waves,
} from 'lucide-react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export const DashboardHeader = () => {
	const {user, logout} = useAuth()
	const pathname = usePathname()

	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<Waves className={styles.logoIcon} />
				<div className={styles.logoText}>
					<h1 className={styles.title}>Caspian Clean Map</h1>
					<p className={styles.subtitle}>
						Мониторинг загрязнений Каспийского моря
					</p>
				</div>
			</div>

			<nav className={styles.nav}>
				{user ? (
					<>
						<Link
							href='/'
							className={
								pathname === '/' ? styles.navLinkActive : styles.navLink
							}
						>
							<Home className='h-4 w-4' />
							<span>Карта</span>
						</Link>
						<Link
							href='/dashboard'
							className={
								pathname === '/dashboard'
									? styles.navLinkActive
									: styles.navLink
							}
						>
							<BarChart3 className='h-4 w-4' />
							<span>Dashboard</span>
						</Link>
						<Link
							href='/account'
							className={
								pathname === '/account' ? styles.navLinkActive : styles.navLink
							}
						>
							<UserCircle className='h-4 w-4' />
							<span>Профиль</span>
						</Link>
					</>
				) : (
					<>
						<Link
							href='/login'
							className={
								pathname === '/login' ? styles.navLinkActive : styles.navLink
							}
						>
							<LogIn className='h-4 w-4' />
							<span>Войти</span>
						</Link>
						<Link
							href='/register'
							className={
								pathname === '/register' ? styles.navLinkActive : styles.navLink
							}
						>
							<UserPlus className='h-4 w-4' />
							<span>Регистрация</span>
						</Link>
					</>
				)}
			</nav>

			<div className={styles.actions}>
				{user && (
					<>
						<Link href='/account' className={styles.userInfo}>
							<User className='h-4 w-4' />
							<span className={styles.userEmail}>{user.email}</span>
							<Badge variant='outline' className={styles.roleBadge}>
								{user.role_name ?? user.role ?? 'USER'}
							</Badge>
						</Link>
						<Button variant='ghost' size='sm' onClick={logout}>
							<LogOut className='h-4 w-4' />
							<span className={styles.logoutText}>Выйти</span>
						</Button>
					</>
				)}
			</div>
		</header>
	)
}
