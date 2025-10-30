import { useState } from 'react'
import { PollutionPoint, PollutionStatus, PollutionType } from '@/shared/types'
import { usePollution } from '@/shared/hooks/use-pollution'
import { toast } from 'sonner'

interface ReportData {
  type: PollutionType
  description: string
  photos: File[]
  region?: string
}

export const useMapHandlers = () => {
  const [selectedPoint, setSelectedPoint] = useState<PollutionPoint | null>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [newPointCoords, setNewPointCoords] = useState<[number, number] | null>(null)
  const [filters, setFilters] = useState<{
    status?: PollutionStatus
    type?: PollutionType
  }>({})

  const { points, stats, createPoint, updatePoint, deletePoint, isCreating } = usePollution(filters)

  const handleMapClick = (coords: [number, number]) => {
    setNewPointCoords(coords)
    setReportDialogOpen(true)
  }

  const handleReportSubmit = (data: ReportData) => {
    if (!newPointCoords) return

    createPoint(
      {
        latitude: newPointCoords[0],
        longitude: newPointCoords[1],
        type: data.type,
        description: data.description,
        photos: data.photos,
        region: data.region,
      },
      {
        onSuccess: () => {
          toast.success('Pollution point reported successfully')
          setReportDialogOpen(false)
          setNewPointCoords(null)
        },
        onError: () => {
          toast.error('Failed to report pollution point')
        },
      }
    )
  }

  const handleStatusChange = (status: PollutionStatus) => {
    if (!selectedPoint) return

    updatePoint(
      { id: selectedPoint.id, data: { status } },
      {
        onSuccess: () => {
          toast.success('Status updated successfully')
          setSelectedPoint(null)
        },
        onError: () => {
          toast.error('Failed to update status')
        },
      }
    )
  }

  const handleDelete = () => {
    if (!selectedPoint) return

    deletePoint(selectedPoint.id, {
      onSuccess: () => {
        toast.success('Point deleted successfully')
        setSelectedPoint(null)
      },
      onError: () => {
        toast.error('Failed to delete point')
      },
    })
  }

  return {
    selectedPoint,
    setSelectedPoint,
    reportDialogOpen,
    setReportDialogOpen,
    filterOpen,
    setFilterOpen,
    newPointCoords,
    setNewPointCoords,
    filters,
    setFilters,
    points,
    stats,
    isCreating,
    handleMapClick,
    handleReportSubmit,
    handleStatusChange,
    handleDelete,
  }
}
