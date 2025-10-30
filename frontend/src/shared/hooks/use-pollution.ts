import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pollutionService } from '@/shared/api/pollution.service'
import { CreatePollutionPointDto, UpdatePollutionPointDto, PollutionStatus, PollutionType } from '@/shared/types'

interface UsePollutionParams {
  status?: PollutionStatus
  type?: PollutionType
  region?: string
}

export const usePollution = (params?: UsePollutionParams) => {
  const queryClient = useQueryClient()

  const { data: points = [], isLoading } = useQuery({
    queryKey: ['pollution', params],
    queryFn: () => pollutionService.getAll(params),
  })

  const { data: stats } = useQuery({
    queryKey: ['pollution-stats'],
    queryFn: pollutionService.getStats,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreatePollutionPointDto) => pollutionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollution'] })
      queryClient.invalidateQueries({ queryKey: ['pollution-stats'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePollutionPointDto }) =>
      pollutionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollution'] })
      queryClient.invalidateQueries({ queryKey: ['pollution-stats'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pollutionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollution'] })
      queryClient.invalidateQueries({ queryKey: ['pollution-stats'] })
    },
  })

  return {
    points,
    stats,
    isLoading,
    createPoint: createMutation.mutate,
    updatePoint: updateMutation.mutate,
    deletePoint: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
