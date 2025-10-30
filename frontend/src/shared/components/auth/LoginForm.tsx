import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/shared/schemas/auth.schema'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import styles from '@/shared/styles/form.module.css'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading: boolean
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <Label htmlFor="username">Username</Label>
        <Input {...register('username')} placeholder="username" />
        {errors.username && <p className={styles.errorText}>{errors.username.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="password">Password</Label>
        <Input {...register('password')} type="password" placeholder="••••••••" />
        {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
