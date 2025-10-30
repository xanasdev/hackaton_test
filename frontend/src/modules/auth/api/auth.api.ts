import {httpClient} from '@/shared/api/http.client'
import {AuthTokens, AuthUser, LoginCredentials, LoginResponse, RegisterPayload, RegisterResponse} from '../domain/auth.model'
import {tokenStorage} from '../utils/token.storage'

const AuthEndpoints = {
	login: '/auth/login/',
	register: '/auth/register/',
	profile: '/auth/profile/',
	refresh: '/auth/token/refresh/',
} as const

export const authApi = {
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const {data} = await httpClient.post<LoginResponse>(AuthEndpoints.login, credentials)
		tokenStorage.setTokens(data.access, data.refresh)
		return data
	},

	async register(payload: RegisterPayload): Promise<RegisterResponse> {
		const {data} = await httpClient.post<RegisterResponse>(AuthEndpoints.register, payload)
		tokenStorage.setTokens(data.access, data.refresh)
		return data
	},

	async getCurrentUser(): Promise<AuthUser> {
		const {data} = await httpClient.get<AuthUser>(AuthEndpoints.profile)
		return {
			...data,
			name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}`.trim() : data.username,
		}
	},

	async refreshToken(refresh: string): Promise<AuthTokens> {
		const {data} = await httpClient.post<AuthTokens>(AuthEndpoints.refresh, {refresh})
		tokenStorage.setAccess(data.access)
		return data
	},

	async logout(): Promise<void> {
		tokenStorage.clear()
	},
}
