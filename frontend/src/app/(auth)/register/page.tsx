'use client'

import {AuthCard} from '@/shared/components/auth/AuthCard'
import {AuthFooter} from '@/shared/components/auth/AuthFooter'
import {RegisterForm} from '@/shared/components/auth/RegisterForm'
import {useAuth} from '@/shared/hooks/use-auth'
import {RegisterFormData} from '@/shared/schemas/auth.schema'

export default function RegisterPage() {
	const {register: registerUser, isRegisterLoading} = useAuth()

	const handleSubmit = (data: RegisterFormData) => {
		registerUser(data)
	}

	return (
		<AuthCard
			title='Create Account'
			subtitle='Join us in cleaning the Caspian Sea'
		>
			<RegisterForm onSubmit={handleSubmit} isLoading={isRegisterLoading} />
			<AuthFooter
				text='Already have an account?'
				linkText='Sign in'
				linkHref='/login'
			/>
		</AuthCard>
	)
}
