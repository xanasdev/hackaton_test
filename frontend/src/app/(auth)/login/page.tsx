'use client'

import { useAuth } from '@/shared/hooks/use-auth'
import { LoginFormData } from '@/shared/schemas/auth.schema'
import { AuthCard } from '@/shared/components/auth/AuthCard'
import { LoginForm } from '@/shared/components/auth/LoginForm'
import { AuthFooter } from '@/shared/components/auth/AuthFooter'

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth()

  const handleSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to your account">
      <LoginForm onSubmit={handleSubmit} isLoading={isLoginLoading} />
      <AuthFooter text="Don't have an account?" linkText="Register" linkHref="/register" />
    </AuthCard>
  )
}
