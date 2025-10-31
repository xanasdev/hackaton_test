'use client'

import {Moon, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'
import {useTranslations} from 'next-intl'
import {Button} from '@/shared/components/ui/Button'

export const ThemeToggle = () => {
	const {resolvedTheme, setTheme} = useTheme()
	const t = useTranslations('theme')

	if (!resolvedTheme) return null

	const isDark = resolvedTheme === 'dark'

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			title={t('toggle')}
			aria-label={t('toggle')}
		>
			{isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
		</Button>
	)
}
