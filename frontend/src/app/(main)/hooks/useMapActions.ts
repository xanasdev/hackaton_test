import { PollutionPoint, PollutionStatus } from '@/shared/types'
import { YandexMapEvent, ReportData } from '@/shared/interfaces/map.interface'
import { extractCoordinates } from '@/shared/utils/map.utils'
import { toast } from 'sonner'

interface UseMapActionsProps {
  setNewPointCoords: (coords: [number, number] | null) => void
  setReportDialogOpen: (open: boolean) => void
  setSelectedPoint: (point: PollutionPoint | null) => void
  createPoint: any
  updatePoint: any
  deletePoint: any
  selectedPoint: PollutionPoint | null
}

export const useMapActions = ({
  setNewPointCoords,
  setReportDialogOpen,
  setSelectedPoint,
  createPoint,
  updatePoint,
  deletePoint,
  selectedPoint,
}: UseMapActionsProps) => {
  const handleMapClick = (e: YandexMapEvent) => {
    const coords = extractCoordinates(e)
    setNewPointCoords(coords)
    setReportDialogOpen(true)
  }

  const handleReportSubmit = (
    newPointCoords: [number, number] | null,
    data: ReportData
  ) => {
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
        onError: () => toast.error('Failed to report pollution point'),
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
        onError: () => toast.error('Failed to update status'),
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
      onError: () => toast.error('Failed to delete point'),
    })
  }

  return {
    handleMapClick,
    handleReportSubmit,
    handleStatusChange,
    handleDelete,
  }
}
