import axiosInstance from '@/shared/lib/axios'
import { User } from '@/shared/types'
import Cookies from 'js-cookie'

interface LoginDto {
  email: string
  password: string
}

interface RegisterDto extends LoginDto {
  name: string
}

interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data)
    Cookies.set('auth_token', response.data.token, { expires: 7 })
    return response.data
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data)
    Cookies.set('auth_token', response.data.token, { expires: 7 })
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>('/auth/me')
    return response.data
  },

  logout() {
    Cookies.remove('auth_token')
  },
}
