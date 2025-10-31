'use client'

import {ReactNode} from 'react'
import {ThemeProvider as NextThemesProvider} from 'next-themes'

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeProvider = ({children}: ThemeProviderProps) => (
	<NextThemesProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
		{children}
	</NextThemesProvider>
)
