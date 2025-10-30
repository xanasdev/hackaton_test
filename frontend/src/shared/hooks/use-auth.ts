import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/shared/api/auth.service'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      // Check token before making request
      const hasToken = !!Cookies.get('access_token')
      if (!hasToken) {
        return null
      }
      try {
        return await authService.getCurrentUser()
      } catch (error) {
        // If auth fails, clear token and return null
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        return null
      }
    },
    retry: false,
    staleTime: Infinity, // Never refetch automatically
    gcTime: Infinity, // Keep in cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)
      router.push('/')
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)
      router.push('/')
    },
  })

  const logout = () => {
    authService.logout()
    queryClient.setQueryData(['user'], null)
    router.push('/login')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  }
}
