import {useQuery} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'

export const useRoles = () => {
	return useQuery({
		queryKey: ['roles'],
		queryFn: roleApi.getAll,
		staleTime: 5 * 60 * 1000,
	})
}
